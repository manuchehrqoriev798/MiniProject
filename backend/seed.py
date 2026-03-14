"""Seed the database with a default teacher, student, and sample questions.

Usage:
    cd backend
    python seed.py
"""

import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from app.database import SessionLocal, engine, Base
from app.models import User, Question, ExamSession, StudentAnswer, ActivityLog  # noqa: F401
from app.models.user import UserRole
from app.core.security import hash_password


SAMPLE_QUESTIONS = [
    {
        "question_text": "What is the past tense of 'go'?",
        "choices": ["goed", "went", "gone", "going"],
        "correct_answer": 1,
        "order": 1,
    },
    {
        "question_text": "Which sentence is grammatically correct?",
        "choices": [
            "She don't like pizza.",
            "She doesn't likes pizza.",
            "She doesn't like pizza.",
            "She not like pizza.",
        ],
        "correct_answer": 2,
        "order": 2,
    },
    {
        "question_text": "Choose the correct form: 'I ___ to school every day.'",
        "choices": ["walks", "walk", "walking", "walked"],
        "correct_answer": 1,
        "order": 3,
    },
    {
        "question_text": "What is the plural of 'child'?",
        "choices": ["childs", "childrens", "children", "childes"],
        "correct_answer": 2,
        "order": 4,
    },
    {
        "question_text": "Which word is an adjective?",
        "choices": ["quickly", "beautiful", "run", "happily"],
        "correct_answer": 1,
        "order": 5,
    },
    {
        "question_text": "Select the correct article: '___ apple a day keeps the doctor away.'",
        "choices": ["A", "An", "The", "No article"],
        "correct_answer": 1,
        "order": 6,
    },
    {
        "question_text": "What is the opposite of 'ancient'?",
        "choices": ["old", "modern", "antique", "historic"],
        "correct_answer": 1,
        "order": 7,
    },
    {
        "question_text": "Which sentence uses the present perfect tense?",
        "choices": [
            "I eat breakfast.",
            "I ate breakfast.",
            "I have eaten breakfast.",
            "I will eat breakfast.",
        ],
        "correct_answer": 2,
        "order": 8,
    },
    {
        "question_text": "Choose the correct preposition: 'She is interested ___ science.'",
        "choices": ["on", "at", "in", "for"],
        "correct_answer": 2,
        "order": 9,
    },
    {
        "question_text": "What is a synonym of 'happy'?",
        "choices": ["sad", "angry", "joyful", "tired"],
        "correct_answer": 2,
        "order": 10,
    },
    {
        "question_text": "Which word is a noun?",
        "choices": ["run", "quickly", "freedom", "blue"],
        "correct_answer": 2,
        "order": 11,
    },
    {
        "question_text": "Identify the adverb: 'She sings beautifully.'",
        "choices": ["She", "sings", "beautifully", "None"],
        "correct_answer": 2,
        "order": 12,
    },
    {
        "question_text": "What is the comparative form of 'good'?",
        "choices": ["gooder", "more good", "better", "best"],
        "correct_answer": 2,
        "order": 13,
    },
    {
        "question_text": "Which sentence is in the passive voice?",
        "choices": [
            "The cat chased the mouse.",
            "The mouse was chased by the cat.",
            "The cat is chasing the mouse.",
            "The mouse runs from the cat.",
        ],
        "correct_answer": 1,
        "order": 14,
    },
    {
        "question_text": "Choose the correct conjunction: 'I like tea ___ coffee.'",
        "choices": ["but", "and", "or", "so"],
        "correct_answer": 1,
        "order": 15,
    },
]


def seed():
    """Create tables and populate with seed data."""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created.")

    db = SessionLocal()
    try:
        # ----- Teacher -----
        teacher = db.query(User).filter(User.email == "teacher@school.edu").first()
        if not teacher:
            teacher = User(
                email="teacher@school.edu",
                hashed_password=hash_password("teacher123"),
                full_name="Default Teacher",
                role=UserRole.teacher,
            )
            db.add(teacher)
            db.commit()
            db.refresh(teacher)
            print("✓ Default teacher created  →  teacher@school.edu / teacher123")
        else:
            print("• Teacher already exists, skipping.")

        # ----- Student -----
        student = db.query(User).filter(User.email == "student@school.edu").first()
        if not student:
            student = User(
                email="student@school.edu",
                hashed_password=hash_password("student123"),
                full_name="Default Student",
                role=UserRole.student,
            )
            db.add(student)
            db.commit()
            db.refresh(student)
            print("✓ Default student created  →  student@school.edu / student123")
        else:
            print("• Student already exists, skipping.")

        # ----- Questions -----
        existing_count = db.query(Question).count()
        if existing_count == 0:
            for q_data in SAMPLE_QUESTIONS:
                question = Question(
                    question_text=q_data["question_text"],
                    choices=q_data["choices"],
                    correct_answer=q_data["correct_answer"],
                    order=q_data["order"],
                    created_by=teacher.id,
                )
                db.add(question)
            db.commit()
            print(f"✓ {len(SAMPLE_QUESTIONS)} sample questions inserted.")
        else:
            print(f"• {existing_count} questions already exist, skipping.")

        print("\n🎉 Seed complete!")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
