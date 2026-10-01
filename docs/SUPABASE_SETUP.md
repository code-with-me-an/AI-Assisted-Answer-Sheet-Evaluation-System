# Supabase authentication and database setup

AutoGrade uses Supabase as the only authentication provider and as the hosted
PostgreSQL database. React never receives database credentials; Django keeps
the API, authorization, business logic, and ORM.

```text
React -> Supabase Auth -> Bearer access token -> Django REST API -> Django ORM -> Supabase PostgreSQL
```

## Supabase dashboard requirements

1. Create a Supabase project and enable Email/Password sign-in in **Auth**.
2. Add the frontend URL (for local development, `http://localhost:5173`) to
   **Authentication > URL Configuration**. Configure email confirmation to
   match the desired signup experience.
3. In **Connect**, copy the PostgreSQL connection string (prefer the pooler
   connection for Docker/application traffic). In **Settings > API**, copy the
   Project URL and the publishable/anon key.
4. For asymmetric JWT signing, the default JWKS endpoint is used. For a legacy
   HS256 project only, copy the JWT secret into the backend-only
   `SUPABASE_JWT_SECRET` variable. Never use the service-role key in React.

## Environment

Copy `.env.example` to `.env` and replace every placeholder locally. Compose
loads this root `.env`; it is ignored by Git.

Frontend variables, safe to expose:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_or_anon_key
VITE_API_URL=http://localhost:8000
```

Backend-only variables:

```dotenv
DATABASE_URL=postgresql://...supabase.../postgres
DATABASE_SSLMODE=require
SUPABASE_URL=https://your-project-ref.supabase.co
DJANGO_SECRET_KEY=a-long-random-secret
```

`SUPABASE_JWKS_URL` and `SUPABASE_JWT_ISSUER` are derived from
`SUPABASE_URL` by default. `SUPABASE_JWT_SECRET` is intentionally blank unless
the project has legacy HS256 signing. Do not add `DATABASE_URL`, a database
password, a JWT secret, or a service-role key to a Vite variable.

## Database migrations and startup

Run the migration against the configured Supabase connection, never a local DB
container:

```bash
docker compose up --build -d
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py check
```

Compose runs only `frontend` and `backend`; there is no PostgreSQL Docker
service. To work outside Docker, export the same backend variables and run:

```bash
cd backend
python manage.py migrate
python manage.py runserver
```

## Authentication and profile synchronization

The browser signs up/signs in with `supabase.auth.signUp` and
`supabase.auth.signInWithPassword`. On session restoration or a session change,
the centralized API helper obtains the Supabase access token and calls
`POST /api/auth/profile/`. Django verifies the token signature, issuer,
audience, and expiry, then derives `sub` and email from the verified claims.

The endpoint creates or updates `Teacher` using `supabase_user_id`; it never
accepts a user ID or password from the browser. Existing teachers remain intact:
migration 0002 leaves the new UUID nullable, and the first signed-in user with
the matching verified email claims that profile. Review duplicate or incorrectly
matched historical emails before inviting users to sign in.

Protected calls use `api.get`/`api.post` from `frontend/src/lib/api.js`, which
sends `Authorization: Bearer <access token>`. `/api/evaluate/` requires this
valid token and a synchronized Teacher profile. A missing/invalid/expired token
returns 401; a valid account without a profile receives 403 for protected
teacher operations.

## Security rules

- Supabase Auth owns passwords, sessions, and logout.
- Django verifies JWT signatures; it never decodes unsigned tokens.
- React has only the project URL and publishable/anon key.
- Ownership must use `request.user.teacher`, never an ID from request data.
- Keep `.env` private and do not commit service-role keys or PostgreSQL URLs.
