"""Question CRUD endpoints – teacher only (except GET which also serves students)."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.api.deps import get_current_user, require_teacher
from app.models.user import User
from app.models.question import Question
from app.models.activity_log import ActivityLog
from app.schemas.question import (
    QuestionCreate,
    QuestionUpdate,
    QuestionResponse,
)

router = APIRouter(prefix="/api/questions", tags=["questions"])


def _log(db: Session, user: User, action: str, request: Request, details: dict | None = None):
    ip = request.client.host if request.client else None
    db.add(ActivityLog(user_id=user.id, action=action, ip_address=ip, details=details))
    db.commit()


# ---------------------------------------------------------------------------
# GET /api/questions – list all questions (auth required)
# ---------------------------------------------------------------------------

@router.get("/", response_model=list[QuestionResponse])
def list_questions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    questions = db.query(Question).order_by(Question.order).all()
    return [
        QuestionResponse(
            id=q.id,
            questionText=q.question_text,
            choices=q.choices,
            correctAnswer=q.correct_answer,
            order=q.order,
        )
        for q in questions
    ]


# ---------------------------------------------------------------------------
# POST /api/questions – create a new question (teacher only)
# ---------------------------------------------------------------------------

@router.post("/", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_question(
    body: QuestionCreate,
    request: Request,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_teacher),
):
    # Validate correctAnswer fits within choices
    if body.correctAnswer >= len(body.choices):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="correctAnswer index is out of range of choices.",
        )

    # Check unique order
    existing_order = db.query(Question).filter(Question.order == body.order).first()
    if existing_order:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A question with order {body.order} already exists.",
        )

    question = Question(
        question_text=body.questionText,
        choices=body.choices,
        correct_answer=body.correctAnswer,
        order=body.order,
        created_by=teacher.id,
    )
    db.add(question)
    db.commit()
    db.refresh(question)

    _log(db, teacher, "question_created", request, {"question_id": str(question.id)})

    return QuestionResponse(
        id=question.id,
        questionText=question.question_text,
        choices=question.choices,
        correctAnswer=question.correct_answer,
        order=question.order,
    )


# ---------------------------------------------------------------------------
# PUT /api/questions/{question_id} – update (teacher only)
# ---------------------------------------------------------------------------

@router.put("/{question_id}", response_model=QuestionResponse)
def update_question(
    question_id: uuid.UUID,
    body: QuestionUpdate,
    request: Request,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_teacher),
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if question is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found.")

    if body.questionText is not None:
        question.question_text = body.questionText.strip()
    if body.choices is not None:
        question.choices = body.choices
    if body.correctAnswer is not None:
        choices = body.choices if body.choices is not None else question.choices
        if body.correctAnswer >= len(choices):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="correctAnswer index is out of range of choices.",
            )
        question.correct_answer = body.correctAnswer
    if body.order is not None:
        # Check unique order (excluding current question)
        clash = (
            db.query(Question)
            .filter(Question.order == body.order, Question.id != question_id)
            .first()
        )
        if clash:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"A question with order {body.order} already exists.",
            )
        question.order = body.order

    db.commit()
    db.refresh(question)

    _log(db, teacher, "question_updated", request, {"question_id": str(question.id)})

    return QuestionResponse(
        id=question.id,
        questionText=question.question_text,
        choices=question.choices,
        correctAnswer=question.correct_answer,
        order=question.order,
    )


# ---------------------------------------------------------------------------
# DELETE /api/questions/{question_id} – delete (teacher only)
# ---------------------------------------------------------------------------

@router.delete("/{question_id}", status_code=status.HTTP_200_OK)
def delete_question(
    question_id: uuid.UUID,
    request: Request,
    db: Session = Depends(get_db),
    teacher: User = Depends(require_teacher),
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if question is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found.")

    db.delete(question)
    db.commit()

    _log(db, teacher, "question_deleted", request, {"question_id": str(question_id)})

    return {"message": "Question deleted successfully."}
