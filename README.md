# NexOS Ultimate

Production-oriented browser Cloud OS scaffold with Django + React.

## Run NexOS on a Local PC (Step-by-Step)

This guide is for **local development** on Windows, macOS, or Linux.

---

## Option A (Recommended): Run everything with Docker

### 1) Install prerequisites
- **Git**
- **Docker Desktop** (Windows/macOS) or **Docker Engine + Docker Compose plugin** (Linux)

Verify installation:

```bash
git --version
docker --version
docker compose version
```

### 2) Clone the project

```bash
git clone <your-repo-url> NexOS
cd NexOS
```

### 3) Create backend environment file
Copy the backend environment template:

- On macOS/Linux:

```bash
cp backend/.env.example backend/.env
```

- On Windows PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
```

### 4) Edit `backend/.env`
Set local-safe values (example):

- `DJANGO_SECRET_KEY` → any long random string
- `DJANGO_DEBUG=True`
- `DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1`
- `CSRF_TRUSTED_ORIGINS=http://localhost,http://127.0.0.1`
- Keep `POSTGRES_*` and `REDIS_URL` as compose defaults unless you changed compose services
- Add real `CLOUDINARY_*` values if using file upload features

### 5) Build and start containers

```bash
docker compose up --build -d
```

### 6) Run database migrations

```bash
docker compose exec backend python manage.py migrate
```

### 7) Create admin user (optional but recommended)

```bash
docker compose exec backend python manage.py createsuperuser
```

### 8) Open NexOS
- Frontend: `http://localhost:5173`
- Backend API root/health: `http://localhost:8000/health/`

### 9) Useful Docker commands

```bash
# view logs
docker compose logs -f

# stop services
docker compose down

# stop + delete volumes (WARNING: removes local DB data)
docker compose down -v
```

---

## Option B: Run without Docker (manual local setup)

Use this if you prefer running frontend/backend directly.

### 1) Install prerequisites
- **Python 3.11+**
- **Node.js 20+**
- **PostgreSQL 14+**
- **Redis 6+**

### 2) Clone project

```bash
git clone <your-repo-url> NexOS
cd NexOS
```

### 3) Backend setup

```bash
cd backend
python -m venv .venv
```

Activate virtual environment:
- macOS/Linux:

```bash
source .venv/bin/activate
```

- Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements/base.txt
```

Create environment file:
- macOS/Linux:

```bash
cp .env.example .env
```

- Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Update `.env` with your local PostgreSQL/Redis credentials.

Run migrations and backend server:

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### 4) Frontend setup (new terminal)

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

### 5) Open app
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

---

## First-time smoke test checklist

1. Signup works from UI.
2. Login works and routes to dashboard.
3. Opening Desktop apps does not crash UI.
4. `GET /health/` returns success.

---

## Production Deployment Guide (Server)

### 1) Prerequisites
- Docker Engine + Docker Compose plugin
- DNS entry for your domain
- TLS certs (or use managed ingress/ALB)

### 2) Configure environment
- Copy `backend/.env.example` to `backend/.env`.
- Set secure values:
  - `DJANGO_SECRET_KEY`
  - `DJANGO_ALLOWED_HOSTS` (your domain)
  - `CSRF_TRUSTED_ORIGINS` (https://your-domain)
  - `POSTGRES_*`
  - `REDIS_URL`
  - `CLOUDINARY_*`
  - `AI_PROVIDER`

### 3) Build and run
```bash
docker compose build
docker compose up -d
```

### 4) Run migrations
```bash
docker compose exec backend python manage.py migrate
```

### 5) Create admin user
```bash
docker compose exec backend python manage.py createsuperuser
```

### 6) Verify health
- API health: `http://<host>/health/`
- Frontend: `http://<host>/`

### 7) Production hardening checklist
- Put TLS in front (Nginx/Ingress/ALB + HTTPS)
- Restrict firewall to 80/443 only
- Rotate secrets and store in secret manager
- Enable DB backups and retention policy
- Set centralized log shipping
- Add uptime/alerting monitors for `/health/`

### 8) CI/CD flow
- GitHub Actions workflow at `.github/workflows/ci.yml` validates:
  - backend compileability
  - frontend build
- Recommended deploy flow:
  1. Merge to `main`
  2. Build/push backend+frontend images
  3. Pull on server
  4. `docker compose up -d`
  5. `docker compose exec backend python manage.py migrate`
