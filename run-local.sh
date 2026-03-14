#!/usr/bin/env bash
# Run backend + frontend locally. Uses existing backend/ and frontend/ in this folder (no download).
# If PostgreSQL is not running on port 5432, uses SQLite so the app works without installing Postgres.

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
  echo "Error: backend/ and frontend/ must exist in this folder. Unzip the full MiniProject and try again."
  exit 1
fi

# If PostgreSQL is not reachable on 5432, use SQLite so the app runs without Postgres
export USE_SQLITE=""
if ! python3 -c "import socket; s=socket.socket(); s.settimeout(2); s.connect(('127.0.0.1', 5432)); s.close()" 2>/dev/null; then
  export USE_SQLITE=1
  echo "PostgreSQL not detected on port 5432. Using SQLite for this run (no Postgres needed)."
  echo "To use PostgreSQL, install and start it, then run this script again. See backend/POSTGRES-SETUP.md"
  echo ""
fi

BACKEND_PID=""
cleanup() {
  if [ -n "$BACKEND_PID" ]; then
    echo ""
    echo "Stopping backend (PID $BACKEND_PID)..."
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  exit 0
}
trap cleanup EXIT INT TERM

echo "=== Setting up backend ==="
cd "$ROOT/backend"
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt
alembic upgrade head
python seed.py
echo "Starting backend on http://localhost:8000"
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd "$ROOT"

echo "Waiting for backend to be ready..."
sleep 4

echo "=== Setting up frontend ==="
cd "$ROOT/frontend"
npm install
echo "Starting frontend (will open in browser at http://localhost:3000)"
(sleep 6 && (xdg-open http://localhost:3000 2>/dev/null || open http://localhost:3000 2>/dev/null)) &
npm start
