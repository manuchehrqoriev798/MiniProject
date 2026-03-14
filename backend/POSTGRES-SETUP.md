# PostgreSQL setup for local run

The backend uses **PostgreSQL**. The error `connection to server at "localhost" port 5432 failed: Connection refused` means either PostgreSQL is not installed or it is not running.

## 1. Install PostgreSQL

**Windows**

- Download the installer: https://www.postgresql.org/download/windows/
- Run it and install (remember the password you set for the `postgres` user).
- During setup you can keep default port **5432**.

**macOS**

```bash
brew install postgresql@16
brew services start postgresql@16
```

**Linux (Ubuntu/Debian)**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## 2. Create the database and user (if needed)

The app expects:

- **Database name:** `exam_platform`
- **User:** `postgres`
- **Password:** `postgres`
- **Host:** `localhost`
- **Port:** `5432`

If your PostgreSQL has a different user/password, create `backend/.env` and set:

```env
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/exam_platform
```

**Create the database (one-time):**

**Windows:** Open "SQL Shell (psql)" from the Start menu, or use pgAdmin.

**macOS/Linux:** In a terminal:

```bash
# Connect as postgres (or your superuser)
sudo -u postgres psql

# In psql:
CREATE DATABASE exam_platform;
# If you need a user:
-- CREATE USER postgres WITH PASSWORD 'postgres';
-- GRANT ALL PRIVILEGES ON DATABASE exam_platform TO postgres;
\q
```

If you installed PostgreSQL on Windows with the default `postgres` user, you may only need to create the database:

```sql
CREATE DATABASE exam_platform;
```

(You can do this in pgAdmin: right‑click Databases → Create → Database → name: `exam_platform`.)

## 3. Run the backend again

After PostgreSQL is running and `exam_platform` exists:

- From MiniProject root: run **run-local.bat** (Windows) or **./run-local.sh** (Linux/Mac).

The backend will run `alembic upgrade head` and `python seed.py` against PostgreSQL, and the app will use it.

## Summary

| What’s wrong | What to do |
|-------------|------------|
| Port 5432 connection refused | Install PostgreSQL and start the service (see above). |
| Database does not exist | Create database `exam_platform` (and user/password if different from postgres/postgres). |
| Different user/password | Set `DATABASE_URL` in `backend/.env` to your `postgresql://user:password@localhost:5432/exam_platform`. |

Once PostgreSQL is installed, running, and the database exists, everything should be there and the backend will use PostgreSQL.
