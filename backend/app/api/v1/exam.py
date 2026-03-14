"""Exam flow endpoints – start exam, submit answers, get report, history."""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.api.deps import require_student, get_current_user
from app.models.user import User
from app.models.question import Question
from app.models.exam_session import ExamSession, ExamStatus
from app.models.answer import StudentAnswer
from app.models.activity_log import ActivityLog
from app.schemas.exam import ExamStartResponse, ExamSubmitRequest, ExamSubmitResponse
from app.schemas.question import QuestionStudentResponse
from app.schemas.report import ExamReport, QuestionReport, ExamHistoryItem, ExamHistoryResponse

router = APIRouter(prefix="/api/exam", tags=["exam"])


def _log(db: Session, user: User, action: str, request: Request, details: dict | None = None):
    ip = request.client.host if request.client else None
    db.add(ActivityLog(user_id=user.id, action=action, ip_address=ip, details=details))
    db.commit()


# ---------------------------------------------------------------------------
# POST /api/exam/start – begin a new exam session (student only)
# ---------------------------------------------------------------------------

@router.post("/start", response_model=ExamStartResponse, status_code=status.HTTP_201_CREATED)
def start_exam(
    request: Request,
    db: Session = Depends(get_db),
    student: User = Depends(require_student),
):
    # Fetch all questions ordered
    questions = db.query(Question).order_by(Question.order).all()
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No questions available for the exam.",
        )

    # Abandon any still-running sessions for this student
    running = (
        db.query(ExamSession)
        .filter(ExamSession.student_id == student.id, ExamSession.status == ExamStatus.in_progress)
        .all()
    )
    for session in running:
        session.status = ExamStatus.abandoned
        session.end_time = datetime.now(timezone.utc)
    if running:
        db.commit()

    # Create new session
    now = datetime.now(timezone.utc)
    exam_session = ExamSession(
        student_id=student.id,
        start_time=now,
        total_questions=len(questions),
        status=ExamStatus.in_progress,
    )
    db.add(exam_session)
    db.commit()
    db.refresh(exam_session)

    _log(db, student, "exam_started", request, {"session_id": str(exam_session.id)})

    # Build response without correctAnswer
    question_list = [
        QuestionStudentResponse(
            id=q.id,
            questionText=q.question_text,
            choices=q.choices,
            order=q.order,
        )
        for q in questions
    ]

    return ExamStartResponse(
        session_id=exam_session.id,
        questions=[q.model_dump() for q in question_list],
        start_time=exam_session.start_time,
        total_questions=len(questions),
    )


# ---------------------------------------------------------------------------
# POST /api/exam/submit – submit answers and get score (student only)
# ---------------------------------------------------------------------------

@router.post("/submit", response_model=ExamSubmitResponse)
def submit_exam(
    body: ExamSubmitRequest,
    request: Request,
    db: Session = Depends(get_db),
    student: User = Depends(require_student),
):
    # Validate session
    session = db.query(ExamSession).filter(ExamSession.id == body.session_id).first()
    if session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam session not found.")

    if session.student_id != student.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This is not your exam session.")

    if session.status != ExamStatus.in_progress:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This exam session has already been completed or abandoned.",
        )

    # Build a map of question_id -> Question for quick lookup
    question_ids = [a.question_id for a in body.answers]
    questions = db.query(Question).filter(Question.id.in_(question_ids)).all()
    question_map = {q.id: q for q in questions}

    # Grade answers
    correct_count = 0
    now = datetime.now(timezone.utc)
    for ans in body.answers:
        q = question_map.get(ans.question_id)
        if q is None:
            continue  # Skip unknown questions
        is_correct = ans.selected_answer == q.correct_answer
        if is_correct:
            correct_count += 1

        student_answer = StudentAnswer(
            exam_session_id=session.id,
            question_id=ans.question_id,
            selected_answer=ans.selected_answer,
            is_correct=is_correct,
            answered_at=now,
        )
        db.add(student_answer)

    # Update session
    total = session.total_questions
    score_pct = round((correct_count / total) * 100, 2) if total > 0 else 0.0

    session.correct_answers = correct_count
    session.score_percentage = score_pct
    session.end_time = now
    session.status = ExamStatus.completed

    db.commit()
    db.refresh(session)

    _log(db, student, "exam_submitted", request, {
        "session_id": str(session.id),
        "score": score_pct,
    })

    return ExamSubmitResponse(
        session_id=session.id,
        total_questions=total,
        correct_answers=correct_count,
        score_percentage=score_pct,
        start_time=session.start_time,
        end_time=session.end_time,
    )


# ---------------------------------------------------------------------------
# GET /api/exam/report/{session_id} – detailed exam report
# ---------------------------------------------------------------------------

@router.get("/report/{session_id}", response_model=ExamReport)
def get_exam_report(
    session_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(ExamSession).filter(ExamSession.id == session_id).first()
    if session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Exam session not found.")

    # Students can only view their own; teachers can view any
    if current_user.role.value == "student" and session.student_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

    # Get all student answers for this session
    student_answers = (
        db.query(StudentAnswer)
        .filter(StudentAnswer.exam_session_id == session.id)
        .all()
    )
    answer_map = {sa.question_id: sa for sa in student_answers}

    # Get all questions
    questions = db.query(Question).order_by(Question.order).all()

    question_reports = []
    for q in questions:
        sa = answer_map.get(q.id)
        question_reports.append(
            QuestionReport(
                question_id=q.id,
                question_text=q.question_text,
                choices=q.choices,
                correct_answer=q.correct_answer,
                your_answer=sa.selected_answer if sa else -1,
                is_correct=sa.is_correct if sa else False,
            )
        )

    return ExamReport(
        session_id=session.id,
        total_questions=session.total_questions,
        correct_answers=session.correct_answers or 0,
        score_percentage=session.score_percentage or 0.0,
        start_time=session.start_time,
        end_time=session.end_time,
        questions=question_reports,
    )


# ---------------------------------------------------------------------------
# GET /api/exam/history – student's exam history
# ---------------------------------------------------------------------------

@router.get("/history", response_model=ExamHistoryResponse)
def get_exam_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Students see only their own; teachers see all
    query = db.query(ExamSession).order_by(ExamSession.created_at.desc())
    if current_user.role.value == "student":
        query = query.filter(ExamSession.student_id == current_user.id)

    sessions = query.all()

    return ExamHistoryResponse(
        exams=[
            ExamHistoryItem(
                session_id=s.id,
                total_questions=s.total_questions,
                correct_answers=s.correct_answers,
                score_percentage=s.score_percentage,
                status=s.status.value,
                start_time=s.start_time,
                end_time=s.end_time,
            )
            for s in sessions
        ]
    )
