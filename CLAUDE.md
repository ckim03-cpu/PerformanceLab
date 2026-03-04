# CLAUDE.md — PerformanceLab

This file provides context for AI-assisted development on PerformanceLab.

## Project Overview

PerformanceLab is a full-stack web app for tracking habits, workouts, and personal performance metrics. Users log in, create daily habits, log workout sets, and view everything on a dashboard.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Backend | Go (chi router) |
| Database | MySQL |
| Deployment | AWS Lightsail + GitHub Actions |

## Repository Structure

```
performance-lab/
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── pages/         # Home, Dashboard, Habits, Workouts
│   │   ├── components/    # Shared UI (Navbar)
│   │   └── api/           # API helpers (api.js)
│   └── vite.config.js
├── backend/               # Go API
│   ├── main.go
│   ├── handlers/          # HTTP handlers per resource
│   └── models/            # Structs + SQL queries
├── docs/
│   ├── project-proposal.md
│   ├── architecture.md
│   └── database-schema.md
└── .github/workflows/deploy.yml
```

## Development Commands

### Backend
```bash
cd backend
go mod tidy                # Install dependencies
go run main.go             # Start dev server on :8080
go build -o performancelab # Build binary
```

### Frontend
```bash
cd frontend
npm install                # Install dependencies
npm run dev                # Start dev server on :5173
npm run build              # Build to dist/
```

### Environment Variables (backend)
```
DATABASE_URL=user:password@tcp(localhost:3306)/performancelab
JWT_SECRET=your-secret-key
PORT=8080
```

## API Summary

All API routes are prefixed with `/api`. The `/health` endpoint has no prefix.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Health check |
| POST | `/api/users` | No | Register |
| POST | `/api/login` | No | Login → JWT |
| GET | `/api/habits` | JWT | List habits |
| POST | `/api/habits` | JWT | Create habit |
| POST | `/api/habit-log` | JWT | Log habit completion |
| GET | `/api/workouts` | JWT | List workouts |
| POST | `/api/workouts` | JWT | Log workout |

## Database

Four tables: `users`, `habits`, `habit_logs`, `workouts`. See `docs/database-schema.md` for full DDL.

## Deployment

- Triggered by push to `main` via GitHub Actions (`.github/workflows/deploy.yml`)
- Server: AWS Lightsail (Ubuntu), Nginx reverse proxy, MySQL local
- Nginx serves frontend static files from `/var/www/performancelab/dist/`
- Nginx proxies `/api/*` to Go server on `:8080`
- Go runs as a systemd service named `performancelab`

## Coding Conventions

- Go handlers live in `backend/handlers/`, one file per resource
- SQL queries live in `backend/models/`, not inline in handlers
- React pages live in `frontend/src/pages/`, one file per page
- All fetch calls go through `frontend/src/api/api.js`
- Use environment variables for all secrets — never hardcode credentials
- Return consistent JSON from API: `{"data": ...}` for success, `{"error": "message"}` for errors
