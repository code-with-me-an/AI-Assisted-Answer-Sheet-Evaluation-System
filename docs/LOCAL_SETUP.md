# Local Architecture and Setup Guide

AutoGrade runs fully locally using Docker Compose, local PostgreSQL, Django native authentication with DRF tokens, and the React frontend.

```text
React -> Bearer Token -> Django REST API -> Django ORM -> Local PostgreSQL Docker Container
```

## Quick Start

1. Start all local services:
   ```bash
   docker compose up --build
   ```

2. Run database migrations:
   ```bash
   docker compose exec backend python manage.py migrate
   ```

3. (Optional) Create a superuser:
   ```bash
   docker compose exec backend python manage.py createsuperuser
   ```

4. Open the application in your browser:
   `http://localhost:5173`

## Environment Configuration

Configuration is managed via `.env` (copy from `.env.example`):

- **POSTGRES_DB**: `autograde`
- **POSTGRES_USER**: `autograde`
- **POSTGRES_PASSWORD**: `autograde_dev_password`
- **DATABASE_URL**: `postgresql://autograde:autograde_dev_password@db:5432/autograde`
- **DJANGO_SECRET_KEY**: Local Django secret key
- **DJANGO_DEBUG**: `true`
- **DJANGO_ALLOWED_HOSTS**: `localhost,127.0.0.1,backend`
- **CORS_ALLOWED_ORIGINS**: `http://localhost:5173,http://127.0.0.1:5173`
- **VITE_API_URL**: `http://localhost:8000`

## Architecture Components

- **Frontend**: React 19 + Vite running on port `5173`.
- **Backend**: Django 6 + DRF running with Gunicorn on port `8000`.
- **Database**: PostgreSQL 16 Alpine container running on port `5432` with persistent Docker volume `postgres_data`.
- **Authentication**: Local Django authentication (`/api/auth/signup/`, `/api/auth/login/`, `/api/auth/logout/`, `/api/auth/profile/`).
- **File Storage**: Local persistent media volume `media_data` mounted at `/app/media`.
