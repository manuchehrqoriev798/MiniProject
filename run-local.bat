@echo off
REM One script: run backend + frontend. Double-click run-local.bat only.
cd /d "%~dp0"

if not exist "backend" (
  echo Backend folder not found. Put backend and frontend in this folder.
  pause
  exit /b 1
)
if not exist "frontend" (
  echo Frontend folder not found. Put backend and frontend in this folder.
  pause
  exit /b 1
)

REM If PostgreSQL is not running on port 5432, use SQLite so the app works without installing Postgres
set USE_SQLITE=
python -c "import socket; s=socket.socket(); s.settimeout(2); s.connect(('127.0.0.1', 5432)); s.close()" 2>nul || set USE_SQLITE=1
if defined USE_SQLITE (
  echo PostgreSQL not detected on port 5432. Using SQLite for this run so the app works without Postgres.
  echo To use PostgreSQL, install it and start the service, then run this script again. See backend\POSTGRES-SETUP.md
  echo.
)

echo === Starting backend in new window (keep it open) ===
start "Backend" cmd /k "cd /d ""%~dp0backend"" & if defined USE_SQLITE set USE_SQLITE=1 & if not exist venv python -m venv venv & call venv\Scripts\activate.bat & pip install -r requirements.txt & alembic upgrade head & python seed.py & uvicorn app.main:app --reload --port 8000"

echo Waiting for backend to start...
timeout /t 8 /nobreak >nul

echo === Setting up frontend ===
cd frontend
call npm install
echo Opening browser at http://localhost:3000 in a few seconds...
start "" cmd /c "timeout /t 6 /nobreak >nul && start http://localhost:3000"
call npm start
