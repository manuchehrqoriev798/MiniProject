import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TEACHER_EMAIL_KEY, TEACHER_TOKEN_KEY } from '../../constants/teacherAuth';
import { loginTeacherRequest } from '../../services/teacherApi';

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function TeacherLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = useMemo(() => location.state?.from || '/teacher/dashboard', [location.state]);

  function validateForm() {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!validateEmail(email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (!password.trim()) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await loginTeacherRequest({
        email: email.trim(),
        password,
      });

      localStorage.setItem(TEACHER_TOKEN_KEY, result.token);
      localStorage.setItem(TEACHER_EMAIL_KEY, result.email || email.trim());
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setServerError(error.message || 'Invalid credentials.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="teacher-auth-page">
      <div className="teacher-auth-card">
        <h1>Teacher Login</h1>
        <p>Sign in to manage exam questions.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="teacher-email">Email</label>
          <input
            id="teacher-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="teacher@school.edu"
            autoComplete="email"
            aria-invalid={Boolean(fieldErrors.email)}
          />
          {fieldErrors.email ? <span className="field-error">{fieldErrors.email}</span> : null}

          <label htmlFor="teacher-password">Password</label>
          <input
            id="teacher-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            aria-invalid={Boolean(fieldErrors.password)}
          />
          {fieldErrors.password ? <span className="field-error">{fieldErrors.password}</span> : null}

          {serverError ? <div className="server-error">{serverError}</div> : null}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
