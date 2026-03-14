# Backend Development Backlog

## English Assessment Platform - 2 Week MVP

**Total Estimated Hours**: ~50 hours (1 backend developer, 2 weeks)

---

## Week 1: Core Infrastructure & Student Flow

### Story 1.1: Project Setup

**Title**: `[Backend] Initialize FastAPI Project with PostgreSQL`

**Tasks**:

- Create FastAPI project structure (`/app`, `/app/api`, `/app/models`, `/app/schemas`, `/app/services`)
- Install dependencies: fastapi, uvicorn, sqlalchemy, psycopg2-binary, alembic, pydantic, python-jose, passlib, reportlab
- Configure CORS middleware
- Create health check endpoint: `GET /health`
- Set up PostgreSQL Docker container
- Initialize Alembic for migrations

**Effort**: 4 hours

---

### Story 1.2: Database Models

**Title**: `[Backend] Create All Database Models`

**Models to Create**:

- **students**: id, first_name, last_name, phone_number, registration_date, exam_status
- **exams**: id, title, duration, total_questions
- **questions**: id, exam_id, question_text, choices (JSON), correct_answer, order_index
- **student_responses**: id, student_id, question_id, answer, is_correct, answered_at
- **users**: id, email, password_hash, role (always 'teacher')
- **reports**: id, student_id, score, percentage, pdf_url, generated_at

**Tasks**:

- Define SQLAlchemy models with relationships
- Create Alembic migration
- Run migration to create tables
- Create database seed script (1 exam + 15 questions + 2 teachers)

**Effort**: 5 hours

---

### Story 1.3: Student Registration

**Title**: `[Backend] POST /api/students/register`

**Request**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+996700123456"
}
```

**Response**:

```json
{
  "studentId": "uuid",
  "sessionToken": "jwt",
  "message": "Registration successful"
}
```

**Tasks**:

- Create StudentCreate Pydantic schema
- Validate phone number format
- Generate UUID for student
- Generate session JWT (2-hour expiration)
- Store student in database

**Effort**: 3 hours

---

### Story 1.4: Get Exam Questions (Paginated)

**Title**: `[Backend] GET /api/exams/{examId}/questions?page={n}`

**Response**:

```json
{
  "page": 1,
  "totalPages": 3,
  "questions": [
    {
      "id": "uuid",
      "questionText": "What is the past tense of 'go'?",
      "questionType": "multiple_choice",
      "choices": ["went", "goes", "going", "gone"],
      "orderIndex": 1
    }
  ]
}
```

**Tasks**:

- Return 5 questions per page
- Order by order_index
- Do NOT return correct_answer field
- Handle pagination logic

**Effort**: 3 hours

---

### Story 1.5: Save Student Answers

**Title**: `[Backend] POST /api/responses`

**Request**:

```json
{
  "studentId": "uuid",
  "questionId": "uuid",
  "answer": "went"
}
```

**Tasks**:

- Save answer with timestamp
- Check if answer is correct
- Store is_correct boolean
- Make idempotent (update if already answered)

**Effort**: 3 hours

---

### Story 1.6: Submit Exam

**Title**: `[Backend] POST /api/exams/submit`

**Request**:

```json
{
  "studentId": "uuid"
}
```

**Tasks**:

- Update student exam_status to 'completed'
- Calculate total score from student_responses
- Calculate percentage
- Trigger report generation

**Effort**: 3 hours

---

## Week 2: Authentication, Teacher Features & Reports

### Story 2.1: Teacher Authentication

**Title**: `[Backend] POST /api/auth/login`

**Request**:

```json
{
  "email": "teacher@school.com",
  "password": "password123"
}
```

**Response**:

```json
{
  "accessToken": "jwt",
  "role": "teacher"
}
```

**Tasks**:

- Create JWT utility functions (create_token, verify_token)
- Hash passwords with bcrypt
- Validate credentials
- Return JWT with 8-hour expiration

**Effort**: 4 hours

---

### Story 2.2: Get All Questions (Teacher)

**Title**: `[Backend] GET /api/questions`

**Response**:

```json
[
  {
    "id": "uuid",
    "questionText": "What is the past tense of 'go'?",
    "choices": ["went", "goes", "going", "gone"],
    "correctAnswer": "went",
    "orderIndex": 1
  }
]
```

**Tasks**:

- Require teacher JWT token
- Return all questions with correct_answer
- Order by order_index

**Effort**: 2 hours

---

### Story 2.3: Create Question (Teacher)

**Title**: `[Backend] POST /api/questions`

**Request**:

```json
{
  "questionText": "What is the plural of 'child'?",
  "choices": ["childs", "children", "childes", "child"],
  "correctAnswer": "children"
}
```

**Tasks**:

- Require teacher JWT
- Validate all fields present
- Auto-assign next order_index
- Store in database

**Effort**: 2 hours

---

### Story 2.4: Update Question (Teacher)

**Title**: `[Backend] PUT /api/questions/{id}`

**Tasks**:

- Require teacher JWT
- Find question by ID
- Update fields
- Return updated question

**Effort**: 2 hours

---

### Story 2.5: Delete Question (Teacher)

**Title**: `[Backend] DELETE /api/questions/{id}`

**Tasks**:

- Require teacher JWT
- Check question exists
- Delete from database
- Return success message

**Effort**: 2 hours

---

### Story 2.6: Generate PDF Report

**Title**: `[Backend] PDF Report Generation Service`

**Tasks**:

- Use ReportLab to generate PDF
- Include: student name, score, percentage, date
- Save PDF to local storage (or S3 for production)
- Return PDF URL

**Report Contents**:

- Student name
- English exam score (e.g., "12 out of 15 correct")
- Percentage (e.g., "80%")
- Assessment date
- Basic styling (school logo optional)

**Effort**: 6 hours

---

### Story 2.7: Download Report

**Title**: `[Backend] GET /api/reports/{studentId}/download`

**Tasks**:

- Find report for student
- Return PDF file stream
- Set proper headers (Content-Type, Content-Disposition)

**Effort**: 2 hours

---

### Story 2.8: Error Handling & Validation

**Title**: `[Backend] Global Exception Handlers`

**Tasks**:

- Create consistent error response format
- Handle validation errors (422)
- Handle authentication errors (401)
- Handle not found errors (404)
- Add error logging

**Effort**: 3 hours

---

### Story 2.9: Testing & Deployment

**Title**: `[Backend] Basic Testing & Deploy`

**Tasks**:

- Write 5-10 unit tests for critical endpoints
- Test registration flow
- Test exam submission flow
- Test question CRUD
- Deploy to Railway or Render
- Configure environment variables

**Effort**: 6 hours

---

## Summary

| Week      | Focus                    | Hours  |
| --------- | ------------------------ | ------ |
| Week 1    | Setup + Student Flow     | 21     |
| Week 2    | Auth + Teacher + Reports | 29     |
| **Total** |                          | **50** |

---

## API Endpoints Summary

### Student Endpoints (No Auth Required - Use Session Token)

- `POST /api/students/register`
- `GET /api/exams/active`
- `GET /api/exams/{examId}/questions?page={n}`
- `POST /api/responses`
- `POST /api/exams/submit`
- `GET /api/reports/{studentId}`
- `GET /api/reports/{studentId}/download`

### Teacher Endpoints (Require JWT)

- `POST /api/auth/login`
- `GET /api/questions`
- `POST /api/questions`
- `PUT /api/questions/{id}`
- `DELETE /api/questions/{id}`

---

## Database Seed Script

Create initial data:

```sql
-- Create English exam
INSERT INTO exams (id, title, duration, total_questions)
VALUES ('uuid', 'English Proficiency Assessment', 1200, 15);

-- Create 15 sample questions
INSERT INTO questions (exam_id, question_text, choices, correct_answer, order_index)
VALUES
  ('exam_id', 'What is the past tense of "go"?', '["went","goes","going","gone"]', 'went', 1),
  -- ... (14 more questions)

-- Create 2 teacher accounts
INSERT INTO users (email, password_hash, role)
VALUES
  ('teacher@school.com', '$2b$12$...', 'teacher'),
  ('admin@school.com', '$2b$12$...', 'teacher');
```

---

**Ready to start! Begin with Story 1.1 on Day 1.**
