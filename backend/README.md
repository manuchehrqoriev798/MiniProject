# Exam Platform – Backend

FastAPI + PostgreSQL backend for the online exam platform.

## Quick Start

### 1. Prerequisites
- Python 3.11+
- PostgreSQL 14+
- `pip` / `venv`

### 2. Setup

```bash
cd backend

# Create & activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # Linux / macOS
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt
```

### 3. Database

```bash
# Create the PostgreSQL database
createdb exam_platform          # or via psql: CREATE DATABASE exam_platform;

# Copy and edit environment variables
cp .env.example .env
# → update DATABASE_URL, SECRET_KEY, etc.

# Run migrations (creates all tables)
alembic upgrade head

# --- OR seed directly (creates tables + sample data) ---
python seed.py
```

### 4. Run the server

```bash
uvicorn app.main:app --reload --port 8000
```

The API is now available at **http://localhost:8000**.  
Interactive docs at **http://localhost:8000/docs**.

---

## Default Accounts (after seeding)

| Role    | Email                | Password     |
|---------|----------------------|-------------|
| Teacher | teacher@school.edu   | teacher123  |
| Student | student@school.edu   | student123  |

---

## API Overview

### Auth
| Method | Path                        | Description          |
|--------|-----------------------------|----------------------|
| POST   | `/api/auth/signup`          | Register new account |
| POST   | `/api/auth/login`           | Login (any role)     |
| POST   | `/api/auth/teacher/login`   | Teacher-only login   |
| POST   | `/api/auth/student/login`   | Student-only login   |

### Questions (Teacher)
| Method | Path                       | Description            |
|--------|----------------------------|------------------------|
| GET    | `/api/questions`           | List all questions     |
| POST   | `/api/questions`           | Create a question      |
| PUT    | `/api/questions/{id}`      | Update a question      |
| DELETE | `/api/questions/{id}`      | Delete a question      |

### Exam (Student)
| Method | Path                           | Description               |
|--------|--------------------------------|---------------------------|
| POST   | `/api/exam/start`              | Start an exam session     |
| POST   | `/api/exam/submit`             | Submit answers & get score|
| GET    | `/api/exam/report/{session_id}`| Detailed exam report      |
| GET    | `/api/exam/history`            | Student exam history      |

### Health
| Method | Path      | Description   |
|--------|-----------|---------------|
| GET    | `/health` | Health check  |

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI entry point
│   ├── config.py            # Settings (from .env)
│   ├── database.py          # SQLAlchemy engine & session
│   ├── models/              # ORM models
│   │   ├── user.py
│   │   ├── question.py
│   │   ├── exam_session.py
│   │   ├── answer.py
│   │   └── activity_log.py
│   ├── schemas/             # Pydantic request/response schemas
│   │   ├── auth.py
│   │   ├── question.py
│   │   ├── exam.py
│   │   └── report.py
│   ├── api/
│   │   ├── deps.py          # Auth dependencies & role guards
│   │   └── v1/
│   │       ├── auth.py      # Auth endpoints
│   │       ├── questions.py # Question CRUD
│   │       └── exam.py      # Exam + report endpoints
│   └── core/
│       └── security.py      # JWT & password hashing
├── alembic/                 # Database migrations
├── seed.py                  # Seed data script
├── requirements.txt
├── .env / .env.example
└── alembic.ini
```
