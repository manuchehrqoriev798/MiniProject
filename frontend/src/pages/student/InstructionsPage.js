import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiContext } from '../../contexts/ApiContext';

const InstructionsPage = () => {
  const navigate = useNavigate();
  const { instructions, loading, error } = useApiContext();

  const handleStart = () => {
    // Set new exam start time
    sessionStorage.setItem('examStartTime', Date.now().toString());
    navigate('/exam');
  };

  const handleStartFresh = () => {
    // Clear any existing exam data for completely fresh start
    sessionStorage.removeItem('examAnswers');
    sessionStorage.removeItem('examSubmissionTime');
    sessionStorage.removeItem('examStartTime');
    sessionStorage.removeItem('reviewCompletedTime');
    
    // Set new exam start time
    sessionStorage.setItem('examStartTime', Date.now().toString());
    navigate('/exam');
  };

  // Show loading state only if we're actually loading and have no fallback data
  if (loading.exam && !instructions) {
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
        Loading instructions...
      </div>
    );
  }

  // Show error state only if it's a critical error (not backend unavailability)
  if (error && !instructions && !error.message.includes('backend may not be running') && 
      !error.message.includes('Server returned HTML instead of JSON')) {
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
        <h2>Error loading instructions</h2>
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

  // Use API instructions if available, otherwise use defaults
  const examInstructions = instructions || {
    duration: '20 Minutes',
    totalQuestions: 15,
    navigation: 'You can navigate between pages using Previous and Next buttons.',
    rules: [
      'Read each question carefully before answering',
      'You must answer all questions on the current page before proceeding',
      'The exam will auto-submit when time expires',
      'Your answers are saved automatically'
    ]
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Exam Instructions</h1>
      <p>Please read carefully before starting:</p>
      <ul>
        <li>Duration: {examInstructions.duration}</li>
        <li>Questions: {examInstructions.totalQuestions}</li>
        <li>{examInstructions.navigation}</li>
      </ul>
      
      {examInstructions.rules && (
        <div style={{ marginTop: '20px' }}>
          <h3>Exam Rules:</h3>
          <ul>
            {examInstructions.rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
        </div>
      )}
      
      <button onClick={handleStart} style={{ padding: '10px 20px', cursor: 'pointer', marginRight: '10px' }}>
        Start Exam
      </button>
      
      <button 
        onClick={handleStartFresh} 
        style={{ 
          padding: '10px 20px', 
          cursor: 'pointer', 
          backgroundColor: '#dc3545', 
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        Start Fresh Exam
      </button>
    </div>
  );
};

export default InstructionsPage;