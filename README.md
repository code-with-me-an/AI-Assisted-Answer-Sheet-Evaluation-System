# AI-Assisted Answer Sheet Evaluation System

An AI-assisted system for evaluating student answer sheets efficiently and consistently.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Django + Django REST Framework
- **Database:** PostgreSQL 16
- **Containerization:** Docker and Docker Compose

## Project Structure

```text
AI-Assisted-Answer-Sheet-Evaluation-System/
├── frontend/              # React application
├── backend/               # Django application
├── frontend.Dockerfile
├── backend.Dockerfile
├── docker-compose.yml
└── README.md
```

## Architecture

```text
Browser -> React (5173) -> Django (8000) -> PostgreSQL (5432)
```

Docker Compose runs the `frontend`, `backend`, and `db` services. Django connects to PostgreSQL using the Docker service name `db`.

## Prerequisites

- Git
- Docker Desktop with Docker Compose

Verify the installation:

```bash
docker --version
docker compose version
```

## Run with Docker

Clone the repository and enter the project root:

```bash
git clone <REPOSITORY_URL>
cd AI-Assisted-Answer-Sheet-Evaluation-System
```

Build and start all services:

```bash
docker compose up --build -d
```

Run the initial database migration:

```bash
docker compose exec backend python manage.py migrate
```

Open the application at [http://localhost:5173](http://localhost:5173). The Django backend is available at [http://localhost:8000](http://localhost:8000).

Check service status:

```bash
docker compose ps
```

## Common Commands

Start existing containers:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

View logs:

```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

Apply model changes:

```bash
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

Create a Django admin user:

```bash
docker compose exec backend python manage.py createsuperuser
```

Run another Django management command:

```bash
docker compose exec backend python manage.py <command>
```

## Database Persistence

PostgreSQL data is stored in the named Docker volume `postgres_data`. `docker compose down` keeps this data.

To remove the database and start fresh:

```bash
docker compose down -v
docker compose up --build -d
docker compose exec backend python manage.py migrate
```

> `docker compose down -v` permanently deletes the PostgreSQL volume and its data.

Source changes are mounted into the frontend and backend containers for development. Rebuild after changing Docker configuration or dependencies:

```bash
docker compose up --build -d
```
