# Architecture: PerformanceLab

## Overview

PerformanceLab is a three-tier web application: a React frontend, a Go REST API backend, and a MySQL database. All tiers run on a single AWS Lightsail instance and are deployed automatically via GitHub Actions on every push to `main`.

```
Browser (React/Vite)
        │  HTTP/JSON (port 80/443 via Nginx)
        ▼
   Nginx (reverse proxy)
        │  /api/* → :8080   /  → frontend static files
        ▼
   Go API Server (:8080)
        │  TCP (port 3306)
        ▼
   MySQL Database
```

---

## Frontend Architecture

- **Framework:** React 18 + Vite
- **Routing:** React Router v6 (client-side routing)
- **Structure:**
  ```
  frontend/
    src/
      pages/          # One component per page (Home, Dashboard, Habits, Workouts)
      components/     # Shared UI (Navbar)
      api/            # Centralized fetch helpers (api.js)
    index.html
    vite.config.js
  ```
- **API calls:** All requests go to `/api/...`. In development, Vite proxies `/api` to `localhost:8080`. In production, Nginx routes `/api` to the Go server.
- **Build output:** `frontend/dist/` — static HTML/JS/CSS served by Nginx.

---

## Backend Architecture

- **Language:** Go
- **Router:** `chi` (lightweight, idiomatic)
- **Structure:**
  ```
  backend/
    main.go           # Entry point, router setup, DB connection
    handlers/         # HTTP handler functions per resource
      health.go
      habits.go
      workouts.go
      users.go
    models/           # Structs and DB query functions
      habit.go
      workout.go
      user.go
  ```
- **Authentication:** JWT tokens issued at `/login`, verified via middleware on protected routes.
- **CORS:** Configured via chi middleware to allow requests from the frontend origin.

---

## Database Interaction

- The Go backend connects to MySQL using `go-sql-driver/mysql`.
- Each model file contains the struct definition and the SQL queries for that resource.
- No ORM — raw SQL for simplicity and performance visibility.
- Connection string pulled from environment variable `DATABASE_URL`.

---

## Deployment Architecture

```
GitHub (push to main)
        │
        ▼
GitHub Actions (CI/CD)
  1. SSH into Lightsail
  2. git pull origin main
  3. Build Go binary:  go build -o performancelab ./backend
  4. Build frontend:   npm run build (in /frontend)
  5. Copy dist/ to Nginx web root
  6. Restart Go service: systemctl restart performancelab
        │
        ▼
AWS Lightsail (Ubuntu)
  ├── Nginx  (port 80/443, TLS via Let's Encrypt)
  ├── Go binary running as systemd service (:8080)
  └── MySQL  (port 3306, local only)
```

---

## How the Layers Communicate

1. **Browser → Nginx:** User's browser makes requests to `https://yourdomain.com`. Nginx handles TLS termination.
2. **Nginx → Go API:** Requests to `/api/*` are proxied to `localhost:8080` (the Go server).
3. **Nginx → Static files:** All other requests serve the built React app from `/var/www/performancelab/dist/`.
4. **Go → MySQL:** The Go server queries MySQL on `localhost:3306` using the `DATABASE_URL` env var.
5. **React → API:** In production, relative `/api/...` URLs hit the same origin (Nginx routes them). In development, Vite's proxy config forwards them to `localhost:8080`.
