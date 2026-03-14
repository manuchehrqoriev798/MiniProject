import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

// Generic hook for API calls with loading and error states
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, execute };
};

// Hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { loading, error, execute } = useApi(apiService.getCurrentUser);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      execute().then(userData => {
        setUser(userData);
        setIsAuthenticated(true);
      }).catch(() => {
        localStorage.removeItem('authToken');
      });
    }
  }, [execute]);

  const login = async (credentials) => {
    const response = await apiService.login(credentials);
    localStorage.setItem('authToken', response.token);
    setUser(response.user);
    setIsAuthenticated(true);
    return response;
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return { user, isAuthenticated, loading, error, login, logout };
};

// Hook for exam management
export const useExam = () => {
  const [examSession, setExamSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [instructions, setInstructions] = useState(null);
  
  const { loading: questionsLoading, execute: fetchQuestions } = useApi(apiService.getExamQuestions);
  const { loading: instructionsLoading, execute: fetchInstructions } = useApi(apiService.getExamInstructions);
  const { loading: sessionLoading, execute: startExamSession } = useApi(apiService.startExam);
  const { loading: submitLoading, execute: submitExam } = useApi(apiService.submitExam);

  const loadExamData = async () => {
    try {
      const [questionsData, instructionsData] = await Promise.all([
        fetchQuestions(),
        fetchInstructions()
      ]);
      setQuestions(questionsData);
      setInstructions(instructionsData);
    } catch (error) {
      console.error('Failed to load exam data:', error);
      throw error;
    }
  };

  const startExam = async () => {
    const session = await startExamSession();
    setExamSession(session);
    return session;
  };

  const submitAnswers = async (answers, timeSpent) => {
    const result = await submitExam({
      sessionId: examSession?.id,
      answers,
      timeSpent,
      submittedAt: new Date().toISOString(),
    });
    return result;
  };

  return {
    examSession,
    questions,
    instructions,
    loading: questionsLoading || instructionsLoading || sessionLoading,
    submitLoading,
    loadExamData,
    startExam,
    submitAnswers,
  };
};

// Hook for exam results and reports
export const useResults = (examId) => {
  const { data: results, loading, error, execute } = useApi(
    () => apiService.getExamResults(examId),
    [examId]
  );

  const { loading: generating, execute: generateReport } = useApi(
    () => apiService.generateReport(examId),
    [examId]
  );

  const downloadReport = async (format = 'pdf') => {
    const blob = await apiService.downloadReport(examId, format);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam-report-${examId}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return {
    results,
    loading,
    error,
    generating,
    generateReport,
    downloadReport,
  };
};

// Hook for student profile
export const useStudentProfile = () => {
  const { data: profile, loading, error, execute } = useApi(apiService.getStudentProfile);
  const { loading: updating, execute: updateProfile } = useApi(apiService.updateStudentProfile);

  const updateProfileData = async (profileData) => {
    const updatedProfile = await updateProfile(profileData);
    return updatedProfile;
  };

  return {
    profile,
    loading,
    updating,
    error,
    updateProfile: updateProfileData,
    refreshProfile: execute,
  };
};

// Hook for exam history
export const useExamHistory = () => {
  const { data: exams, loading, error, execute } = useApi(apiService.getStudentExamHistory);

  return {
    exams,
    loading,
    error,
    refreshHistory: execute,
  };
};
