# SIPANTAU

SIPANTAU is a web application for monitoring food commodities in Sukabumi. It brings together daily farmer and market prices, estimated harvests, availability, demand, and balance data so participating agencies can enter data, view dashboards, and produce short-term market-price forecasts.

The interface and domain terminology are in Indonesian. The application supports distinct agency workflows for agriculture, trade, food security, and TPID (regional inflation-control team) users, with administrator-only data management and activity reporting.

## Architecture

```text
Browser
  │
  ▼
Nginx (port 80/443)
  ├── /      ──► Next.js frontend (port 3000)
  └── /api/* ──► Laravel API / PHP-FPM (port 9000) ──► MySQL 8
                                      │
                                      └─────────────► FastAPI ML service (port 8001)
                                                         └── Chronos 2 model
```

| Directory | Responsibility | Main technology |
| --- | --- | --- |
| `frontend/` | Responsive UI, dashboards, maps, charts, login, and same-origin API proxy routes | Next.js 16, React, TypeScript, Tailwind CSS, Leaflet, Recharts |
| `backend/` | REST API, token authentication, roles/permissions, validation, persistence, and activity logs | Laravel 12, PHP 8.2+, Sanctum, Spatie Permission |
| `ml-service/` | Three-day price forecasting endpoint | FastAPI, PyTorch, Chronos 2 |
| `docker-compose*.yml` | Local/production services and the separately managed MySQL database | Docker Compose, Nginx, MySQL 8 |

### Data flow

1. The frontend signs users in through Laravel and receives a Sanctum bearer token.
2. Next.js route handlers in `frontend/src/app/api/` forward browser requests to Laravel with that token.
3. Laravel authorizes the action by role/permission, persists the data, and records activity.
4. For a forecast, Laravel combines recent price and availability data, calls the ML service, and returns recent prices with a three-day prediction.

Primary entities are commodities (`komoditas`), markets (`pasars`), daily farmer prices, daily market prices, harvest forecasts, daily availability/demand/balance, users/roles, and activity records.

## Features

- Commodity and market management.
- Bulk daily input for farmer prices, market prices, harvest estimates, and availability/demand/balance.
- Role-based dashboards for agency users and TPID.
- Sukabumi market map, commodity views, price charts, and three-day price predictions.
- Token-based authentication and an administrator activity log.

## Prerequisites

- Docker Engine with Docker Compose v2 (recommended)
- Git

For a non-Docker setup, install PHP 8.2+ with Composer, Node.js 20+, MySQL 8+, and Python 3.12+. The ML model is large and downloaded by the Python dependencies and/or on first model use; Docker is the simplest supported setup.

## Quick start with Docker

MySQL is intentionally separate from the application stack. The app expects an existing Docker network and persistent MySQL volume.

1. Create the root database environment file and replace all placeholders:

   ```bash
   cp .env.example .env
   ```

   Set `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, and `MYSQL_PASSWORD` in `.env`.

2. Create the shared Docker resources once:

   ```bash
   docker network create sipantau-network
   docker volume create sipantau_mysql_data
   ```

3. Configure Laravel:

   ```bash
   cp backend/.env.example backend/.env
   ```

   In `backend/.env`, use the same database values as root `.env` and set:

   ```dotenv
   DB_CONNECTION=mysql
   DB_HOST=mysql-db
   DB_PORT=3306
   DB_DATABASE=your_database_name
   DB_USERNAME=your_database_user
   DB_PASSWORD=your_database_password
   ```

4. Create `frontend/.env.local` with the Docker-internal API address:

   ```dotenv
   BACKEND_URL=http://nginx
   ```

   Nginx routes `/api` to Laravel. For a non-container frontend, set `BACKEND_URL` to the reachable API host instead.

5. Start MySQL, then build and start the application:

   ```bash
   docker compose --env-file .env -f docker-compose.db.yml up -d
   docker compose up --build -d
   ```

6. Generate the Laravel key and migrate. Then seed the TPID role before running the aggregate seeder (the current aggregate seeder references that role), followed by the activity-report permission:

   ```bash
   docker compose exec backend composer install
   docker compose exec backend php artisan key:generate
   docker compose exec backend php artisan migrate
   docker compose exec backend php artisan db:seed --class=PredictPermissionSeeder
   docker compose exec backend php artisan db:seed
   docker compose exec backend php artisan db:seed --class=UserActivityPermissionSeeder
   ```

Open [http://localhost](http://localhost). Check the API:

```bash
curl http://localhost/api/health
```

Expected response: `{"status":"ok"}`.

> The supplied seeders create roles, permissions, and commodities, but no administrator account. Establish the first admin through Laravel/Tinker or your approved operational process; `/api/register` itself requires an authenticated admin.

## Common operations

```bash
# Follow service logs
docker compose logs -f frontend backend ml nginx

# Stop application containers (database volume remains)
docker compose down

# Stop the database container (database volume remains)
docker compose --env-file .env -f docker-compose.db.yml down

# Apply later schema changes
docker compose exec backend php artisan migrate

# Run project seeders
docker compose exec backend php artisan db:seed
```

Nginx publishes only port 80 (and port 443 in production). The frontend, PHP-FPM API, MySQL, and ML service are not directly exposed to the host.

## Local development without Docker

Run each component in a separate terminal after configuring environment files and a reachable MySQL database.

```bash
# Laravel API
cd backend
composer install
cp .env.example .env # if not already configured
php artisan key:generate
php artisan migrate
php artisan db:seed --class=PredictPermissionSeeder
php artisan db:seed
php artisan db:seed --class=UserActivityPermissionSeeder
php artisan serve
```

```bash
# Next.js frontend
cd frontend
npm ci
npm run dev
```

```bash
# ML service
cd ml-service
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

When Laravel runs outside Docker, its prediction controller currently calls `http://ml-service:8001`. Ensure that hostname resolves to the ML service (or adjust it for the local environment). Set `BACKEND_URL` in `frontend/.env.local` to the Laravel server URL.

## Roles and access

Laravel uses Sanctum bearer tokens and Spatie permissions. Apart from `POST /api/login` and `GET /api/health`, API routes require `Authorization: Bearer <token>`.

| Role | Intended access |
| --- | --- |
| `admin` | Register accounts; manage markets and commodities; read daily data; review activity reports |
| `dinas_pertanian` | View commodities; submit farmer prices and harvest forecasts |
| `dinas_perdagangan` | View commodities; submit market prices |
| `dinas_ketahanan_pangan` | View commodities; submit availability, demand, and balance |
| `tpid` | View commodities and request price predictions |
| `user` | Basic authenticated role with no seeded domain permissions |

## API overview

All paths are prefixed with `/api`. Write endpoints accept grouped `items` arrays, allowing several dated values in one request.

| Endpoint | Method | Access | Purpose |
| --- | --- | --- | --- |
| `/health` | GET | Public | API health check |
| `/login` | POST | Public | Obtain a Sanctum token |
| `/logout`, `/me` | POST, GET | Authenticated | End session / inspect current user |
| `/komoditas` | GET / POST | Permission / admin | List or create commodities |
| `/pasar` | GET / POST | Admin | List or create markets |
| `/harga-petani` | POST / GET | Agriculture / admin | Write / read farmer prices |
| `/harga-pasar` | POST / GET | Trade / admin | Write / read market prices |
| `/panen` | POST / GET | Agriculture / admin | Write / read harvest forecasts |
| `/ketersediaan` | POST / GET | Food security / admin | Write / read availability, demand, and balance |
| `/predict?pasar_id=&komoditas_id=` | GET | TPID | Return recent values and a 3-day forecast |
| `/activities`, `/activities/summary`, `/activities/period`, `/activities/user/{user}` | GET | Activity-report permission | Review user activity |

See [backend/README.md](backend/README.md) for request body examples. [backend/routes/api.php](backend/routes/api.php) is the authoritative endpoint and access-control reference.

## Validation and checks

```bash
# Backend test suite
cd backend && composer test

# Frontend lint and production build
cd frontend && npm ci && npm run ci

# Verify Compose configuration
docker compose --env-file .env -f docker-compose.db.yml config
docker compose config
```

## Deployment notes

`docker-compose-production.yml` exposes ports 80 and 443 and mounts `/etc/letsencrypt` read-only for TLS material. It loads `frontend/.env.production`; provide it with an appropriate `BACKEND_URL` before deployment. The external `sipantau-network` and `sipantau_mysql_data` resources remain required.

Do not commit `.env`, `backend/.env`, `frontend/.env.local`, or production environment files. Keep database credentials and token-bearing logs out of version control.
