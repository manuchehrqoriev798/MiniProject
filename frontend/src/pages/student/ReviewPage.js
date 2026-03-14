import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiContext } from '../../contexts/ApiContext';

export default function ReviewPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadTime, setDownloadTime] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { results, submitExam } = useApiContext();

  // Helper function for safe JSON parsing
  const safeJsonParse = (str, defaultValue = {}) => {
    try {
      return JSON.parse(str || '{}');
    } catch (error) {
      console.error('JSON parsing error:', error);
      return defaultValue;
    }
  };

  // Check if exam has been submitted by looking for results or submission completion time
  const hasSubmitted = results || sessionStorage.getItem('reviewCompletedTime');
  
  // Helper function for HTML escaping to prevent XSS
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Only retrieve exam data if exam has been submitted
  const examAnswers = hasSubmitted ? safeJsonParse(sessionStorage.getItem('examAnswers')) : {};
  const submissionTime = hasSubmitted ? sessionStorage.getItem('examSubmissionTime') : null;
  const examStartTime = hasSubmitted ? sessionStorage.getItem('examStartTime') : null;

  const handleDownloadReport = () => {
    setIsGenerating(true);
    const clickTime = Date.now();

    // Simulate report generation delay
    setTimeout(() => {
      const generationTime = Date.now() - clickTime;
      setDownloadTime(generationTime);

      // Create report content with sanitized data
      const sanitizedAnswers = Object.entries(examAnswers)
        .map(([qId, answerIdx]) => {
          const questionId = escapeHtml(qId);
          const optionLetter = String.fromCharCode(65 + parseInt(answerIdx));
          return `Q${questionId}: Option ${optionLetter}`;
        })
        .join('\n');

      const reportContent = `
EXAM REPORT
====================
Submission Time: ${escapeHtml(submissionTime || 'Unknown')}
Generated: ${new Date().toLocaleString()}

ANSWERS SUBMITTED:
${sanitizedAnswers}

Total Questions Answered: ${Object.keys(examAnswers).length}
Report Generated Time: ${generationTime}ms
      `.trim();

      // Create downloadable file with proper cleanup
      const element = document.createElement('a');
      const file = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(file);
      
      try {
        element.href = url;
        element.download = `exam-report-${new Date().getTime()}.txt`;
        document.body.appendChild(element);
        element.click();
      } finally {
        // Cleanup resources
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }

      setIsGenerating(false);
    }, 500); // 500ms simulated generation time
  };

  const handleConfirmSubmission = async () => {
    setIsSubmitting(true);
    try {
      // Only submit if we haven't already submitted (check if results exist)
      if (!results) {
        const timeSpent = examStartTime && submissionTime ? 
          Math.floor((new Date(submissionTime).getTime() - new Date(examStartTime).getTime()) / 1000) : 
          0;
        
        try {
          await submitExam(examAnswers, timeSpent);
        } catch (apiError) {
          console.log('API submission failed in review, continuing with sessionStorage:', apiError.message);
        }
      }
      
      sessionStorage.setItem('reviewCompletedTime', new Date().toISOString());
      // After submission, user stays on the same page which now shows results and report
      // The page will re-render with the results data
    } catch (err) {
      console.error('Submission failed:', err);
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate('/exam');
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #0a1f44, #1b3b70, #2c5590)',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '20px',
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '700px',
    padding: '40px',
    borderRadius: '20px',
    background: 'rgba(29, 53, 87, 0.95)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    color: '#fff',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '30px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const confirmButtonStyle = {
    padding: '12px 30px',
    borderRadius: '8px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    opacity: isSubmitting ? 0.6 : 1,
  };

  const backButtonStyle = {
    padding: '12px 30px',
    borderRadius: '8px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {!hasSubmitted ? (
          // Pre-submission state: Show submission confirmation
          <>
            <h1 style={{ marginTop: 0, textAlign: 'center' }}>Submit Exam</h1>
            
            <div style={{ marginBottom: '30px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <p style={{ fontSize: '16px', marginBottom: '15px', textAlign: 'center' }}>
                Are you ready to submit your exam? You have answered <strong>{Object.keys(safeJsonParse(sessionStorage.getItem('examAnswers'))).length}</strong> questions.
              </p>
              <p style={{ fontSize: '14px', color: '#ccc', textAlign: 'center' }}>
                Once submitted, you will not be able to change your answers.
              </p>
            </div>

            <div style={buttonContainerStyle}>
              <button 
                onClick={handleGoBack}
                style={backButtonStyle}
              >
                Back to Exam
              </button>
              
              <button 
                onClick={handleConfirmSubmission}
                disabled={isSubmitting}
                style={confirmButtonStyle}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            </div>
          </>
        ) : (
          // Post-submission state: Show results and report
          <>
            <h1 style={{ marginTop: 0, textAlign: 'center' }}>Exam Results</h1>

            {results ? (
              <div style={{ textAlign: 'center', padding: '30px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '24px' }}>
                <div style={{ fontSize: '64px', fontWeight: 'bold', color: results.score_percentage >= 50 ? '#28a745' : '#dc3545' }}>
                  {results.score_percentage}%
                </div>
                <div style={{ fontSize: '20px', marginTop: '8px' }}>
                  {results.correct_answers} / {results.total_questions} correct
                </div>
                <div style={{ fontSize: '14px', color: '#ccc', marginTop: '8px' }}>
                  {results.score_percentage >= 50 ? '✓ Passed' : '✗ Not passed'}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '20px', fontSize: '14px', color: '#ccc' }}>
                <p><strong>Submission Time:</strong> {new Date(submissionTime).toLocaleString()}</p>
                <p><strong>Total Questions Answered:</strong> {Object.keys(examAnswers).length}</p>
              </div>
            )}

            {downloadTime !== null && (
              <div style={{ marginBottom: '20px', padding: '15px', background: '#28a745', borderRadius: '8px', fontSize: '14px' }}>
                ✓ Report downloaded successfully in <strong>{downloadTime}ms</strong>
              </div>
            )}

            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <button 
                onClick={handleDownloadReport}
                disabled={isGenerating}
                style={{
                  padding: '10px 20px',
                  backgroundColor: isGenerating ? '#999' : '#4cafee',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  marginRight: '10px'
                }}
              >
                {isGenerating ? 'Generating...' : 'Download Report'}
              </button>
            </div>

            <div style={{ 
              padding: '20px', 
              background: 'rgba(255,255,255,0.05)', 
              borderRadius: '8px', 
              maxHeight: '400px', 
              overflowY: 'auto',
              marginBottom: '30px'
            }}>
              <h3 style={{ marginTop: 0 }}>Your Answers</h3>
              {Object.keys(examAnswers).length > 0 ? (
                <div>
                  {Object.entries(examAnswers).map(([qId, answerIdx]) => (
                    <div 
                      key={qId} 
                      style={{
                        padding: '12px',
                        marginBottom: '10px',
                        background: 'rgba(76, 175, 238, 0.1)',
                        borderLeft: '4px solid #4cafee',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    >
                      <strong>Question {qId}:</strong> Option {String.fromCharCode(65 + answerIdx)}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#ccc' }}>No answers submitted.</p>
              )}
            </div>

            <div style={buttonContainerStyle}>
              <button 
                onClick={() => navigate('/instructions')}
                style={{
                  ...backButtonStyle,
                  backgroundColor: '#17a2b8'
                }}
              >
                Start New Exam
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
