from pydantic import BaseModel, field_validator
from typing import List
import uuid


class QuestionCreate(BaseModel):
    questionText: str
    choices: List[str]
    correctAnswer: int
    order: int

    @field_validator("choices")
    @classmethod
    def validate_choices(cls, v: List[str]) -> List[str]:
        if len(v) < 2:
            raise ValueError("At least 2 choices are required.")
        if len(v) > 6:
            raise ValueError("Maximum 6 choices allowed.")
        for i, choice in enumerate(v):
            if not choice.strip():
                raise ValueError(f"Choice {i + 1} cannot be empty.")
        return v

    @field_validator("correctAnswer")
    @classmethod
    def validate_correct_answer(cls, v: int, info) -> int:
        # Validation with choices happens at endpoint level
        if v < 0:
            raise ValueError("correctAnswer must be >= 0.")
        return v

    @field_validator("questionText")
    @classmethod
    def validate_question_text(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Question text cannot be empty.")
        return v.strip()


class QuestionUpdate(BaseModel):
    questionText: str | None = None
    choices: List[str] | None = None
    correctAnswer: int | None = None
    order: int | None = None

    @field_validator("choices")
    @classmethod
    def validate_choices(cls, v: List[str] | None) -> List[str] | None:
        if v is None:
            return v
        if len(v) < 2:
            raise ValueError("At least 2 choices are required.")
        if len(v) > 6:
            raise ValueError("Maximum 6 choices allowed.")
        for i, choice in enumerate(v):
            if not choice.strip():
                raise ValueError(f"Choice {i + 1} cannot be empty.")
        return v


class QuestionResponse(BaseModel):
    id: uuid.UUID
    questionText: str
    choices: List[str]
    correctAnswer: int
    order: int

    class Config:
        from_attributes = True


class QuestionStudentResponse(BaseModel):
    """Question response for students - no correctAnswer exposed."""
    id: uuid.UUID
    questionText: str
    choices: List[str]
    order: int

    class Config:
        from_attributes = True
