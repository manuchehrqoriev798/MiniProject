"""Exam Platform – FastAPI Application."""

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from app.config import settings
from app.api.v1.auth import router as auth_router
from app.api.v1.questions import router as questions_router
from app.api.v1.exam import router as exam_router

app = FastAPI(
    title="Exam Platform API",
    description="Backend API for the online exam platform with role-based auth (student / teacher).",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(auth_router)
app.include_router(questions_router)
app.include_router(exam_router)


# ---------------------------------------------------------------------------
# Health-check (frontend calls /api/health)
# ---------------------------------------------------------------------------
@app.get("/health", tags=["health"])
@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# Serve React build (single deployment: backend serves frontend)
# ---------------------------------------------------------------------------
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
INDEX_PATH = STATIC_DIR / "index.html"


def _serve_spa(path: str):
    """Serve static file if it exists, otherwise index.html for SPA routing."""
    if path.startswith("api/"):
        return None  # let API routes handle
    file_path = STATIC_DIR / path
    if file_path.is_file():
        return FileResponse(file_path)
    if INDEX_PATH.exists():
        return FileResponse(INDEX_PATH)
    return None


@app.get("/{full_path:path}", include_in_schema=False)
def serve_frontend(full_path: str):
    """Catch-all: serve static assets or index.html for client-side routing."""
    response = _serve_spa(full_path)
    if response is not None:
        return response
    from fastapi import HTTPException
    raise HTTPException(status_code=404, detail="Not found")
