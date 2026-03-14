# Frontend Development Backlog

## English Assessment Platform - 2 Week MVP

**Total Estimated Hours**: ~150 hours (3 frontend developers, 2 weeks = ~50 hours each)

---

## Frontend Developer 1: Student Flow

### Story 1.1: Project Setup

**Title**: `[Frontend] Initialize React Project`

**Tasks**:

- Create Vite + React project
- Install dependencies: react-router-dom, axios, react-hook-form
- Set up folder structure (`/components`, `/pages`, `/services`, `/hooks`, `/context`)
- Configure environment variables

**Effort**: 2 hours

---

### Story 1.2: Registration Page

**Title**: `[Frontend] Student Registration Page`

**Tasks**:

- Create registration form (firstName, lastName, phoneNumber)
- Add form validation (all fields required, phone format)
- Style the form with clean UI
- Call `POST /api/students/register` on submit
- Store studentId and sessionToken in sessionStorage
- Redirect to instructions page on success
- Show error message if registration fails

**Effort**: 6 hours

---

### Story 1.3: Routing Structure

**Title**: `[Frontend] Set Up React Router`

**Routes**:

- `/` - Registration page
- `/instructions` - Exam instructions (protected)
- `/exam` - Exam interface (protected)
- `/report` - Report download (protected)
- `/teacher/login` - Teacher login
- `/teacher/dashboard` - Teacher dashboard (protected)

**Tasks**:

- Configure React Router v6
- Create ProtectedRoute component (checks sessionStorage for token)
- Redirect to `/` if no token

**Effort**: 3 hours

---

### Story 1.4: Instructions Page

**Title**: `[Frontend] Exam Instructions Page`

**Tasks**:

- Display exam rules and format
- Show timer duration (20 minutes)
- Show number of questions (15)
- "Start Exam" button navigates to `/exam`
- Store exam start time in sessionStorage

**Effort**: 3 hours

---

### Story 1.5: Question Display Component

**Title**: `[Frontend] Question Card Component`

**Tasks**:

- Create reusable QuestionCard component
- Display question number and text
- Display 4 multiple choice options as radio buttons
- Highlight selected answer
- Mobile-friendly design with large touch targets

**Effort**: 4 hours

---

### Story 1.6: Paginated Exam Interface

**Title**: `[Frontend] Exam Page with Pagination`

**Tasks**:

- Fetch questions: `GET /api/exams/{examId}/questions?page=1`
- Display 5 questions per page
- Show page indicator (e.g., "Page 1 of 3")
- "Next Page" button (disabled if not all questions answered)
- Auto-save answers when clicking "Next Page"
- Last page shows "Submit Exam" instead of "Next Page"
- Cannot navigate backward

**Effort**: 8 hours

---

### Story 1.7: Timer Component

**Title**: `[Frontend] Countdown Timer with Auto-Submit`

**Tasks**:

- Create custom useTimer hook
- Display timer in MM:SS format (e.g., "19:45")
- Update every second
- Store in React Context to persist across pages
- Turn red when < 5 minutes remaining
- Auto-submit exam when timer reaches 00:00
- Calculate remaining time on mount (handle page refresh)

**Effort**: 5 hours

---

### Story 1.8: Auto-Save Functionality

**Title**: `[Frontend] Auto-Save Student Answers`

**Tasks**:

- Call `POST /api/responses` when "Next Page" clicked
- Send all answers from current page
- Show loading spinner during save
- Show error if save fails (prevent navigation)
- Optimistic UI (assume success, show next page immediately)

**Effort**: 3 hours

---

### Story 1.9: Exam Submission

**Title**: `[Frontend] Submit Exam Flow`

**Tasks**:

- "Submit Exam" button on last page
- Call `POST /api/exams/submit`
- Show confirmation message
- Redirect to `/report` page
- Clear sessionStorage exam data

**Effort**: 3 hours

---

### Story 1.10: Report Download Page

**Title**: `[Frontend] Student Report Page`

**Tasks**:

- Fetch report: `GET /api/reports/{studentId}`
- Display score and percentage
- Display congratulations message
- "Download Report" button
- Download PDF: `GET /api/reports/{studentId}/download`
- Proper filename: `Assessment_Report_FirstName_LastName.pdf`

**Effort**: 5 hours

---

**Total for Developer 1**: 42 hours + 8 hours polish/testing = **50 hours**

---

## Frontend Developer 2: Teacher Dashboard

### Story 2.1: Teacher Login Page

**Title**: `[Frontend] Teacher Login Page`

**Tasks**:

- Create login form (email, password)
- Form validation (email format, required fields)
- Call `POST /api/auth/login`
- Store JWT token in localStorage
- Redirect to `/teacher/dashboard` on success
- Show error for invalid credentials

**Effort**: 5 hours

---

### Story 2.2: Protected Teacher Routes

**Title**: `[Frontend] Teacher Route Protection`

**Tasks**:

- Create TeacherProtectedRoute component
- Check localStorage for JWT token
- Verify token not expired (decode JWT)
- Redirect to `/teacher/login` if no valid token
- Auto-logout on token expiration

**Effort**: 3 hours

---

### Story 2.3: Teacher Dashboard Layout

**Title**: `[Frontend] Teacher Dashboard Home`

**Tasks**:

- Create dashboard layout with header
- Show teacher email in header
- "Logout" button (clear localStorage, redirect to login)
- Navigation to "Questions" section
- Responsive sidebar/menu

**Effort**: 4 hours

---

### Story 2.4: Question List View

**Title**: `[Frontend] Display All Questions`

**Tasks**:

- Fetch questions: `GET /api/questions`
- Display in table or card list
- Show: question text, correct answer, order
- "Add Question" button at top
- "Edit" and "Delete" buttons for each question

**Effort**: 6 hours

---

### Story 2.5: Create Question Form

**Title**: `[Frontend] Create New Question`

**Tasks**:

- Modal or separate page with form
- Fields: question text, 4 choices, correct answer
- Form validation (all fields required)
- Call `POST /api/questions` on submit
- Refresh question list on success
- Close modal/return to list

**Effort**: 7 hours

---

### Story 2.6: Edit Question

**Title**: `[Frontend] Edit Existing Question`

**Tasks**:

- Pre-populate form with existing question data
- Call `PUT /api/questions/{id}` on save
- Update question list

**Effort**: 4 hours

---

### Story 2.7: Delete Question

**Title**: `[Frontend] Delete Question with Confirmation`

**Tasks**:

- Show confirmation dialog before delete
- Call `DELETE /api/questions/{id}`
- Remove from question list on success
- Show error if delete fails

**Effort**: 3 hours

---

### Story 2.8: Teacher UI Polish

**Title**: `[Frontend] Teacher Dashboard Polish`

**Tasks**:

- Consistent styling with student pages
- Loading states for API calls
- Error messages for failed operations
- Success notifications
- Responsive design for mobile

**Effort**: 6 hours

---

**Total for Developer 2**: 38 hours + 12 hours testing/polish = **50 hours**

---

## Frontend Developer 3: Design System & Integration

### Story 3.1: Design System

**Title**: `[Frontend] Create Design System & UI Components`

**Tasks**:

- Define color palette (primary, secondary, success, error, neutral)
- Typography scale (font sizes, weights)
- Create reusable components:
  - `Button` (primary, secondary, disabled states)
  - `Input` (text, with validation states)
  - `Card` (content containers)
  - `Modal` (dialogs)
  - `Spinner` (loading states)
- Create `theme.js` with design tokens
- Document components in README

**Effort**: 12 hours

---

### Story 3.2: Responsive Layouts

**Title**: `[Frontend] Mobile-Responsive Design`

**Tasks**:

- Apply responsive CSS to all pages
- Test on mobile (320px to 768px)
- Test on tablet (768px to 1024px)
- Test on desktop (> 1024px)
- Ensure touch targets are minimum 44×44px
- No horizontal scrolling

**Effort**: 8 hours

---

### Story 3.3: Loading States

**Title**: `[Frontend] Loading Spinners & Skeletons`

**Tasks**:

- Add loading spinners for all API calls
- Disable buttons during loading
- Show skeleton loaders for content (optional)
- Loading overlay for page transitions

**Effort**: 4 hours

---

### Story 3.4: Error Handling

**Title**: `[Frontend] Error Messages & Boundaries`

**Tasks**:

- Create ErrorMessage component
- Handle API errors gracefully
- Show user-friendly error messages
- Retry buttons for failed requests
- React Error Boundary for component crashes
- Network offline detection

**Effort**: 5 hours

---

### Story 3.5: Integration Testing

**Title**: `[Frontend] Connect All Features`

**Tasks**:

- Test complete student flow (registration → exam → report)
- Test complete teacher flow (login → create question → edit → delete)
- Verify API integration works
- Fix integration bugs
- Cross-browser testing (Chrome, Firefox, Safari)

**Effort**: 8 hours

---

### Story 3.6: API Service Layer

**Title**: `[Frontend] Centralized API Service`

**Tasks**:

- Create `api.js` service with axios instance
- Add request interceptor (attach JWT token)
- Add response interceptor (handle 401, refresh token if needed)
- Create service methods:
  - `StudentService.register(data)`
  - `ExamService.getQuestions(page)`
  - `ResponseService.saveAnswer(data)`
  - `AuthService.login(credentials)`
  - `QuestionService.getAll()`, `create()`, `update()`, `delete()`

**Effort**: 5 hours

---

### Story 3.7: Final QA & Bug Fixes

**Title**: `[Frontend] Quality Assurance`

**Tasks**:

- Test all user flows manually
- Fix visual bugs
- Fix functional bugs
- Performance optimization (lazy loading, code splitting)
- Accessibility improvements (ARIA labels, keyboard navigation)

**Effort**: 8 hours

---

**Total for Developer 3**: 50 hours

---

## Summary

| Developer | Focus                       | Hours   |
| --------- | --------------------------- | ------- |
| Dev 1     | Student Flow                | 50      |
| Dev 2     | Teacher Dashboard           | 50      |
| Dev 3     | Design System + Integration | 50      |
| **Total** |                             | **150** |

---

## Component Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   └── Spinner.jsx
│   ├── QuestionCard.jsx
│   ├── Timer.jsx
│   └── Header.jsx
├── pages/
│   ├── student/
│   │   ├── RegistrationPage.jsx
│   │   ├── InstructionsPage.jsx
│   │   ├── ExamPage.jsx
│   │   └── ReportPage.jsx
│   └── teacher/
│       ├── LoginPage.jsx
│       ├── DashboardPage.jsx
│       └── QuestionManagement.jsx
├── services/
│   └── api.js           # Axios instance + all API calls
├── hooks/
│   ├── useTimer.js
│   └── useAuth.js
├── context/
│   ├── ExamContext.jsx
│   └── AuthContext.jsx
└── utils/
    ├── theme.js
    └── helpers.js
```

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

---

**Ready to start! Begin with your assigned stories on Day 1.**
