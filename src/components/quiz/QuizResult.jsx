import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, CheckCircle2, XCircle, RotateCcw, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '../common/Button';

export const QuizResult = ({
  result,
  quizTitle,
  onRetry
}) => {
  const { totalQuestions, correctCount, wrongCount, percentage, passed, breakdown } = result;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade-in">
      {/* Top Banner Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: 'clamp(20px, 4vw, 36px)',
          textAlign: 'center',
          border: '1px solid #e1effa',
          boxShadow: '0 10px 30px rgba(7, 26, 43, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: passed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: passed ? '#10b981' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          <Trophy size={36} />
        </div>

        <span
          style={{
            fontSize: '0.9rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: passed ? '#059669' : '#dc2626',
            marginBottom: '4px'
          }}
        >
          {passed ? 'Quiz Completed — Passed!' : 'Quiz Completed — Keep Practicing!'}
        </span>

        <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          {quizTitle}
        </h2>

        <div style={{ fontSize: 'clamp(2.4rem, 6vw, 3.2rem)', fontWeight: 800, color: '#0ea5e9', margin: '8px 0 4px' }}>
          {percentage}%
        </div>

        <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
          {passed
            ? 'Great job! You have demonstrated a solid grasp of this technical subject.'
            : 'Review the explanations below and give it another try to reinforce your understanding.'}
        </p>

        {/* Stats Row */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(12px, 3vw, 24px)',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            padding: '14px clamp(12px, 3vw, 28px)',
            borderRadius: '12px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            marginBottom: '28px',
            width: '100%',
            maxWidth: '460px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} color="#10b981" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#071a2b' }}>{correctCount}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Correct</div>
            </div>
          </div>

          <div style={{ width: '1px', backgroundColor: '#cbd5e1' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={20} color="#ef4444" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#071a2b' }}>{wrongCount}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Incorrect</div>
            </div>
          </div>

          <div style={{ width: '1px', backgroundColor: '#cbd5e1' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={20} color="#0ea5e9" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#071a2b' }}>{totalQuestions}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="primary" icon={RotateCcw} onClick={onRetry}>
            Retry Quiz
          </Button>
          <Link to="/quizzes">
            <Button variant="outline" icon={ArrowLeft}>
              Back to Quizzes
            </Button>
          </Link>
        </div>
      </div>

      {/* Question by Question Review Breakdown */}
      <div>
        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#071a2b', marginBottom: '18px' }}>
          Detailed Answer Breakdown & Explanations
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {breakdown.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                padding: '22px',
                border: `1.5px solid ${item.isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                boxShadow: '0 2px 8px rgba(7, 26, 43, 0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                {item.isCorrect ? (
                  <CheckCircle2 size={18} color="#10b981" />
                ) : (
                  <XCircle size={18} color="#ef4444" />
                )}
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: item.isCorrect ? '#059669' : '#dc2626'
                  }}
                >
                  Question {idx + 1} {item.isCorrect ? '— Correct' : '— Incorrect'}
                </span>
              </div>

              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#071a2b', marginBottom: '14px', lineHeight: 1.4 }}>
                {item.question}
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: item.isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    border: `1px solid ${item.isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    fontSize: '0.875rem'
                  }}
                >
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Your Answer:</span>
                  <strong style={{ color: item.isCorrect ? '#059669' : '#dc2626' }}>
                    Option {item.selectedAnswer}
                  </strong>
                </div>

                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    fontSize: '0.875rem'
                  }}
                >
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Correct Answer:</span>
                  <strong style={{ color: '#059669' }}>Option {item.correctAnswer}</strong>
                </div>
              </div>

              {/* Technical Explanation */}
              {item.explanation && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    borderLeft: '4px solid #0ea5e9',
                    fontSize: '0.875rem',
                    color: '#334155',
                    lineHeight: 1.55
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#0ea5e9', display: 'block', marginBottom: '4px' }}>
                    Trainer's Explanation:
                  </span>
                  {item.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
