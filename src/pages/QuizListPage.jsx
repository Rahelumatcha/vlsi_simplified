import React, { useEffect, useState, useMemo } from 'react';
import { HelpCircle, Filter } from 'lucide-react';
import { quizService } from '../services/quizService';
import { courseService } from '../services/courseService';
import staticQuizzes from '../data/quizzes.json';
import staticSubjects from '../data/subjects.json';
import { QuizCard } from '../components/quiz/QuizCard';
import { SearchBar } from '../components/common/SearchBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

export const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState(() => (staticQuizzes || []).filter((q) => q.published !== false));
  const [subjects, setSubjects] = useState(() => (staticSubjects || []).filter((s) => s.published !== false));
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');

  useEffect(() => {
    const refreshQuizzesData = async () => {
      try {
        const [quizList, subjectList] = await Promise.all([
          quizService.getQuizzes(false), // public published only
          courseService.getSubjects(false)
        ]);
        setQuizzes(quizList);
        setSubjects(subjectList);
      } catch (err) {
        console.error('Failed to refresh quizzes:', err);
      }
    };

    refreshQuizzesData();
  }, []);

  const subjectMap = useMemo(() => {
    const map = {};
    subjects.forEach((s) => {
      map[s.id] = s.name;
    });
    return map;
  }, [subjects]);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      const matchSearch =
        quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDifficulty =
        selectedDifficulty === 'ALL' ||
        quiz.difficulty?.toUpperCase() === selectedDifficulty.toUpperCase();
      return matchSearch && matchDifficulty;
    });
  }, [quizzes, searchTerm, selectedDifficulty]);

  return (
    <div style={{ padding: '48px 0 80px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <section className="container">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0ea5e9',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '6px'
            }}
          >
            PRACTICE & SELF-ASSESSMENT
          </span>
          <h1 className="heading-section" style={{ color: '#071a2b', margin: 0 }}>
            Technical Quizzes & Practice Tests
          </h1>
          <p style={{ color: '#53708a', fontSize: '1rem', marginTop: '8px', maxWidth: '680px' }}>
            Test your conceptual clarity across Boolean Logic, CMOS physics, and SystemVerilog verification. Instant scoring, zero logins required, with complete pedagogical explanations.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search quizzes by title or topic..."
            maxWidth="400px"
          />

          {/* Difficulty pill selectors */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {['ALL', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  border: '1.5px solid',
                  borderColor: selectedDifficulty === diff ? '#0ea5e9' : '#e2e8f0',
                  backgroundColor: selectedDifficulty === diff ? 'rgba(14, 165, 233, 0.12)' : '#ffffff',
                  color: selectedDifficulty === diff ? '#0284c7' : '#64748b',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {diff === 'ALL' ? 'All Difficulties' : diff}
              </button>
            ))}
          </div>
        </div>

        {/* Grid or Empty */}
        {loading ? (
          <LoadingSpinner message="Loading available quizzes..." />
        ) : filteredQuizzes.length === 0 ? (
          <div
            style={{
              maxWidth: '680px',
              margin: '32px auto',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '52px 36px',
              border: '2px dashed #bae6fd',
              boxShadow: '0 8px 24px rgba(14, 165, 233, 0.05)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                backgroundColor: '#f0f9ff',
                color: '#0ea5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                border: '1.5px solid #bae6fd'
              }}
            >
              <HelpCircle size={30} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
              {searchTerm || selectedDifficulty !== 'ALL' ? 'No Matching Quizzes Found' : 'Quizzes Coming Soon'}
            </h3>

            <p style={{ color: '#64748b', fontSize: '0.975rem', lineHeight: 1.6, maxWidth: '500px', marginBottom: '24px' }}>
              {searchTerm || selectedDifficulty !== 'ALL'
                ? 'Try adjusting your search query or selecting "All Difficulties" to find relevant quizzes.'
                : 'Interactive quizzes for Digital Systems, Verilog, and UVM are being prepared by the trainer. Once added in the Admin Panel, they will appear right here!'}
            </p>

            {searchTerm || selectedDifficulty !== 'ALL' ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDifficulty('ALL');
                }}
                style={{
                  padding: '9px 18px',
                  backgroundColor: '#0ea5e9',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}
              >
                Reset Filters
              </button>
            ) : (
              <a href={APP_CONFIG.youtubeChannel} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#0ea5e9',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.875rem'
                  }}
                >
                  Explore YouTube Tutorials
                </button>
              </a>
            )}
          </div>
        ) : (
          <div className="grid-cards">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                subjectName={subjectMap[quiz.subjectId] || 'Technical Systems'}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
