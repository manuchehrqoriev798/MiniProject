from pydantic import BaseModel
from typing import List
from datetime import datetime
import uuid


class QuestionReport(BaseModel):
    question_id: uuid.UUID
    question_text: str
    choices: List[str]
    correct_answer: int
    your_answer: int
    is_correct: bool


class ExamReport(BaseModel):
    session_id: uuid.UUID
    total_questions: int
    correct_answers: int
    score_percentage: float
    start_time: datetime
    end_time: datetime | None
    questions: List[QuestionReport]


class ExamHistoryItem(BaseModel):
    session_id: uuid.UUID
    total_questions: int
    correct_answers: int | None
    score_percentage: float | None
    status: str
    start_time: datetime
    end_time: datetime | None


class ExamHistoryResponse(BaseModel):
    exams: List[ExamHistoryItem]
