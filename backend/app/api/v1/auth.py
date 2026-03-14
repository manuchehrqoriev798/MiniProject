"""Authentication endpoints – login & signup for students and teachers."""

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User, UserRole
from app.models.activity_log import ActivityLog
from app.schemas.auth import LoginRequest, SignupRequest, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _build_token_response(user: User) -> TokenResponse:
    """Create JWT and return a ``TokenResponse``."""
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role.value, "email": user.email}
    )
    return TokenResponse(
        access_token=access_token,
        email=user.email,
        full_name=user.full_name,
        role=user.role.value,
    )


def _log_activity(db: Session, user_id, action: str, request: Request, details: dict | None = None):
    """Write an entry to the activity_logs table."""
    ip = request.client.host if request.client else None
    log = ActivityLog(user_id=user_id, action=action, ip_address=ip, details=details)
    db.add(log)
    db.commit()


# ---------------------------------------------------------------------------
# POST /api/auth/signup – register a new student or teacher
# ---------------------------------------------------------------------------

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(body: SignupRequest, request: Request, db: Session = Depends(get_db)):
    # Check duplicate email
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # Validate role
    try:
        role = UserRole(body.role)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be 'student' or 'teacher'.",
        )

    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        full_name=body.full_name,
        phone=body.phone,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    _log_activity(db, user.id, "signup", request, {"role": role.value})

    return _build_token_response(user)


# ---------------------------------------------------------------------------
# POST /api/auth/login – generic login (works for both roles)
# ---------------------------------------------------------------------------

@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if user is None or not verify_password(body.password, user.hashed_password):
        _try_log_failed_login(db, body.email, request)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )

    _log_activity(db, user.id, "login", request, {"role": user.role.value})

    return _build_token_response(user)


# ---------------------------------------------------------------------------
# POST /api/auth/teacher/login – teacher-only login
# ---------------------------------------------------------------------------

@router.post("/teacher/login", response_model=TokenResponse)
def teacher_login(body: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if user is None or not verify_password(body.password, user.hashed_password):
        _try_log_failed_login(db, body.email, request)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if user.role != UserRole.teacher:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This login is for teachers only.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )

    _log_activity(db, user.id, "teacher_login", request)

    return _build_token_response(user)


# ---------------------------------------------------------------------------
# POST /api/auth/student/login – student-only login
# ---------------------------------------------------------------------------

@router.post("/student/login", response_model=TokenResponse)
def student_login(body: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email).first()
    if user is None or not verify_password(body.password, user.hashed_password):
        _try_log_failed_login(db, body.email, request)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if user.role != UserRole.student:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This login is for students only.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated.",
        )

    _log_activity(db, user.id, "student_login", request)

    return _build_token_response(user)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _try_log_failed_login(db: Session, email: str, request: Request):
    """Log a failed login attempt if we can identify the user."""
    user = db.query(User).filter(User.email == email).first()
    if user:
        _log_activity(db, user.id, "failed_login", request)
