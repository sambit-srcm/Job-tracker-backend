# Job Tracker Backend

REST API for tracking job applications — company, role, status, work type, and notes — backed by PostgreSQL.

## Stack

- Node.js + Express 5
- PostgreSQL + Drizzle ORM
- Jest + Supertest for testing

## Getting started

### With Docker (recommended)

```bash
cp .env.example .env
docker compose up --build
```

This starts the API on `http://localhost:8080` and a Postgres database on `localhost:5432`.

### Locally

Requires a running Postgres instance matching `DATABASE_URL`.

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run dev       # nodemon, restarts on change
# or
npm start
```

## Environment variables

See [.env.example](.env.example).

| Variable                                                                | Description                                                           | Default                   |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------- |
| `PORT`                                                                  | Port the API listens on                                               | `8080`                    |
| `DATABASE_URL`                                                          | Postgres connection string                                            | —                         |
| `CORS_ORIGIN`                                                           | Comma-separated list of allowed origins                               | `http://localhost:5173`   |
| `NODE_ENV`                                                              | `development` \| `production`                                         | `development`             |
| `DEBUG_LOGGING`                                                         | Log request bodies (may contain PII) — opt-out in dev, opt-in in prod | `true` outside production |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` / `POSTGRES_PORT` | Used by `docker-compose.yml` to provision the database                | see `.env.example`        |

## API

Base path for application resources: `/applications`

| Method | Path                | Description                                                           |
| ------ | ------------------- | --------------------------------------------------------------------- |
| GET    | `/health`           | Liveness check                                                        |
| GET    | `/health/db`        | Database connectivity check                                           |
| GET    | `/applications`     | List applications, optionally filtered by `?status=` and `?workType=` |
| POST   | `/applications`     | Create an application                                                 |
| GET    | `/applications/:id` | Fetch one application                                                 |
| PUT    | `/applications/:id` | Replace an application                                                |
| DELETE | `/applications/:id` | Delete an application                                                 |

### Application shape

```json
{
  "id": "uuid",
  "company": "string",
  "role": "string",
  "status": "Applied | Interviewing | Hired | Rejected",
  "workType": "Remote | Hybrid | Onsite",
  "location": "string | null",
  "date": "YYYY-MM-DD",
  "notes": "string",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

`company`, `role`, and `date` are required on create/update. `location` is required unless `workType` is `Remote`.

## Scripts

| Command                             | Description                                      |
| ----------------------------------- | ------------------------------------------------ |
| `npm start`                         | Run the server                                   |
| `npm run dev`                       | Run the server with nodemon                      |
| `npm test`                          | Run the test suite                               |
| `npm run test:coverage`             | Run tests with coverage                          |
| `npm run lint` / `npm run lint:fix` | Lint the codebase                                |
| `npm run format`                    | Format with Prettier                             |
| `npm run db:generate`               | Generate a Drizzle migration from schema changes |
| `npm run db:migrate`                | Apply migrations                                 |
| `npm run db:studio`                 | Open Drizzle Studio                              |

## License

[MIT](LICENSE)
