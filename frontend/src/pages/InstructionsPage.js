import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function InstructionsPage() {
  const navigate = useNavigate();

  function startExam() {
    const startTime = Date.now();
    sessionStorage.setItem('examStartTime', String(startTime));
    navigate('/exam');
  }

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #0a1f44, #1b3b70, #2c5590)',
    fontFamily: "'Segoe UI', sans-serif",
  };

  const cardStyle = {
    width: '600px',
    padding: '40px',
    borderRadius: '20px',
    background: 'rgba(29, 53, 87, 0.95)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    color: '#fff',
    textAlign: 'left',
  };

  const buttonStyle = {
    padding: '12px 20px',
    fontSize: 16,
    borderRadius: 8,
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#4cafee',
    color: '#fff',
    fontWeight: 'bold',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginTop: 0 }}>Exam Instructions</h1>
        <ul>
          <li>Rules: No cheating. Single window. Follow proctor instructions.</li>
          <li>Format: Multiple choice, 15 questions.</li>
          <li>Timer duration: 20 minutes</li>
          <li>Number of questions: 15</li>
        </ul>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button onClick={startExam} style={buttonStyle}>
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
}
