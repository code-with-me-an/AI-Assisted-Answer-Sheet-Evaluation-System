# AI-Assisted Answer Sheet Evaluation System

> **Current infrastructure:** Supabase Auth and Supabase PostgreSQL are the
> production architecture. Django connects directly to Supabase through
> `DATABASE_URL`; Docker Compose contains only frontend and backend services.
> The legacy local-PostgreSQL references below are superseded by the concise
> [Supabase setup guide](docs/SUPABASE_SETUP.md).

An AI-assisted system for evaluating student answer sheets efficiently and consistently.

This README is intended for **team development**. It explains how to set up the project, run it with Docker, work on frontend/backend features, manage dependencies, use Git, and avoid environment-related issues between team members.

---

## 1. Project Overview

The **AI-Assisted Answer Sheet Evaluation System** is a full-stack web application designed to assist teachers in evaluating student answer sheets using AI-assisted evaluation.

The system consists of:

* A React frontend for the user interface
* A Django backend for APIs and business logic
* PostgreSQL for persistent application data
* Supabase Authentication for user authentication
* Docker and Docker Compose for a consistent development environment

---

## 2. Technology Stack

| Component        | Technology                     |
| ---------------- | ------------------------------ |
| Frontend         | React + Vite                   |
| Backend          | Django + Django REST Framework |
| Database         | PostgreSQL 16                  |
| Authentication   | Supabase Authentication        |
| Containerization | Docker + Docker Compose        |
| Version Control  | Git + GitHub                   |

---

## 3. System Architecture

### Main Application Architecture

```text
                 ┌──────────────────────┐
                 │       Browser        │
                 └──────────┬───────────┘
                            │
                            │ HTTP
                            ▼
                 ┌──────────────────────┐
                 │ React + Vite         │
                 │ Frontend :5173       │
                 └──────────┬───────────┘
                            │
                            │ API Requests
                            ▼
                 ┌──────────────────────┐
                 │ Django + DRF         │
                 │ Backend :8000        │
                 └──────────┬───────────┘
                            │
                            │ Django ORM
                            ▼
                 ┌──────────────────────┐
                 │ PostgreSQL 16        │
                 │ Database :5432       │
                 └──────────────────────┘
```

### Authentication

Supabase Authentication is used as part of the login/authentication workflow.

```text
Browser
   │
   ▼
React Frontend
   │
   │ Authentication
   ▼
Supabase Authentication

React Frontend
   │
   │ Application API Requests
   ▼
Django Backend
   │
   ▼
PostgreSQL
```

The exact authentication-to-Django authorization flow should follow the implementation currently present in the project.

---

# 4. Project Structure

```text
AI-Assisted-Answer-Sheet-Evaluation-System/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── ...
│
├── backend/
│   ├── manage.py
│   ├── ...
│   └── requirements.txt
│
├── frontend.Dockerfile
├── backend.Dockerfile
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

# 5. Prerequisites

Every team member should install:

* Git
* Docker Desktop
* Docker Compose

Docker Compose is included with modern Docker Desktop installations.

Verify the installation:

```bash
docker --version
docker compose version
git --version
```

---

# 6. First-Time Setup

## Step 1 — Clone the Repository

```bash
git clone https://github.com/code-with-me-an/AI-Assisted-Answer-Sheet-Evaluation-System.git
```

Enter the project:

```bash
cd AI-Assisted-Answer-Sheet-Evaluation-System
```

---

## Step 2 — Build and Start the Project

Run:

```bash
docker compose up --build -d
```

This command:

1. Reads `docker-compose.yml`
2. Builds the required Docker images
3. Installs project dependencies inside the containers
4. Creates the required containers
5. Starts the services in the background

---

## Step 3 — Run Database Migrations

After the containers are running:

```bash
docker compose exec backend python manage.py migrate
```

---

## Step 4 — Check the Services

```bash
docker compose ps
```

Expected services:

```text
frontend
backend
db
```

---

## Step 5 — Open the Application

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8000
```

---

# 7. Docker Services

Docker Compose manages three main services.

```text
docker-compose.yml
       │
       ├── frontend
       │      └── React + Vite
       │
       ├── backend
       │      └── Django + DRF
       │
       └── db
              └── PostgreSQL 16
```

### Frontend

Runs the React/Vite application.

```text
Port: 5173
```

### Backend

Runs the Django application.

```text
Port: 8000
```

### Database

Runs PostgreSQL.

```text
Port: 5432
```

Inside Docker, Django connects to PostgreSQL using the service name:

```text
db
```

Do not use `localhost` for the PostgreSQL hostname from inside the Django container.

---

# 8. Important Docker Commands

## Start the project

```bash
docker compose up -d
```

Use this when the Docker images and configuration already exist.

---

## Build and start

```bash
docker compose up --build -d
```

Use this when:

* `package.json` changes
* `package-lock.json` changes
* `requirements.txt` changes
* Dockerfiles change
* Docker configuration changes
* a new dependency is added

---

## Stop the project

```bash
docker compose down
```

This stops and removes the containers.

The PostgreSQL named volume is normally preserved.

---

## View all logs

```bash
docker compose logs -f
```

---

## View frontend logs

```bash
docker compose logs -f frontend
```

---

## View backend logs

```bash
docker compose logs -f backend
```

---

## View database logs

```bash
docker compose logs -f db
```

---

## Check running containers

```bash
docker compose ps
```

---

# 9. Dependency Management

## Frontend Dependencies

Frontend dependencies must be added to:

```text
frontend/package.json
```

and:

```text
frontend/package-lock.json
```

For example, Supabase:

```json
"@supabase/supabase-js": "..."
```

Do **not** depend on manually installing packages inside a running Docker container as the normal team workflow.

### Correct workflow

If a developer adds a package:

```bash
cd frontend
npm install <package-name>
```

This updates:

```text
package.json
package-lock.json
```

Then commit those files:

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "Add frontend dependency"
git push
```

Other team members should then:

```bash
git pull
docker compose up --build -d
```

Docker rebuilds the frontend environment using the updated dependency files.

---

## Backend Dependencies

Python dependencies should be maintained through:

```text
backend/requirements.txt
```

When a new Python package is required, update the requirements file.

After pulling the changes, rebuild:

```bash
docker compose up --build -d
```

---

# 10. Supabase Authentication

The frontend uses the Supabase JavaScript client.

The Supabase client is initialized from:

```text
src/lib/supabase.js
```

The application uses environment variables such as:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

These values should **not be hard-coded into source code**.

Use the project's environment configuration approach for development.

Never commit private secrets, service-role keys, database passwords, or other sensitive credentials to GitHub.

---

# 11. Environment Variables

Environment variables may be required for:

* Supabase
* Django
* PostgreSQL
* API configuration
* other external services

Before running the project, make sure the required environment variables are configured according to the current Docker Compose configuration.

Do not commit secret environment files to GitHub.

Typical sensitive files should be added to `.gitignore`, for example:

```text
.env
.env.local
.env.*.local
```

Only commit example configuration files when appropriate:

```text
.env.example
```

Example:

```text
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Never put real credentials in `.env.example`.

---

# 12. Django Database Management

## Create migrations

After changing Django models:

```bash
docker compose exec backend python manage.py makemigrations
```

Then:

```bash
docker compose exec backend python manage.py migrate
```

---

## Apply migrations

```bash
docker compose exec backend python manage.py migrate
```

---

## Create Django admin user

```bash
docker compose exec backend python manage.py createsuperuser
```

---

## Run Django management commands

```bash
docker compose exec backend python manage.py <command>
```

Example:

```bash
docker compose exec backend python manage.py check
```

---

# 13. Database Persistence

PostgreSQL uses a Docker named volume.

```text
postgres_data
```

Normal:

```bash
docker compose down
```

does **not** delete the PostgreSQL volume.

Therefore, your database data remains available when the containers are recreated.

### WARNING

The following command removes Docker volumes:

```bash
docker compose down -v
```

This can permanently delete the PostgreSQL database stored in the Docker volume.

Only use it when you intentionally want to reset the database.

After resetting:

```bash
docker compose up --build -d
docker compose exec backend python manage.py migrate
```

---

# 14. Development Workflow

Each team member should follow this general workflow.

```text
                GitHub
                   │
                   │ git pull
                   ▼
             Local Project
                   │
                   ▼
            Docker Compose
             │     │     │
             ▼     ▼     ▼
         Frontend Backend Database
```

### Start work

First update your local repository:

```bash
git pull origin main
```

Then start Docker:

```bash
docker compose up -d
```

If dependencies or Docker configuration changed:

```bash
docker compose up --build -d
```

---

# 15. Frontend Development

Frontend source code is located in:

```text
frontend/src/
```

Main technologies:

```text
React
Vite
JavaScript / JSX
CSS
```

Typical frontend workflow:

```text
React Component
      ↓
User Interaction
      ↓
API Request
      ↓
Django REST API
      ↓
Response
      ↓
React UI
```

The frontend should not directly connect to PostgreSQL.

---

# 16. Backend Development

Backend source code is located in:

```text
backend/
```

Main technologies:

```text
Django
Django REST Framework
Python
```

Typical backend workflow:

```text
React
  ↓
HTTP Request
  ↓
Django URL
  ↓
View / API
  ↓
Business Logic
  ↓
Django ORM
  ↓
PostgreSQL
```

---

# 17. Database Development

PostgreSQL stores persistent application data.

Django should communicate with PostgreSQL through Django's database layer/ORM.

The frontend should never directly access PostgreSQL credentials or connect directly to the database.

---

# 18. Git Team Workflow

Before starting work:

```bash
git pull origin main
```

Create a feature branch:

```bash
git checkout -b feature/<feature-name>
```

Example:

```bash
git checkout -b feature/login
```

Work on the feature.

Check changes:

```bash
git status
```

Add changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Add login authentication"
```

Push:

```bash
git push origin feature/login
```

Create a Pull Request on GitHub.

After the changes are reviewed and merged, update your local `main`:

```bash
git checkout main
git pull origin main
```

---

# 19. Recommended Commit Messages

Use clear commit messages.

Examples:

```text
Add Supabase authentication
Fix login page
Add exam creation API
Add student dashboard
Update result evaluation UI
Fix PostgreSQL configuration
Update Docker frontend setup
Add answer sheet upload API
```

Avoid unclear commits such as:

```text
changes
update
fix
final
new
test
```

---

# 20. Before Pushing Code

Before pushing your changes:

### Check Git status

```bash
git status
```

### Check your changes

```bash
git diff
```

### Make sure secrets are not being committed

Check that files such as:

```text
.env
.env.local
```

are not included.

### Test the application

```bash
docker compose ps
```

Check the frontend:

```text
http://localhost:5173
```

Check the backend:

```text
http://localhost:8000
```

Then commit and push.

---

# 21. Common Problems

## Problem: Package cannot be found

Example:

```text
Failed to resolve import "@supabase/supabase-js"
```

First make sure the dependency exists in:

```text
frontend/package.json
```

Then rebuild:

```bash
docker compose up --build -d
```

Do not rely on manually installing packages inside the running container.

---

## Problem: Frontend container is not running

Check:

```bash
docker compose ps
```

Then inspect logs:

```bash
docker compose logs -f frontend
```

---

## Problem: Backend is not running

```bash
docker compose logs -f backend
```

---

## Problem: Database connection error

Check:

```bash
docker compose logs -f db
```

Also verify that Django uses the Docker service name:

```text
db
```

for the PostgreSQL hostname.

---

## Problem: Changes are not appearing

Try rebuilding:

```bash
docker compose up --build -d
```

For a complete container recreation:

```bash
docker compose down
docker compose up --build -d
```

---

# 22. Important Rule: Do Not Modify Another Developer's Work Without Coordination

Because multiple team members work on the same repository:

* Pull before starting work.
* Work on a separate branch.
* Avoid directly modifying another member's feature.
* Communicate before changing shared configuration.
* Do not commit secrets.
* Do not commit generated files unnecessarily.
* Resolve merge conflicts carefully.
* Test the project after merging major changes.

---

# 23. Development Environment Principle

The project uses Docker to reduce differences between developers' computers.

The goal is:

```text
Developer A
     │
     ▼
Docker Environment
     │
     ▼
Same dependencies
Same services
Same ports
Same database setup
     ▲
     │
Docker Environment
     ▲
     │
Developer B
```

Therefore, the repository should contain the configuration necessary to reproduce the development environment.

Dependencies should be declared in project files such as:

```text
frontend/package.json
frontend/package-lock.json
backend/requirements.txt
docker-compose.yml
frontend.Dockerfile
backend.Dockerfile
```

---

# 24. Complete First-Time Setup

For a new team member:

```bash
git clone https://github.com/code-with-me-an/AI-Assisted-Answer-Sheet-Evaluation-System.git

cd AI-Assisted-Answer-Sheet-Evaluation-System

docker compose up --build -d

docker compose exec backend python manage.py migrate

docker compose ps
```

Then open:

```text
http://localhost:5173
```

---

# 25. Daily Development Workflow

For normal development:

```bash
git checkout main

git pull origin main

docker compose up -d
```

If dependencies/configuration changed:

```bash
docker compose up --build -d
```

Work on your feature:

```bash
git checkout -b feature/<feature-name>
```

After completing the work:

```bash
git status
git add .
git commit -m "Describe the change"
git push origin feature/<feature-name>
```

Then create a Pull Request.

---

# 26. Overall Development Flow

```text
                     GitHub Repository
                            │
                            │ git clone / git pull
                            ▼
                   Local Project Folder
                            │
                            ▼
                   Docker Compose
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
     Frontend            Backend           Database
     React/Vite          Django            PostgreSQL
       :5173               :8000              :5432
          │                 │
          │ HTTP/API        │
          └────────►────────┘
                            │
                            ▼
                       Application
                            │
                            ▼
                  AI Evaluation Workflow
                            │
                            ▼
                     Results / Reports
```

---

# 27. Key Rules for the Team

1. **Use Docker Compose to run the project.**
2. **Keep dependencies in `package.json` and `requirements.txt`.**
3. **Do not manually install project dependencies inside running containers as the normal workflow.**
4. **Rebuild Docker after dependency or Docker configuration changes.**
5. **Never commit secrets or private credentials.**
6. **Use Git branches for feature development.**
7. **Pull the latest changes before starting work.**
8. **Do not use `docker compose down -v` unless you intentionally want to delete the PostgreSQL volume.**
9. **Frontend communicates with Django through APIs.**
10. **Django communicates with PostgreSQL.**
11. **Do not connect the React frontend directly to PostgreSQL.**
12. **Keep shared configuration inside the repository so every team member can reproduce the environment.**

---

# 28. Quick Command Reference

| Task              | Command                                                        |
| ----------------- | -------------------------------------------------------------- |
| Start containers  | `docker compose up -d`                                         |
| Build + start     | `docker compose up --build -d`                                 |
| Stop containers   | `docker compose down`                                          |
| Check status      | `docker compose ps`                                            |
| All logs          | `docker compose logs -f`                                       |
| Frontend logs     | `docker compose logs -f frontend`                              |
| Backend logs      | `docker compose logs -f backend`                               |
| Database logs     | `docker compose logs -f db`                                    |
| Django migrations | `docker compose exec backend python manage.py migrate`         |
| Create migrations | `docker compose exec backend python manage.py makemigrations`  |
| Django admin user | `docker compose exec backend python manage.py createsuperuser` |
| Pull latest code  | `git pull origin main`                                         |
| Check changes     | `git status`                                                   |
| Create branch     | `git checkout -b feature/<name>`                               |
| Push branch       | `git push origin feature/<name>`                               |

---

# 29. Final Development Principle

The repository should be treated as the **single source of truth for the development environment**.

A new team member should ideally be able to:

```text
Clone repository
       ↓
Configure required environment variables
       ↓
docker compose up --build -d
       ↓
Run migrations
       ↓
Open localhost:5173
       ↓
Start development
```

No developer should need to manually recreate the project's dependency setup from memory.

As the project evolves, update this README whenever there are major changes to:

* Architecture
* Docker configuration
* Frontend dependencies
* Backend dependencies
* Database configuration
* Authentication
* Environment variables
* Development workflow
* Git workflow
* Deployment configuration
