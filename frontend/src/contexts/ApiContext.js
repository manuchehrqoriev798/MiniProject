import React, { createContext, useContext, useReducer, useEffect } from 'react';
import apiService from '../services/api';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  examSession: null,
  questions: [],
  instructions: null,
  results: null,
  profile: null,
  examHistory: [],
  loading: {
    auth: false,
    exam: false,
    results: false,
    profile: false,
  },
  error: null,
};

// Action types
const API_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_EXAM_SESSION: 'SET_EXAM_SESSION',
  SET_QUESTIONS: 'SET_QUESTIONS',
  SET_INSTRUCTIONS: 'SET_INSTRUCTIONS',
  SET_RESULTS: 'SET_RESULTS',
  SET_PROFILE: 'SET_PROFILE',
  SET_EXAM_HISTORY: 'SET_EXAM_HISTORY',
  UPDATE_ANSWERS: 'UPDATE_ANSWERS',
};

// Reducer
const apiReducer = (state, action) => {
  switch (action.type) {
    case API_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.type]: action.payload.loading,
        },
      };

    case API_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case API_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case API_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: { ...state.loading, auth: false },
        error: null,
      };

    case API_ACTIONS.LOGOUT:
      return {
        ...initialState,
      };

    case API_ACTIONS.SET_EXAM_SESSION:
      return {
        ...state,
        examSession: action.payload,
        loading: { ...state.loading, exam: false },
      };

    case API_ACTIONS.SET_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
        loading: { ...state.loading, exam: false },
      };

    case API_ACTIONS.SET_INSTRUCTIONS:
      return {
        ...state,
        instructions: action.payload,
        loading: { ...state.loading, exam: false },
      };

    case API_ACTIONS.SET_RESULTS:
      return {
        ...state,
        results: action.payload,
        loading: { ...state.loading, results: false },
      };

    case API_ACTIONS.SET_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: { ...state.loading, profile: false },
      };

    case API_ACTIONS.SET_EXAM_HISTORY:
      return {
        ...state,
        examHistory: action.payload,
      };

    case API_ACTIONS.UPDATE_ANSWERS:
      return {
        ...state,
        examSession: state.examSession
          ? { ...state.examSession, answers: action.payload }
          : null,
      };

    default:
      return state;
  }
};

// Create context
const ApiContext = createContext();

// Provider component
export const ApiProvider = ({ children }) => {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'auth', loading: true } });
      
      apiService.getCurrentUser()
        .then(user => {
          dispatch({ type: API_ACTIONS.LOGIN_SUCCESS, payload: { user } });
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'auth', loading: false } });
        });
    }
  }, []);

  // Action creators
  const actions = {
    setLoading: (type, loading) => {
      dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type, loading } });
    },

    setError: (error) => {
      dispatch({ type: API_ACTIONS.SET_ERROR, payload: error });
    },

    clearError: () => {
      dispatch({ type: API_ACTIONS.CLEAR_ERROR });
    },

    login: async (credentials) => {
      try {
        dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'auth', loading: true } });
        
        const response = await apiService.login(credentials);
        // Backend returns { access_token, email, full_name, role }
        localStorage.setItem('authToken', response.access_token);
        
        const user = {
          email: response.email,
          full_name: response.full_name,
          role: response.role,
        };
        dispatch({ type: API_ACTIONS.LOGIN_SUCCESS, payload: { user } });
        return response;
      } catch (error) {
        dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'auth', loading: false } });
        // Only set user-facing error for critical errors, not backend unavailability
        if (!error.message.includes('backend may not be running') && 
            !error.message.includes('Server returned HTML instead of JSON')) {
          dispatch({ type: API_ACTIONS.SET_ERROR, payload: error.message });
        }
        throw error;
      }
    },

    logout: async () => {
      try {
        await apiService.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        localStorage.removeItem('authToken');
        dispatch({ type: API_ACTIONS.LOGOUT });
      }
    },

    loadExamData: async () => {
      try {
        dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'exam', loading: true } });
        
        const [questions, instructions] = await Promise.allSettled([
          apiService.getExamQuestions(),
          apiService.getExamInstructions()
        ]);

        const questionsData = questions.status === 'fulfilled' ? questions.value : [];
        const instructionsData = instructions.status === 'fulfilled' ? instructions.value : null;

        dispatch({ type: API_ACTIONS.SET_QUESTIONS, payload: questionsData });
        dispatch({ type: API_ACTIONS.SET_INSTRUCTIONS, payload: instructionsData });
        
        // Clear any existing error state since we successfully loaded data
        dispatch({ type: API_ACTIONS.CLEAR_ERROR });
        
        // Clear loading state
        dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'exam', loading: false } });
        
        // Log errors but don't fail the operation
        if (questions.status === 'rejected') {
          console.error('Failed to load questions:', questions.reason);
          // Only set user-facing error for critical errors, not backend unavailability
          if (!questions.reason.message.includes('backend may not be running') && 
              !questions.reason.message.includes('Server returned HTML instead of JSON')) {
            dispatch({ type: API_ACTIONS.SET_ERROR, payload: questions.reason.message });
          }
        }
        if (instructions.status === 'rejected') {
          console.error('Failed to load instructions:', instructions.reason);
          // Only set user-facing error for critical errors, not backend unavailability
          if (!instructions.reason.message.includes('backend may not be running') && 
              !instructions.reason.message.includes('Server returned HTML instead of JSON')) {
            dispatch({ type: API_ACTIONS.SET_ERROR, payload: instructions.reason.message });
          }
        }
        
      } catch (error) {
        console.error('Unexpected error in loadExamData:', error);
        // Only set user-facing error for critical errors, not backend unavailability
        if (!error.message.includes('backend may not be running') && 
            !error.message.includes('Server returned HTML instead of JSON')) {
          dispatch({ type: API_ACTIONS.SET_ERROR, payload: error.message });
        }
        // Always clear loading state, even on error
        dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'exam', loading: false } });
        throw error;
      }
    },

    startExam: async () => {
      try {
        dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'exam', loading: true } });
        
        const session = await apiService.startExam();
        dispatch({ type: API_ACTIONS.SET_EXAM_SESSION, payload: session });
        // Questions come back inside the startExam response
        if (session.questions && session.questions.length > 0) {
          dispatch({ type: API_ACTIONS.SET_QUESTIONS, payload: session.questions });
        }
        return session;
      } catch (error) {
        console.error('Failed to start exam:', error);
        // Don't show user-facing error for backend unavailability
        if (!error.message.includes('backend may not be running') && 
            !error.message.includes('Server returned HTML instead of JSON') &&
            !error.message.includes('Not Found')) {
          dispatch({ type: API_ACTIONS.SET_ERROR, payload: error.message });
        }
        dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'exam', loading: false } });
        throw error;
      }
    },

    submitExam: async (answers, timeSpent) => {
      try {
        dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'exam', loading: true } });
        
        // Convert answers dict {questionId: selectedIndex} → [{question_id, selected_answer}]
        const answersArray = Object.entries(answers).map(([question_id, selected_answer]) => ({
          question_id,
          selected_answer,
        }));
        const results = await apiService.submitExam({
          session_id: state.examSession?.session_id,
          answers: answersArray,
        });

        dispatch({ type: API_ACTIONS.SET_RESULTS, payload: results });
        return results;
      } catch (error) {
        console.error('Failed to submit exam:', error);
        // Only set user-facing error for critical errors, not backend unavailability
        if (!error.message.includes('backend may not be running') && 
            !error.message.includes('Server returned HTML instead of JSON')) {
          dispatch({ type: API_ACTIONS.SET_ERROR, payload: error.message });
        }
        // Clear loading state on error
        dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'exam', loading: false } });
        throw error;
      }
    },

    updateAnswers: (answers) => {
      dispatch({ type: API_ACTIONS.UPDATE_ANSWERS, payload: answers });
    },

    loadResults: async (examId) => {
      try {
        dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'results', loading: true } });
        
        const results = await apiService.getExamResults(examId);
        dispatch({ type: API_ACTIONS.SET_RESULTS, payload: results });
        return results;
      } catch (error) {
        // Only set user-facing error for critical errors, not backend unavailability
        if (!error.message.includes('backend may not be running') && 
            !error.message.includes('Server returned HTML instead of JSON')) {
          dispatch({ type: API_ACTIONS.SET_ERROR, payload: error.message });
        }
        throw error;
      }
    },

    loadProfile: async () => {
      try {
        dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'profile', loading: true } });
        
        const profile = await apiService.getStudentProfile();
        dispatch({ type: API_ACTIONS.SET_PROFILE, payload: profile });
        return profile;
      } catch (error) {
        // Only set user-facing error for critical errors, not backend unavailability
        if (!error.message.includes('backend may not be running') && 
            !error.message.includes('Server returned HTML instead of JSON')) {
          dispatch({ type: API_ACTIONS.SET_ERROR, payload: error.message });
        }
        throw error;
      }
    },

    updateProfile: async (profileData) => {
      try {
        dispatch({ type: API_ACTIONS.SET_LOADING, payload: { type: 'profile', loading: true } });
        
        const updatedProfile = await apiService.updateStudentProfile(profileData);
        dispatch({ type: API_ACTIONS.SET_PROFILE, payload: updatedProfile });
        return updatedProfile;
      } catch (error) {
        // Only set user-facing error for critical errors, not backend unavailability
        if (!error.message.includes('backend may not be running') && 
            !error.message.includes('Server returned HTML instead of JSON')) {
          dispatch({ type: API_ACTIONS.SET_ERROR, payload: error.message });
        }
        throw error;
      }
    },

    loadExamHistory: async () => {
      try {
        const history = await apiService.getStudentExamHistory();
        dispatch({ type: API_ACTIONS.SET_EXAM_HISTORY, payload: history });
        return history;
      } catch (error) {
        // Only set user-facing error for critical errors, not backend unavailability
        if (!error.message.includes('backend may not be running') && 
            !error.message.includes('Server returned HTML instead of JSON')) {
          dispatch({ type: API_ACTIONS.SET_ERROR, payload: error.message });
        }
        throw error;
      }
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

// Custom hook to use the context
export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
};

export default ApiContext;
