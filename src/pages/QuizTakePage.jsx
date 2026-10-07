import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, RotateCcw, AlertTriangle } from 'lucide-react';
import { quizService } from '../services/quizService';
import staticQuizzes from '../data/quizzes.json';
import { QuizQuestion } from '../components/quiz/QuizQuestion';
import { QuizTimer } from '../components/quiz/QuizTimer';
import { QuizResult } from '../components/quiz/QuizResult';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

export const QuizTakePage = () => {
  const { id } = useParams();

  const initialQuiz = React.useMemo(() => {
    if (!id) return null;
    const found = (staticQuizzes || []).find((q) => String(q.id) === String(id));
    if (found && Array.isArray(found.questions) && found.questions.length > 0) {
      return { quiz: found, questions: found.questions };
    }
    return null;
  }, [id]);

  const [quizData, setQuizData] = useState(initialQuiz);
  const [loading, setLoading] = useState(!initialQuiz);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evalResult, setEvalResult] = useState(null);

  useEffect(() => {
    if (initialQuiz) {
      setQuizData(initialQuiz);
      setLoading(false);
      return;
    }

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await quizService.getQuizById(id);
        setQuizData(data);
      } catch (err) {
        console.error('Failed to load quiz details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, initialQuiz]);

  if (loading) {
    return <LoadingSpinner message="Preparing quiz questions..." />;
  }

  if (!quizData || !quizData.quiz) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <EmptyState
          title="Quiz Not Found"
          description="The requested quiz could not be located or has been unpublished."
          actionText="Back to Quizzes"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const { quiz, questions = [] } = quizData;

  if (questions.length === 0) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <EmptyState
          title="No Questions Available"
          description="This quiz currently does not contain any questions. Please check back later!"
          actionText="Back to Quizzes"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  const handleSelectOption = (letter) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: letter
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const result = quizService.evaluateQuiz(questions, userAnswers);
    setEvalResult(result);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetry = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setEvalResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If already submitted, display comprehensive result screen
  if (isSubmitted && evalResult) {
    return (
      <div className="container-narrow" style={{ padding: '40px 0 80px' }}>
        <QuizResult
          result={evalResult}
          quizTitle={quiz.title}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const answeredCount = Object.keys(userAnswers).length;
  const isAllAnswered = answeredCount === questions.length;

  return (
    <div className="container-narrow" style={{ padding: '40px 0 80px' }}>
      {/* Top Navigation & Timer Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <Link
          to="/quiz"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#64748b',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} />
          <span>Exit Quiz</span>
        </Link>

        {quiz.timeLimit && (
          <QuizTimer totalMinutes={quiz.timeLimit} onTimeUp={handleSubmit} />
        )}
      </div>

      {/* Main Question Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '36px',
          border: '1px solid #e1effa',
          boxShadow: '0 8px 24px rgba(7, 26, 43, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px'
        }}
      >
        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{progressPercent}% Completed</span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#e2e8f0',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: '#0ea5e9',
                borderRadius: '9999px',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* Current Question Player */}
        <QuizQuestion
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          selectedAnswer={userAnswers[currentQuestion.id]}
          onSelectOption={handleSelectOption}
        />

        {/* Controls: Prev, Next, Submit */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '20px',
            borderTop: '1px solid #f1f5f9',
            marginTop: '8px'
          }}
        >
          <Button
            variant="ghost"
            icon={ArrowLeft}
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>

          <div style={{ display: 'flex', gap: '12px' }}>
            {currentIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                icon={ArrowRight}
                iconPosition="right"
                onClick={handleNext}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="primary"
                icon={Check}
                iconPosition="right"
                onClick={handleSubmit}
                style={{ backgroundColor: '#10b981' }}
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
