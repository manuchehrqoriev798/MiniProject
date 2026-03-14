import React from 'react';

export default function QuestionCard({ question = {}, index = 0, selected, onSelect }) {
  // Support both backend field names (questionText/choices) and legacy (text/options)
  const displayText = question.questionText || question.text || '';
  const displayOptions = (question.choices && question.choices.length > 0) ? question.choices : (question.options || []);

  return (
    <div style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, color: '#0d1b2a' }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Question {index + 1}</div>
      <div style={{ marginBottom: 12 }}>{displayText}</div>
      <div>
        {displayOptions.map((opt, i) => (
          <label key={i} style={{ display: 'block', padding: 12, borderRadius: 8, cursor: 'pointer', background: selected === i ? '#e6f7ff' : 'transparent', marginBottom: 8 }}>
            <input type="radio" name={`q-${index}`} checked={selected === i} onChange={() => onSelect(i)} style={{ marginRight: 12 }} />
            {String.fromCharCode(65 + i)}. {opt}
          </label>
        ))}
      </div>
    </div>
  );
}
