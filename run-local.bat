@echo off
REM Run backend + frontend locally on Windows.
REM Double-click this file or run it from Command Prompt in the MiniProject folder.

cd /d "%~dp0"

if not exist "backend" (
  echo Backend folder not found. Please put backend and frontend inside this folder.
  pause
  exit /b 1
)
if not exist "frontend" (
  echo Frontend folder not found. Please put backend and frontend inside this folder.
  pause
  exit /b 1
)

echo === Setting up backend ===
cd backend
if not exist "venv" (
  python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
alembic upgrade head
python seed.py
echo Starting backend in a new window on http://localhost:8000
start "Backend" cmd /k "cd /d "%~dp0backend" && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"
cd ..

timeout /t 5 /nobreak >nul

echo === Setting up frontend ===
cd frontend
call npm install
echo Opening browser at http://localhost:3000 in a few seconds...
start "" cmd /c "timeout /t 8 /nobreak >nul && start http://localhost:3000"
call npm start
