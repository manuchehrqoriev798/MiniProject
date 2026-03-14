import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from '../../components/exam/QuestionCard';
import { useApiContext } from '../../contexts/ApiContext';

// Temporary Mock Data for 15 questions
const MOCK_QUESTIONS = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  text: `What is the correct form of the verb?`,
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
}));

const EXAM_DURATION = 20 * 60; // 20 minutes in seconds

const ExamPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(EXAM_DURATION);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const navigate = useNavigate();
  
  const { 
    questions, 
    loading, 
    error, 
    startExam, 
    submitExam, 
    updateAnswers,
    setError 
  } = useApiContext();

  // Use API questions if available, otherwise fall back to mock data
  const examQuestions = questions.length > 0 ? questions : MOCK_QUESTIONS;

  // Load exam data on component mount
  useEffect(() => {
    const initializeExam = async () => {
      try {
        await startExam();
        sessionStorage.setItem('examStartTime', Date.now().toString());
      } catch (err) {
        console.error('Failed to start exam:', err.message);
      }
    };

    initializeExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Countdown timer effect with proper cleanup
  useEffect(() => {
    const examStartTime = parseInt(sessionStorage.getItem('examStartTime') || Date.now());
    let timer = null;
    
    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
      const remaining = Math.max(0, EXAM_DURATION - elapsed);
      
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        setIsTimeUp(true);
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }
    };

    // Initial update
    updateTimer();
    
    // Set up interval only if time is not already up
    const timeRemaining = Math.max(0, EXAM_DURATION - Math.floor((Date.now() - examStartTime) / 1000));
    if (timeRemaining > 0) {
      timer = setInterval(updateTimer, 1000);
    }

    // Cleanup function
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  const questionsPerPage = 5;
  const totalPages = Math.ceil(examQuestions.length / questionsPerPage);

  // Get only the 5 questions for the current page
  const currentQuestions = examQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const handleAnswerChange = (questionId, selectedOption) => {
    const newAnswers = { ...answers, [questionId]: selectedOption };
    setAnswers(newAnswers);
    updateAnswers(newAnswers);
  };

  const isPageComplete = currentQuestions.every(q => answers[q.id] !== undefined);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinalSubmit = useCallback(async () => {
    try {
      const timeSpent = EXAM_DURATION - timeRemaining;
      
      // Save answers to sessionStorage for review
      sessionStorage.setItem('examAnswers', JSON.stringify(answers));
      sessionStorage.setItem('examSubmissionTime', new Date().toISOString());
      
      // Submit via API if available, otherwise just navigate
      try {
        await submitExam(answers, timeSpent);
      } catch (apiError) {
        console.log('API submission failed, using sessionStorage fallback:', apiError.message);
      }
      
      navigate('/review');
    } catch (err) {
      setError(err.message);
    }
  }, [timeRemaining, answers, submitExam, navigate, setError]);

  // Auto-submit when time is up
  useEffect(() => {
    if (isTimeUp) {
      handleFinalSubmit();
    }
  }, [isTimeUp, handleFinalSubmit]);

  const handleNext = () => {
    if (isTimeUp) {
      handleFinalSubmit();
      return;
    }
    
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0); // Scroll to top for new questions
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0); // Scroll to top for new questions
    }
  };

  const timerColor = timeRemaining <= 60 ? 'red' : timeRemaining <= 300 ? 'orange' : 'black';

  // Show loading state only if we're actually loading from API and have no mock data
  if (loading.exam && questions.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0a1f44, #1b3b70, #2c5590)',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading exam...
      </div>
    );
  }

  // Show error state only if we have an error and no mock data
  if (error && questions.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #0a1f44, #1b3b70, #2c5590)',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h2>Error loading exam</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '10px 20px',
            backgroundColor: '#4cafee',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span>Page {currentPage} of {totalPages}</span>
        <strong style={{ color: timerColor }}>Timer: {formatTime(timeRemaining)}</strong>
      </header>

      {currentQuestions.map((q, index) => (
        <QuestionCard 
          key={q.id}
          index={(currentPage - 1) * questionsPerPage + index}
          question={q}
          selected={answers[q.id]}
          onSelect={(optionIndex) => handleAnswerChange(q.id, optionIndex)}
        />
      ))}

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          onClick={handlePrevious}
          disabled={currentPage === 1 || isTimeUp}
          style={{
            flex: '1',
            padding: '15px',
            background: (currentPage === 1 || isTimeUp) ? '#ccc' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: (currentPage === 1 || isTimeUp) ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>
        
        <button 
          onClick={handleNext}
          disabled={!isPageComplete || isTimeUp}
          style={{
            flex: '1',
            padding: '15px',
            background: (!isPageComplete || isTimeUp) ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: (!isPageComplete || isTimeUp) ? 'not-allowed' : 'pointer'
          }}
        >
          {isTimeUp ? 'Submitting...' : (currentPage === totalPages ? 'Submit Exam' : 'Next Page')}
        </button>
      </div>
    </div>
  );
};

export default ExamPage;