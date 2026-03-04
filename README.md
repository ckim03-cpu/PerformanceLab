# PerformanceLab

A personal performance tracking dashboard for habits, workouts, and productivity metrics.

## What It Is

PerformanceLab lets you log daily habits and workout sessions in one place and view your progress on a unified dashboard. Built with a React frontend, Go REST API, and MySQL database.

## Project Structure

```
performance-lab/
├── frontend/          # React + Vite app
├── backend/           # Go REST API
├── docs/              # Project documentation
│   ├── project-proposal.md
│   ├── architecture.md
│   └── database-schema.md
├── .github/workflows/ # CI/CD pipeline
├── README.md
└── CLAUDE.md
```

## Running Locally

### Backend (Go)

```bash
cd backend

# Install dependencies
go mod tidy

# Set environment variables
export DATABASE_URL="user:password@tcp(localhost:3306)/performancelab"
export JWT_SECRET="your-secret-key"
export PORT=8080

# Run
go run main.go
```

The API will be available at `http://localhost:8080`.

### Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Run dev server (proxies /api to localhost:8080)
npm run dev
```

The app will be available at `http://localhost:5173`.

### Database

Run the SQL script from `docs/database-schema.md` against your MySQL instance to create all tables.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| POST | `/api/users` | Create a new user |
| POST | `/api/login` | Authenticate, returns JWT |
| GET | `/api/habits` | Get current user's habits |
| POST | `/api/habits` | Create a new habit |
| POST | `/api/habit-log` | Mark a habit complete for today |
| GET | `/api/workouts` | Get current user's workout history |
| POST | `/api/workouts` | Log a new workout set |

## Deployment

Deployment is automated via GitHub Actions. Every push to `main`:

1. SSHes into the Lightsail server
2. Pulls latest code
3. Builds the Go binary
4. Builds the React app
5. Restarts the systemd service

See `.github/workflows/deploy.yml` and `docs/architecture.md` for details.

## Docs

- [Project Proposal](docs/project-proposal.md)
- [Architecture](docs/architecture.md)
- [Database Schema](docs/database-schema.md)
