import { Navigate } from 'react-router-dom';
import { decodeJwt, isJwtExpired } from '../utils/jwt';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken');

  if (!token || isJwtExpired(token)) {
    return <Navigate to="/" replace />;
  }

  const payload = decodeJwt(token);
  if (payload?.role === 'teacher') {
    return <Navigate to="/teacher/dashboard" replace />;
  }

  return children || null;
}
