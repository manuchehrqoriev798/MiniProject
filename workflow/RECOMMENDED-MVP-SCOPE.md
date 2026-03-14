# Recommended MVP Scope

## Online English Assessment Platform

**Timeline**: 2 Weeks  
**Team**: 3 Frontend Developers + 1 Backend Developer + Team Lead + PM

---

## 🎯 What We're Building

A **focused, production-ready assessment platform** for 9th grade students to take an English proficiency exam and receive instant results.

### Core User Journey

```
Student registers → Takes English exam → Receives PDF report with score
Teacher logs in → Creates/manages exam questions
```

**That's it.** Clean, simple, and fully functional.

---

## ✅ Features Included

### For Students

- **Registration**: Name + phone number (simple, fast)
- **English Exam**: 15 questions total, paginated (3 pages × 5 questions)
- **Timer**: 20-minute countdown with auto-submit
- **Report**: Downloadable PDF with score and percentage

### For Teachers

- **Login**: Secure authentication (email + password)
- **Question Management**: Create, edit, and delete exam questions
- **Question List**: View all questions for the English exam

### Technical Features

- PostgreSQL database with proper schema
- JWT authentication (students get session token, teachers use login)
- PDF generation (auto-generated report with student name and score)
- Responsive design (works on desktop and mobile)
- Clean error handling

---

## ❌ Not Included (To Keep 2-Week Deadline)

- ❌ Math exam (English only)
- ❌ Manager role/dashboard
- ❌ Admin statistics dashboard
- ❌ User management interface
- ❌ CSV export
- ❌ Email notifications
- ❌ Advanced filtering/search
- ❌ Question categories

**Why not?** We have 2 weeks. Better to build one complete, polished feature than many half-finished ones.

---

## 👥 Work Distribution

### Backend Developer (~50 hours)

**Week 1** (25 hours):

- Project setup (FastAPI + PostgreSQL + Docker)
- Database models (students, exams, questions, responses, users)
- Student registration API
- Exam questions API (paginated, 5 per page)
- Student response API (save answers)

**Week 2** (25 hours):

- Teacher authentication (JWT)
- Question CRUD endpoints (create, edit, delete)
- PDF report generation service
- Exam submission and scoring logic
- Basic testing and bug fixes

---

### Frontend Developer 1: Student Flow (~50 hours)

**Week 1** (25 hours):

- Project setup (React + Vite + React Router)
- Registration page with form validation
- Exam instructions page
- Question display component (multiple choice)
- Paginated exam interface

**Week 2** (25 hours):

- Timer component (countdown + auto-submit)
- Auto-save functionality
- Exam submission flow
- Report download page
- Polish and bug fixes

---

### Frontend Developer 2: Teacher Dashboard (~50 hours)

**Week 1** (25 hours):

- Teacher login page
- Protected routes setup
- Teacher dashboard layout
- Question list view

**Week 2** (25 hours):

- Create question form
- Edit question functionality
- Delete question with confirmation
- Form validation
- Polish and bug fixes

---

### Frontend Developer 3: Design & Integration (~50 hours)

**Week 1** (25 hours):

- Design system (colors, buttons, inputs, cards)
- Reusable UI components library
- Responsive layouts for all pages
- Loading states and spinners

**Week 2** (25 hours):

- Error handling and messages
- Integration testing (connect all flows)
- Mobile responsiveness polish
- Final QA and bug fixes
- Help other devs with blockers

---

## 📅 2-Week Sprint Plan

### Week 1: Build Core Features

**Monday-Tuesday** (Days 1-2):

- Backend: Project setup, database, student registration
- Frontend: Project setup, registration page, design system basics
- **Milestone**: Student can register

**Wednesday-Thursday** (Days 3-4):

- Backend: Exam questions API, response saving
- Frontend: Exam interface, question display, pagination
- **Milestone**: Student can view and answer questions

**Friday** (Day 5):

- Backend: Teacher auth basics
- Frontend: Teacher login page, protected routes
- **Milestone**: Teachers can log in, students can complete exam

---

### Week 2: Complete & Polish

**Monday-Tuesday** (Days 6-7):

- Backend: Question CRUD endpoints, PDF generation
- Frontend: Question management UI, timer functionality
- **Milestone**: Teachers can manage questions, PDF reports generate

**Wednesday-Thursday** (Days 8-9):

- Backend: Scoring logic, testing, bug fixes
- Frontend: Report download, responsive design, error handling
- **Milestone**: End-to-end flow works

**Friday** (Day 10):

- **Everyone**: Final testing, polish, deploy to staging
- **Team Lead**: Code review, integration verification
- **PM**: User acceptance testing
- **Milestone**: Production-ready application

---

## 📊 Technical Specifications

### Database Schema (PostgreSQL)

**students**

- id, first_name, last_name, phone_number, registration_date, exam_status

**exams**

- id, title, duration, total_questions (fixed: 1 English exam)

**questions**

- id, exam_id, question_text, choices (JSON), correct_answer, order_index

**student_responses**

- id, student_id, question_id, answer, is_correct, answered_at

**users** (teachers only)

- id, email, password_hash, role (always 'teacher')

**reports**

- id, student_id, score, percentage, pdf_url, generated_at

---

### API Endpoints

**Student Endpoints**:

- `POST /api/students/register` - Register student
- `GET /api/exams/active` - Get English exam details
- `GET /api/exams/{examId}/questions?page=1` - Get questions (5 per page)
- `POST /api/responses` - Save student answers
- `POST /api/exams/{examId}/submit` - Submit exam
- `GET /api/reports/{studentId}` - Get report
- `GET /api/reports/{studentId}/download` - Download PDF

**Teacher Endpoints**:

- `POST /api/auth/login` - Teacher login
- `GET /api/questions` - List all questions
- `POST /api/questions` - Create question
- `PUT /api/questions/{id}` - Update question
- `DELETE /api/questions/{id}` - Delete question

---

## 🎯 Success Criteria

By end of Week 2, we must have:

✅ **Student can**:

- Register with name and phone
- Take 15-question English exam
- See countdown timer
- Submit exam (auto-submit if time runs out)
- Download PDF report with score

✅ **Teacher can**:

- Log in with email/password
- See all exam questions
- Create new questions (text + 4 multiple choice options)
- Edit existing questions
- Delete questions

✅ **System must**:

- Save answers automatically when navigating pages
- Calculate score correctly
- Generate PDF report within 5 seconds
- Work on mobile and desktop
- Handle errors gracefully

✅ **Code quality**:

- Clean, readable code
- No hardcoded credentials
- Environment variables for config
- Basic error logging

---

## 🚀 Initial Setup (Day 1)

### Backend Developer

```bash
# Create backend project
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic pydantic python-jose passlib reportlab

# Initialize database
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=dev123 -e POSTGRES_DB=assessment postgres:15

# Create database models and migrations
alembic init migrations
```

### Frontend Developers

```bash
# Create frontend project
npm create vite@latest frontend -- --template react
cd frontend
npm install react-router-dom axios react-hook-form

# Start dev server
npm run dev
```

### Team Lead

- Set up GitHub repository
- Create `main` and `develop` branches
- Set up basic CI/CD (optional but recommended)

---

## 📝 Database Seed Data

Create 2 teacher accounts via database seed script:

```sql
INSERT INTO users (email, password_hash, role, created_at)
VALUES
  ('teacher@school.com', '$2b$12$hashed...', 'teacher', NOW());

-- Default login: teacher@school.com / password123
```

Create sample English exam with 15 questions via seed script.

---

## 💡 Team Lead Responsibilities

### Daily Standups (15 minutes each morning)

- What did I complete yesterday?
- What am I working on today?
- Any blockers?

### Code Reviews (ongoing)

- All PRs require team lead approval
- Focus on API contracts matching
- Ensure clean code standards

### Integration Points (critical)

- **Day 3**: Verify registration API works with frontend
- **Day 5**: Verify exam questions API pagination works
- **Day 7**: Verify teacher auth working in frontend
- **Day 9**: End-to-end test of full student flow

---

## ⚠️ Risk Mitigation

### Top Risks

**Risk**: Backend developer gets blocked on PDF generation  
**Mitigation**: Start PDF work on Day 6, use simple text-based report as fallback

**Risk**: Frontend devs waiting for backend APIs  
**Mitigation**: Use mock data and mock API responses in Week 1

**Risk**: Timer doesn't work across page navigation  
**Mitigation**: Store start time in sessionStorage, calculate remaining time on each page

**Risk**: Questions are hardcoded, can't be managed  
**Mitigation**: Create database seed script with initial 15 questions, then build management UI

---

## 🎓 Learning Goals

By the end of this project, your team will understand:

- **Backend**: PostgreSQL schemas, FastAPI routing, JWT authentication, PDF generation
- **Frontend**: React Router, form handling, protected routes, state management
- **Full-Stack**: How frontend and backend communicate via REST APIs
- **DevOps**: Basic deployment, environment configuration
- **Teamwork**: Git workflow, code reviews, integration testing

---

**This scope is tight but achievable. Focus on making these core features work perfectly rather than adding more half-finished features.**

**Let's build something clean and production-ready in 2 weeks! 🚀**
