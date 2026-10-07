import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { HelpCircle, Filter, BookOpen, Sparkles, CheckCircle2, Cpu, Youtube, ArrowLeft, ArrowRight } from 'lucide-react';
import { quizService } from '../services/quizService';
import { courseService } from '../services/courseService';
import { publicDataService } from '../services/publicDataService';
import { SubjectQuizCard } from '../components/quiz/SubjectQuizCard';
import { QuizCard } from '../components/quiz/QuizCard';
import { SearchBar } from '../components/common/SearchBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { APP_CONFIG } from '../config';
import { normalizeImageUrl } from '../utils/imageUrlHelper';

export const QuizListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read URL subject parameter (e.g., /quizzes?subject=verilog-hdl)
  const subjectParam = searchParams.get('subject');
  const isSubjectView = Boolean(subjectParam && subjectParam.trim() && subjectParam.toUpperCase() !== 'ALL');

  const [quizzes, setQuizzes] = useState(() => (publicDataService.getCachedQuizzes() || []).filter((q) => q.published !== false));
  const [subjects, setSubjects] = useState(() => (publicDataService.getCachedSubjects() || []).filter((s) => s.published !== false));
  const [loading, setLoading] = useState(false);

  // Search & Filter state
  const [subjectSearch, setSubjectSearch] = useState('');
  const [quizSearch, setQuizSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');

  useEffect(() => {
    const refreshQuizzesData = async () => {
      try {
        const [quizList, subjectList] = await Promise.all([
          quizService.getQuizzes(false), // public published only
          courseService.getSubjects(false)
        ]);
        setQuizzes((quizList || []).filter((q) => q.published !== false));
        setSubjects((subjectList || []).filter((s) => s.published !== false));
      } catch (err) {
        console.error('Failed to refresh quizzes:', err);
      }
    };

    refreshQuizzesData();
  }, []);

  // Compute stats for all published subjects (including 0-quiz subjects)
  const subjectCards = useMemo(() => {
    return quizService.calculateSubjectQuizStats(subjects, quizzes);
  }, [subjects, quizzes]);

  // Find the selected subject when viewing /quizzes?subject=<subjectSlug>
  const currentSubject = useMemo(() => {
    if (!isSubjectView) return null;
    const lower = subjectParam.toLowerCase();
    return (subjects || []).find(
      (s) =>
        s.published !== false &&
        (String(s.slug || '').toLowerCase() === lower ||
         String(s.id).toLowerCase() === lower)
    );
  }, [isSubjectView, subjects, subjectParam]);

  // Orphaned quizzes fallback (if quizzes have an obsolete or general subjectId)
  const orphanedQuizzes = useMemo(() => {
    if (!isSubjectView || subjectParam.toLowerCase() !== 'general') return [];
    return quizService.getOrphanedQuizzes(subjects, quizzes);
  }, [isSubjectView, subjects, quizzes, subjectParam]);

  // Handle clicking a Subject Quiz Card
  const handleSelectSubject = (slugOrId) => {
    setSearchParams({ subject: slugOrId });
    setQuizSearch('');
    setSelectedDifficulty('ALL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle returning to main Subject list
  const handleBackToAllSubjects = () => {
    searchParams.delete('subject');
    setSearchParams(searchParams);
    setQuizSearch('');
    setSelectedDifficulty('ALL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered Subject Cards for Main Listing (/quizzes)
  const filteredSubjectCards = useMemo(() => {
    if (!subjectSearch.trim()) return subjectCards;
    const q = subjectSearch.toLowerCase();
    return subjectCards.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
    );
  }, [subjectCards, subjectSearch]);

  // Filtered individual quizzes for Subject View (/quizzes?subject=<slug>)
  const { currentSubjectQuizzes, filteredQuizzes } = useMemo(() => {
    if (!isSubjectView) return { currentSubjectQuizzes: [], filteredQuizzes: [] };

    let rawQuizzes = [];
    if (currentSubject) {
      rawQuizzes = (quizzes || []).filter(
        (q) => q.published !== false && String(q.subjectId) === String(currentSubject.id)
      );
    } else if (subjectParam.toLowerCase() === 'general') {
      rawQuizzes = orphanedQuizzes;
    }

    const filtered = rawQuizzes.filter((quiz) => {
      const matchSearch =
        !quizSearch.trim() ||
        quiz.title?.toLowerCase().includes(quizSearch.toLowerCase()) ||
        quiz.description?.toLowerCase().includes(quizSearch.toLowerCase());
      const matchDifficulty =
        selectedDifficulty === 'ALL' ||
        quiz.difficulty?.toUpperCase() === selectedDifficulty.toUpperCase();
      return matchSearch && matchDifficulty;
    });

    return { currentSubjectQuizzes: rawQuizzes, filteredQuizzes: filtered };
  }, [isSubjectView, currentSubject, subjectParam, quizzes, orphanedQuizzes, quizSearch, selectedDifficulty]);

  return (
    <div style={{ padding: '48px 0 88px', display: 'flex', flexDirection: 'column', gap: '36px' }}>
      <section className="container">
        {loading ? (
          <LoadingSpinner message="Loading quizzes..." />
        ) : !isSubjectView ? (
          /* ========================================================================= */
          /* VIEW 1: MAIN QUIZ COURSE / SUBJECT LISTING (/quizzes)                    */
          /* ========================================================================= */
          <>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  color: '#0284c7',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  marginBottom: '10px'
                }}
              >
                <Sparkles size={14} color="#0284c7" />
                <span>PRACTICE & ASSESSMENTS</span>
              </div>
              <h1 className="heading-section" style={{ color: '#071a2b', margin: '0 0 8px 0' }}>
                Technical Quizzes by Subject
              </h1>
              <p style={{ color: '#53708a', fontSize: '1.025rem', margin: 0, maxWidth: '720px', lineHeight: 1.6 }}>
                Select a course track below to practice and test your knowledge. Each subject track contains structured topic-wise quizzes with immediate scoring and explanations.
              </p>
            </div>

            {/* Subject Search Toolbar */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '18px 24px',
                border: '1px solid #e0f2fe',
                boxShadow: '0 4px 16px rgba(14, 165, 233, 0.04)',
                marginBottom: '36px'
              }}
            >
              <SearchBar
                value={subjectSearch}
                onChange={setSubjectSearch}
                placeholder="Search subject tracks (e.g. Verilog, UVM, Digital Systems)..."
                maxWidth="480px"
              />
            </div>

            {/* Subject Quiz Cards Grid */}
            {filteredSubjectCards.length === 0 ? (
              <div
                style={{
                  maxWidth: '560px',
                  margin: '32px auto',
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '48px 32px',
                  border: '2px dashed #bae6fd',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <HelpCircle size={32} color="#0ea5e9" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  No Matching Subject Tracks Found
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.925rem', margin: 0 }}>
                  No course tracks matched your search term "{subjectSearch}".
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubjectSearch('')}>
                  Reset Search
                </Button>
              </div>
            ) : (
              <div className="grid-cards">
                {filteredSubjectCards.map((sub) => (
                  <SubjectQuizCard
                    key={sub.id}
                    subject={sub}
                    onExplore={() => handleSelectSubject(sub.slug || sub.id)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          /* ========================================================================= */
          /* VIEW 2: SUBJECT-SPECIFIC QUIZZES (/quizzes?subject=<subjectSlug>)         */
          /* ========================================================================= */
          <>
            {/* Top Navigation: Back to All Subjects */}
            <div style={{ marginBottom: '24px' }}>
              <button
                onClick={handleBackToAllSubjects}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #bae6fd',
                  color: '#0284c7',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(14, 165, 233, 0.08)',
                  transition: 'all 0.2s ease'
                }}
              >
                <ArrowLeft size={16} />
                <span>Back to All Subjects</span>
              </button>
            </div>

            {!currentSubject && orphanedQuizzes.length === 0 ? (
              /* Invalid Subject / Subject Not Found */
              <div
                style={{
                  maxWidth: '580px',
                  margin: '40px auto',
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  padding: '52px 32px',
                  border: '2px dashed #bae6fd',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <HelpCircle size={36} color="#0ea5e9" />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Subject Track Not Found
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0, maxWidth: '420px', lineHeight: 1.5 }}>
                  The subject track "{subjectParam}" could not be located. It may have been renamed or unpublished.
                </p>
                <Button variant="primary" icon={ArrowLeft} onClick={handleBackToAllSubjects}>
                  Explore All Subject Tracks
                </Button>
              </div>
            ) : (
              /* Subject Details & Quizzes */
              (() => {
                const subjectInfo = currentSubject || {
                  id: 'general',
                  name: 'General & Core Topics',
                  slug: 'general',
                  description: 'Fundamental digital logic and verification assessments.'
                };
                const thumbUrl = subjectInfo.thumbnailUrl ? normalizeImageUrl(subjectInfo.thumbnailUrl) : null;
                const totalSubjectQuizzes = currentSubjectQuizzes.length;

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Subject Header Banner */}
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        padding: '28px 32px',
                        border: '1.5px solid #e0f2fe',
                        boxShadow: '0 4px 18px rgba(7, 26, 43, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            backgroundColor: '#0284c7',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
                          }}
                        >
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt={subjectInfo.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Cpu size={28} color="#ffffff" />
                          )}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span
                              style={{
                                fontSize: '0.725rem',
                                fontWeight: 700,
                                color: '#0284c7',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                backgroundColor: '#f0f9ff',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                border: '1px solid #bae6fd'
                              }}
                            >
                              SUBJECT TRACK
                            </span>
                          </div>
                          <h1
                            style={{
                              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                              fontWeight: 800,
                              color: '#071a2b',
                              margin: 0,
                              lineHeight: 1.2
                            }}
                          >
                            {subjectInfo.name}
                          </h1>
                          {subjectInfo.description && (
                            <p style={{ margin: '6px 0 0 0', fontSize: '0.925rem', color: '#64748b', maxWidth: '640px', lineHeight: 1.5 }}>
                              {subjectInfo.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          padding: '8px 16px',
                          borderRadius: '12px',
                          backgroundColor: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          color: '#0284c7',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <HelpCircle size={16} />
                        <span>{totalSubjectQuizzes} {totalSubjectQuizzes === 1 ? 'Quiz' : 'Quizzes'}</span>
                      </div>
                    </div>

                    {/* CONTENT: Zero Quizzes VS Quizzes Grid */}
                    {totalSubjectQuizzes === 0 ? (
                      /* Zero Quizzes: Friendly Coming Soon Card */
                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '20px',
                          padding: '56px 32px',
                          border: '2px dashed #bae6fd',
                          boxShadow: '0 8px 24px rgba(14, 165, 233, 0.05)',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '16px',
                          maxWidth: '640px',
                          margin: '0 auto'
                        }}
                      >
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            backgroundColor: '#f0f9ff',
                            color: '#0ea5e9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1.5px solid #bae6fd'
                          }}
                        >
                          <HelpCircle size={28} />
                        </div>

                        <div>
                          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                            {subjectInfo.name} Quizzes Coming Soon
                          </h2>
                          <p style={{ color: '#64748b', fontSize: '0.975rem', margin: 0, maxWidth: '480px', lineHeight: 1.6 }}>
                            Quizzes for this subject are currently being prepared. Check back soon!
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
                          <Button
                            variant="outline"
                            icon={ArrowLeft}
                            onClick={handleBackToAllSubjects}
                          >
                            Explore Other Subjects
                          </Button>
                          {(publicDataService.getCachedTrainer()?.youtube || APP_CONFIG.youtubeChannel) && (
                            <a
                              href={publicDataService.getCachedTrainer()?.youtube || APP_CONFIG.youtubeChannel}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: 'none' }}
                            >
                              <Button variant="secondary" icon={Youtube}>
                                Watch {subjectInfo.name} Video Classes
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Has Quizzes: Filter Toolbar & Quiz Cards Grid */
                      <>
                        {/* Filter Toolbar for this subject's quizzes */}
                        <div
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '16px',
                            padding: '18px 24px',
                            border: '1px solid #e0f2fe',
                            boxShadow: '0 4px 16px rgba(14, 165, 233, 0.04)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '16px'
                          }}
                        >
                          <SearchBar
                            value={quizSearch}
                            onChange={setQuizSearch}
                            placeholder={`Search ${subjectInfo.name} quizzes...`}
                            maxWidth="400px"
                          />

                          {/* Difficulty Filter Pills */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {['ALL', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                              <button
                                key={diff}
                                onClick={() => setSelectedDifficulty(diff)}
                                style={{
                                  padding: '7px 15px',
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

                        {/* Quizzes List */}
                        {filteredQuizzes.length === 0 ? (
                          <div
                            style={{
                              backgroundColor: '#f8fafc',
                              borderRadius: '16px',
                              padding: '36px 24px',
                              textAlign: 'center',
                              border: '1px solid #e2e8f0',
                              color: '#64748b'
                            }}
                          >
                            <p style={{ fontSize: '0.95rem', margin: '0 0 12px 0' }}>
                              No {selectedDifficulty !== 'ALL' ? selectedDifficulty : ''} quizzes found matching your criteria for {subjectInfo.name}.
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setQuizSearch('');
                                setSelectedDifficulty('ALL');
                              }}
                            >
                              Reset Filters
                            </Button>
                          </div>
                        ) : (
                          <div className="grid-cards">
                            {filteredQuizzes.map((quiz) => (
                              <QuizCard
                                key={quiz.id}
                                quiz={quiz}
                                subjectName={subjectInfo.name}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })()
            )}
          </>
        )}
      </section>
    </div>
  );
};
