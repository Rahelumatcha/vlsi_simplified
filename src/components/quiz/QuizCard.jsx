import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Clock, BookOpen, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const QuizCard = ({ quiz, subjectName = 'VLSI Curriculum' }) => {
  const getDifficultyVariant = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'primary';
      case 'advanced': return 'warning';
      default: return 'primary';
    }
  };

  const questionCount = quiz.questions?.length ?? quiz.questionCount ?? 0;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        padding: '24px',
        border: '1.5px solid #e0f2fe',
        boxShadow: '0 4px 14px rgba(14, 165, 233, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease'
      }}
      className="quiz-card modern-card"
    >
      {/* Top subtle highlight stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%)'
        }}
      />

      {/* Header Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#0284c7',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            padding: '3px 8px',
            borderRadius: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <BookOpen size={12} color="#0ea5e9" />
          <span>{subjectName}</span>
        </span>

        <Badge variant={getDifficultyVariant(quiz.difficulty)}>
          {quiz.difficulty || 'Intermediate'}
        </Badge>
      </div>

      {/* Quiz Title */}
      <h3
        style={{
          fontSize: '1.2rem',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '8px',
          lineHeight: 1.35
        }}
      >
        {quiz.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.875rem',
          lineHeight: 1.6,
          color: '#475569',
          marginBottom: '20px',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {quiz.description || 'Test your understanding on core design principles, waveforms, and synthesis concepts.'}
      </p>

      {/* Meta indicators */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '12px 14px',
          backgroundColor: '#f8fcff',
          borderRadius: '10px',
          border: '1px solid #e0f2fe',
          marginBottom: '20px',
          fontSize: '0.8rem',
          color: '#334155',
          fontWeight: 600
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <HelpCircle size={14} color="#0ea5e9" />
          <span>{questionCount} Questions</span>
        </div>
        {quiz.timeLimit && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={14} color="#f59e0b" />
            <span>{quiz.timeLimit} Mins</span>
          </div>
        )}
      </div>

      {/* Start Button */}
      <Link
        to={`/quiz/${quiz.id}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '10px 18px',
          backgroundColor: '#0ea5e9',
          color: '#ffffff',
          borderRadius: '10px',
          fontSize: '0.875rem',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(14, 165, 233, 0.25)',
          transition: 'all 0.2s ease'
        }}
        className="start-quiz-btn"
      >
        <span>Start Quiz</span>
        <ArrowRight size={15} />
      </Link>

      <style>{`
        .quiz-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(14, 165, 233, 0.14) !important;
          border-color: #38bdf8 !important;
        }
        .start-quiz-btn:hover {
          background-color: #0284c7;
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
};
