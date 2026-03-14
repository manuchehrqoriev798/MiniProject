import uuid
from datetime import datetime, timezone
import enum

from sqlalchemy import Integer, Float, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ExamStatus(str, enum.Enum):
    in_progress = "in_progress"
    completed = "completed"
    abandoned = "abandoned"


class ExamSession(Base):
    __tablename__ = "exam_sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    student_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    end_time: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    total_questions: Mapped[int] = mapped_column(Integer, default=0)
    correct_answers: Mapped[int | None] = mapped_column(Integer, nullable=True)
    score_percentage: Mapped[float | None] = mapped_column(Float, nullable=True)
    status: Mapped[ExamStatus] = mapped_column(
        SAEnum(ExamStatus, name="examstatus", create_constraint=True),
        nullable=False,
        default=ExamStatus.in_progress,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    student = relationship("User", back_populates="exam_sessions")
    answers = relationship(
        "StudentAnswer", back_populates="exam_session", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<ExamSession {self.id} student={self.student_id} status={self.status.value}>"
