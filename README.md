# NexOS Ultimate

Production-oriented browser Cloud OS scaffold with Django + React.

## Deployment Guide

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

