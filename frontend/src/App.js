import { Routes, Route, Navigate } from 'react-router-dom';
import { ApiProvider } from './contexts/ApiContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import InstructionsPage from './pages/InstructionsPage';
import ExamPage from './pages/student/ExamPage';
import ReviewPage from './pages/student/ReviewPage';
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherProtectedRoute from './components/teacher/TeacherProtectedRoute';
import './styles/teacher.css';

function App() {
  return (
    <ApiProvider>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student flow (protected) */}
        <Route path="/instructions" element={<ProtectedRoute><InstructionsPage /></ProtectedRoute>} />
        <Route path="/exam" element={<ProtectedRoute><ExamPage /></ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />

        {/* Teacher flow */}
        <Route path="/teacher/login" element={<Navigate to="/" replace />} />
        <Route path="/teacher/dashboard" element={<TeacherProtectedRoute><TeacherDashboard /></TeacherProtectedRoute>} />
      </Routes>
    </ApiProvider>
  );
}

export default App;
