# Online Math & English Skills Assessment Platform

## Project Overview

### 📋 Executive Summary

This project is a **web-based assessment platform** designed for 9th grade students to take Math and English skills assessments online. The platform serves a dual purpose:

1. **Educational Assessment**: Provide students with a standardized way to evaluate their Math and English proficiency
2. **Admission Pipeline**: Collect student contact information for future college admission outreach

### 🎯 Business Goals

- Enable online testing for 9th grade students during admission season
- Streamline the assessment process (traditionally paper-based → digital)
- Automate report generation and distribution
- Build a database of prospective students with contact information
- Provide staff (teachers, managers, admins) with tools to manage the assessment process

### 👥 Target Users

| User Role    | Description                            | Key Needs                                                         |
| ------------ | -------------------------------------- | ----------------------------------------------------------------- |
| **Students** | 9th grade students (14-15 years old)   | Simple registration, clear instructions, intuitive exam interface |
| **Teachers** | Faculty responsible for creating exams | Easy question/exam creation interface                             |
| **Managers** | Staff who need student contact data    | View and export student lists and contact info                    |
| **Admins**   | System administrators                  | Full control over users, exams, and reports                       |

### 🔑 Core Features

#### 1. **Student Registration Flow**

- Students register with basic information (Name, Phone Number)
- No complex authentication required
- Immediate access to exam after registration
- Data stored for administrative use

#### 2. **Exam Delivery System**

- **Two subjects**: Math and English
- **Paginated questions**: 5 questions per page (prevents overwhelming students)
- **Linear navigation**: Students can only move forward (prevents cheating)
- **Auto-save**: Answers saved when navigating between pages
- **Timed exams**: Visible countdown timer, auto-submit when time expires

#### 3. **Assessment Report Generation**

- Automatic PDF report generated after exam completion
- Summarizes performance in both Math and English
- Downloadable by student immediately after finishing
- No manual intervention required

#### 4. **Administrative Backend**

- **Teachers**: Create and manage exam questions
- **Managers**: View all registered students, access contact information
- **Admins**: Full system access including user management and system configuration

### 🎓 Educational Context

**Target Audience**: 9th grade students in Naryn, Kyrgyzstan
**Assessment Purpose**: College admission screening
**Subjects Tested**: Math and English proficiency
**Accessibility**: Must work on both desktop and mobile devices (students may not have computers)

### 📊 Success Metrics

- **Usability**: Students can register and start exam in < 2 minutes
- **Performance**: Page transitions < 2 seconds, PDF generation < 5 seconds
- **Reliability**: Zero data loss during exam sessions (auto-save must work)
- **Availability**: System must be available during scheduled assessment periods

### 🚫 Out of Scope (Phase 1)

- Social login (Google, Facebook, etc.)
- User authentication beyond basic registration
- Adaptive testing (questions adjusting to student performance)
- Detailed analytics or skill-level breakdowns
- Mobile native apps (web-based only)
- Payment processing
- Multi-language support

### 📈 Future Enhancements (Potential Phase 2)

- Detailed performance analytics per topic/skill
- Adaptive question difficulty
- Student dashboard to view historical assessments
- Teacher analytics dashboard
- Export student data to CSV/Excel
- Email notifications with results

---

## Project Structure

This project consists of two main components:

### Frontend (React)

- Student-facing web application
- Registration and exam delivery interface
- Report download functionality
- Responsive design for mobile and desktop

### Backend (Python)

- RESTful API for all business logic
- Exam management and question bank
- PDF report generation
- User authentication and authorization
- Database operations

### Database (Firebase Firestore or PostgreSQL)

- Student registration data
- Exam questions and answer choices
- Student responses and scores
- User accounts (teachers, managers, admins)

---

## Team Organization

As the **Team Lead**, your responsibilities include:

✅ **Planning & Architecture**

- Review and approve technical architecture
- Ensure frontend and backend teams are aligned on API contracts
- Make final decisions on tech stack and database choice

✅ **Task Management**

- Assign backlog items from frontend and backend backlogs
- Track progress in your GitHub Project board
- Conduct code reviews and ensure quality standards

✅ **Integration & Testing**

- Ensure frontend and backend integrate smoothly
- Coordinate testing efforts
- Verify final product meets all SRS requirements

✅ **Stakeholder Communication**

- Report progress to project sponsors
- Clarify requirements when needed
- Demonstrate working features

---

## Next Steps for Team Lead

1. **Review Architecture Document** (`ARCHITECTURE.md`)
   - Understand the system design and tech stack
   - Validate technology choices with your team's skills
2. **Review Backlogs**
   - `FRONTEND-BACKLOG.md` - All frontend tasks
   - `BACKEND-BACKLOG.md` - All backend tasks
3. **Set Up Project Board**
   - Import backlog items into GitHub Projects
   - Create columns: Backlog, To Do, In Progress, In Review, Done
   - Assign team members to initial tasks
4. **Initial Sprint Planning**
   - Prioritize Epic 1 (User Registration) first
   - Have frontend and backend work in parallel on their respective tasks
   - Plan for 1-2 week sprints

5. **Establish Team Workflow**
   - Define branching strategy (e.g., feature branches)
   - Set up code review process
   - Establish API documentation standards (e.g., OpenAPI/Swagger)

---

**Document Version**: 1.0  
**Last Updated**: February 5, 2026  
**Status**: Initial Planning Phase
