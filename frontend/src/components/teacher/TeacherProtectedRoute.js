import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { TEACHER_EMAIL_KEY, TEACHER_TOKEN_KEY } from '../../constants/teacherAuth';
import { getJwtExpiryMs, isJwtExpired } from '../../utils/jwt';

function clearTeacherSession() {
  localStorage.removeItem(TEACHER_TOKEN_KEY);
  localStorage.removeItem(TEACHER_EMAIL_KEY);
}

export default function TeacherProtectedRoute({ children }) {
  const [forcedLogout, setForcedLogout] = useState(false);

  const token = localStorage.getItem(TEACHER_TOKEN_KEY);
  const expired = useMemo(() => (token ? isJwtExpired(token) : true), [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const expiryMs = getJwtExpiryMs(token);
    if (!expiryMs) {
      clearTeacherSession();
      setForcedLogout(true);
      return;
    }

    const timeoutMs = Math.max(0, expiryMs - Date.now());
    const timeoutId = setTimeout(() => {
      clearTeacherSession();
      setForcedLogout(true);
    }, timeoutMs);

    return () => clearTimeout(timeoutId);
  }, [token]);

  if (!token || expired || forcedLogout) {
    clearTeacherSession();
    return <Navigate to="/" replace />;
  }

  return children;
}
