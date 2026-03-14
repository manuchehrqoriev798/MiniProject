# Student Interface API Documentation

This document outlines all the API endpoints required for the student interface. The frontend is built to handle both real API responses and fall back to mock data when the backend is not available.

## Base URL
```
http://localhost:3001/api
```
(Or whatever is configured via `REACT_APP_API_URL` environment variable)

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication Endpoints

#### POST /auth/login
Login a student and return an auth token.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "student_id",
    "name": "Student Name",
    "email": "student@example.com",
    "role": "student"
  }
}
```

#### POST /auth/signup
Register a new student account.

**Request Body:**
```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "student_id",
    "name": "Student Name",
    "email": "student@example.com",
    "role": "student"
  }
}
```

#### POST /auth/logout
Logout the current user (invalidate token).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### GET /auth/me
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "student_id",
  "name": "Student Name",
  "email": "student@example.com",
  "role": "student"
}
```

### Exam Endpoints

#### GET /exam/instructions
Get exam instructions and metadata.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "duration": "20 Minutes",
  "totalQuestions": 15,
  "navigation": "You can navigate between pages using Previous and Next buttons.",
  "rules": [
    "Read each question carefully before answering",
    "You must answer all questions on the current page before proceeding",
    "The exam will auto-submit when time expires",
    "Your answers are saved automatically"
  ]
}
```

#### GET /exam/questions
Get all exam questions.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "id": 1,
    "text": "What is the correct form of the verb?",
    "options": [
      "Option A",
      "Option B", 
      "Option C",
      "Option D"
    ],
    "correctAnswer": 0
  },
  {
    "id": 2,
    "text": "Another question here?",
    "options": [
      "Option A",
      "Option B",
      "Option C", 
      "Option D"
    ],
    "correctAnswer": 2
  }
]
```

#### POST /exam/start
Start a new exam session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "session_id",
  "studentId": "student_id",
  "startTime": "2024-01-01T10:00:00Z",
  "duration": 1200,
  "status": "in_progress",
  "answers": {}
}
```

#### POST /exam/submit
Submit exam answers and get results.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "sessionId": "session_id",
  "answers": {
    "1": 0,
    "2": 2,
    "3": 1
  },
  "timeSpent": 1150,
  "submittedAt": "2024-01-01T10:19:10Z"
}
```

**Response:**
```json
{
  "sessionId": "session_id",
  "score": 85,
  "totalQuestions": 15,
  "correctAnswers": 13,
  "percentage": 86.7,
  "timeSpent": 1150,
  "submittedAt": "2024-01-01T10:19:10Z",
  "results": [
    {
      "questionId": 1,
      "userAnswer": 0,
      "correctAnswer": 0,
      "isCorrect": true
    },
    {
      "questionId": 2,
      "userAnswer": 2,
      "correctAnswer": 2,
      "isCorrect": true
    }
  ]
}
```

#### GET /exam/session/:sessionId
Get exam session details.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "session_id",
  "studentId": "student_id",
  "startTime": "2024-01-01T10:00:00Z",
  "duration": 1200,
  "status": "in_progress",
  "answers": {
    "1": 0,
    "2": 2
  },
  "timeRemaining": 300
}
```

#### PUT /exam/session/:sessionId/progress
Update exam progress (save answers periodically).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "answers": {
    "1": 0,
    "2": 2,
    "3": 1
  },
  "currentPage": 2
}
```

**Response:**
```json
{
  "message": "Progress updated successfully",
  "answers": {
    "1": 0,
    "2": 2,
    "3": 1
  }
}
```

### Results and Reports Endpoints

#### GET /results/:examId
Get exam results by exam ID.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "examId": "exam_id",
  "sessionId": "session_id",
  "score": 85,
  "totalQuestions": 15,
  "correctAnswers": 13,
  "percentage": 86.7,
  "timeSpent": 1150,
  "submittedAt": "2024-01-01T10:19:10Z",
  "gradedAt": "2024-01-01T10:20:00Z",
  "results": [
    {
      "questionId": 1,
      "question": "What is the correct form of the verb?",
      "userAnswer": 0,
      "correctAnswer": 0,
      "isCorrect": true,
      "options": ["Option A", "Option B", "Option C", "Option D"]
    }
  ]
}
```

#### GET /results/student/:studentId
Get all results for a specific student.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "examId": "exam_id",
    "sessionId": "session_id",
    "score": 85,
    "totalQuestions": 15,
    "percentage": 86.7,
    "submittedAt": "2024-01-01T10:19:10Z",
    "status": "completed"
  }
]
```

#### POST /reports/:examId/generate
Generate a report for an exam.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "reportId": "report_id",
  "examId": "exam_id",
  "generatedAt": "2024-01-01T10:25:00Z",
  "format": "pdf",
  "downloadUrl": "/api/reports/exam_id/download?format=pdf"
}
```

#### GET /reports/:examId/download
Download a generated report.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `format`: `pdf` or `txt` (default: pdf)

**Response:** Binary file data

### Student Profile Endpoints

#### GET /student/profile
Get student profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "student_id",
  "name": "Student Name",
  "email": "student@example.com",
  "createdAt": "2024-01-01T09:00:00Z",
  "lastLogin": "2024-01-01T10:00:00Z",
  "examCount": 5,
  "averageScore": 82.5,
  "bestScore": 95
}
```

#### PUT /student/profile
Update student profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Name"
}
```

**Response:**
```json
{
  "id": "student_id",
  "name": "Updated Name",
  "email": "student@example.com",
  "createdAt": "2024-01-01T09:00:00Z",
  "lastLogin": "2024-01-01T10:00:00Z",
  "examCount": 5,
  "averageScore": 82.5,
  "bestScore": 95
}
```

#### GET /student/exams
Get student's exam history.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "examId": "exam_id",
    "sessionId": "session_id",
    "title": "English Grammar Test",
    "score": 85,
    "totalQuestions": 15,
    "percentage": 86.7,
    "submittedAt": "2024-01-01T10:19:10Z",
    "status": "completed",
    "timeSpent": 1150
  }
]
```

### Utility Endpoints

#### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

#### GET /time
Get server time (for synchronization).

**Response:**
```json
{
  "serverTime": "2024-01-01T10:00:00Z",
  "timestamp": 1704110400000
}
```

## Error Handling

All endpoints should return appropriate HTTP status codes and error messages:

**400 Bad Request:**
```json
{
  "message": "Invalid request data",
  "details": "Email is required"
}
```

**401 Unauthorized:**
```json
{
  "message": "Authentication required",
  "details": "Invalid or expired token"
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied",
  "details": "You don't have permission to access this resource"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found",
  "details": "Exam session not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Internal server error",
  "details": "Database connection failed"
}
```

## Frontend Integration Notes

1. **Fallback Behavior**: The frontend will use mock data if API endpoints are not available
2. **Token Storage**: JWT tokens are stored in localStorage under 'authToken'
3. **Automatic Retry**: The frontend includes retry logic for failed requests
4. **Loading States**: All API calls show appropriate loading indicators
5. **Error Handling**: Errors are displayed to users with retry options
6. **Session Management**: Exam sessions are tracked and auto-saved periodically

## Testing

The frontend can be tested without a working backend using the mock data. To test with the backend:

1. Ensure the backend is running on the configured port
2. Set the `REACT_APP_API_URL` environment variable if needed
3. The frontend will automatically switch from mock data to real API calls

## CORS

Ensure the backend includes appropriate CORS headers to allow requests from the frontend domain:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```
