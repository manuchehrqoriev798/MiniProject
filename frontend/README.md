# Frontend (React)

Important links to see: 
Login: http://localhost:3000/
Signup: http://localhost:3000/signup
Instructions: http://localhost:3000/instructions
Exam: http://localhost:3000/exam
Report: http://localhost:3000/report

This is the frontend application for the assessment platform. It was bootstrapped with Create React App.

## Quickstart

Prerequisites
- Node.js (14+ recommended)
- npm

Install dependencies:

```bash
cd frontend
npm install
```

Start development server:

```bash
npm run dev
```

Open the app at: http://localhost:3000

## Important routes (student)

- Login: http://localhost:3000/
- Signup: http://localhost:3000/signup
- Instructions: http://localhost:3000/instructions
- Exam: http://localhost:3000/exam
- Report: http://localhost:3000/report

## Project structure (key files)

- `package.json` — npm scripts & deps
- `public/` — static assets
- `src/`
  - `index.js` — app entry, router wrapper
  - `App.js` — route definitions
  - `pages/` — page components (`Login.js`, `Signup.js`, `InstructionsPage.js`, `student/`, `teacher/`)
  - `components/` — shared components (`ProtectedRoute.js`, `exam/QuestionCard.js`)

## Developer notes

- Styling: `Login.js` and `Signup.js` use the primary card look. Other student/teacher pages were updated to match that style for consistency.
- ProtectedRoute is currently bypassed for testing. File: `src/components/ProtectedRoute.js`.
  - To re-enable protection, restore behavior that checks `sessionStorage.getItem('token')` and redirects to `/` when missing.

Simulate a logged-in user in the browser console while testing:

```javascript
sessionStorage.setItem('token', 'dev-token')
```

Remove the token with:

```javascript
sessionStorage.removeItem('token')
```

## Linting

Run ESLint for JS files:

```bash
npx eslint "src/**" --ext .js
```

## Next tasks (high level)

- Implement timer hook & context (`useTimer`) and persist remaining time across refreshes.
- Build paginated `ExamPage` with autosave and submit flow.
- Implement report download and finalize teacher dashboard.

If you want, I can implement the timer and paginated exam flow next — tell me which story to prioritize.
