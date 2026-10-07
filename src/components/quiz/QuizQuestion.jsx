import React from 'react';

export const QuizQuestion = ({
  question,
  currentIndex,
  totalQuestions,
  selectedAnswer,
  onSelectOption
}) => {
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Question Header */}
      <div>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: '700',
            color: '#0ea5e9',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'block',
            marginBottom: '8px'
          }}
        >
          Question {currentIndex + 1} of {totalQuestions}
        </span>
        <h3
          style={{
            fontSize: '1.35rem',
            fontWeight: '700',
            color: '#0f172a',
            lineHeight: 1.45
          }}
        >
          {question.question}
        </h3>
      </div>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {question.options.map((optionText, idx) => {
          const letter = optionLetters[idx];
          const isSelected = selectedAnswer === letter;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectOption(letter)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                borderRadius: '12px',
                backgroundColor: isSelected ? 'rgba(14, 165, 233, 0.08)' : '#ffffff',
                border: `2px solid ${isSelected ? '#0ea5e9' : '#e2e8f0'}`,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 4px 12px rgba(14, 165, 233, 0.15)' : '0 2px 4px rgba(7, 26, 43, 0.02)'
              }}
              className="quiz-option-btn"
            >
              {/* Option Letter Badge */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? '#0ea5e9' : '#f1f5f9',
                  color: isSelected ? '#ffffff' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}
              >
                {letter}
              </div>

              {/* Option Text */}
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: isSelected ? '600' : '500',
                  color: isSelected ? '#071a2b' : '#334155',
                  lineHeight: 1.4,
                  flex: 1
                }}
              >
                {optionText}
              </span>
            </button>
          );
        })}
      </div>

      <style>{`
        .quiz-option-btn:hover {
          border-color: #0ea5e9;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
};
