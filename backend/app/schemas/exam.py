from pydantic import BaseModel
from typing import List
from datetime import datetime
import uuid


class ExamStartResponse(BaseModel):
    session_id: uuid.UUID
    questions: list  # List of QuestionStudentResponse
    start_time: datetime
    total_questions: int


class AnswerItem(BaseModel):
    question_id: uuid.UUID
    selected_answer: int


class ExamSubmitRequest(BaseModel):
    session_id: uuid.UUID
    answers: List[AnswerItem]


class ExamSubmitResponse(BaseModel):
    session_id: uuid.UUID
    total_questions: int
    correct_answers: int
    score_percentage: float
    start_time: datetime
    end_time: datetime
