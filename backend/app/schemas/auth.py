from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str | None = None
    role: str = "student"  # "student" or "teacher"


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str
    full_name: str
    role: str
