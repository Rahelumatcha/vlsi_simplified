import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers, Search, Video, CheckCircle2, RotateCcw } from 'lucide-react';
import { courseService } from '../services/courseService';
import { publicDataService } from '../services/publicDataService';
import { ClassCard } from '../components/courses/ClassCard';
import { SearchBar } from '../components/common/SearchBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';

export const SubjectClassesPage = () => {
  const { slug } = useParams();

  // Find subject synchronously from cache or static JSON fallback
  const initialSubject = useMemo(() => {
    if (!slug) return null;
    const cleanSlug = String(slug).toLowerCase().trim();
    const allSubjects = publicDataService.getCachedSubjects();
    return (
      allSubjects.find(
        (s) =>
          (s.slug || '').toLowerCase().trim() === cleanSlug ||
          String(s.id).toLowerCase() === cleanSlug ||
          (s.name || '').toLowerCase().replace(/\s+/g, '-').trim() === cleanSlug
      ) || null
    );
  }, [slug]);

  const initialClasses = useMemo(() => {
    if (!initialSubject) return [];
    return publicDataService.getCachedClasses(initialSubject.id);
  }, [initialSubject]);

  const [subject, setSubject] = useState(initialSubject);
  const [classes, setClasses] = useState(initialClasses);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Keep state updated if URL slug changes
  useEffect(() => {
    if (initialSubject) {
      setSubject(initialSubject);
      setClasses(initialClasses);
    }
  }, [initialSubject, initialClasses]);

  // Client-side progress tracking per device (no account or login required!)
  const [completedMap, setCompletedMap] = useState(() => {
    try {
      const stored = localStorage.getItem(`vlsi_progress_${slug}`);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    let isMounted = true;

    const refreshData = async () => {
      try {
        const sub = await courseService.getSubjectBySlug(slug);
        if (!isMounted) return;
        if (sub) {
          setSubject(sub);
          const classList = await courseService.getClasses(sub.id, false);
          if (!isMounted) return;
          setClasses(classList);
        }
      } catch (err) {
        console.error('Failed to load subject classes:', err);
      }
    };

    refreshData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Persist progress to local device storage
  const handleToggleComplete = (classId) => {
    setCompletedMap((prev) => {
      const updated = { ...prev, [classId]: !prev[classId] };
      try {
        localStorage.setItem(`vlsi_progress_${slug}`, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleResetProgress = () => {
    setCompletedMap({});
    try {
      localStorage.removeItem(`vlsi_progress_${slug}`);
    } catch (e) {}
  };

  // Filter classes by search input
  const filteredClasses = useMemo(() => {
    if (!searchTerm.trim()) return classes;
    const term = searchTerm.toLowerCase();
    return classes.filter(
      (c) =>
        c.title?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term) ||
        String(c.classNumber).includes(term)
    );
  }, [classes, searchTerm]);

  if (loading) {
    return <LoadingSpinner message="Loading course curriculum and progress..." />;
  }

  if (!subject) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <EmptyState
          title="Subject not found"
          description="The requested subject curriculum could not be found or has not been published yet."
          actionText="Back to All Courses"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  const totalClasses = classes.length;
  const completedCount = classes.filter((c) => completedMap[c.id]).length;
  const remainingCount = totalClasses - completedCount;
  const progressPercent = totalClasses > 0 ? Math.round((completedCount / totalClasses) * 100) : 0;

  return (
    <div style={{ padding: '40px 0 80px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <section className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '16px' }}>
          <Link
            to="/courses"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#0ea5e9',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Courses</span>
          </Link>
        </div>

        {/* Course Header Banner (All About VLSI inspired, modern Sky Blue + White) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '36px',
            border: '1.5px solid #e0f2fe',
            boxShadow: '0 4px 18px rgba(14, 165, 233, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#0ea5e9',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: '6px'
              }}
            >
              STRUCTURED VLSI CURRICULUM
            </span>
            <h1 className="heading-section" style={{ color: '#0f172a', margin: '0 0 8px' }}>
              {subject.name}
            </h1>
            <p style={{ color: '#475569', fontSize: '1.025rem', lineHeight: 1.6, maxWidth: '800px', margin: 0 }}>
              Learn {subject.name} through structured, bite-sized tutorials directly from the YouTube channel. No account or login required.
            </p>
          </div>

          {/* Clean Progress Area */}
          <div
            style={{
              padding: '18px 24px',
              borderRadius: '14px',
              backgroundColor: '#f8fcff',
              border: '1px solid #e0f2fe',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.875rem', color: '#475569' }}>
                <span><strong>Total Classes:</strong> {totalClasses}</span>
                <span><strong style={{ color: '#10b981' }}>Completed:</strong> {completedCount}</span>
                <span><strong style={{ color: '#0ea5e9' }}>Remaining:</strong> {remainingCount}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0369a1' }}>
                  Progress: {progressPercent}%
                </span>
                {completedCount > 0 && (
                  <button
                    onClick={handleResetProgress}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      color: '#64748b',
                      cursor: 'pointer'
                    }}
                    title="Reset my local progress"
                  >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '8px',
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
        </div>

        {/* Search within this subject */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '8px',
            marginBottom: '8px'
          }}
        >
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={`Search ${subject.name} classes...`}
            maxWidth="400px"
          />
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
            Showing {filteredClasses.length} of {classes.length} classes
          </div>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <EmptyState
            icon={Video}
            title={classes.length === 0 ? 'No classes published yet' : 'No matching classes found'}
            description={
              classes.length === 0
                ? 'The trainer has not published any lectures for this subject yet. Please check back soon!'
                : `No classes match "${searchTerm}". Try a different search term.`
            }
            actionText={searchTerm ? 'Clear Search' : undefined}
            onAction={searchTerm ? () => setSearchTerm('') : undefined}
          />
        ) : (
          <div className="classes-vertical-stack">
            {filteredClasses.map((cls) => (
              <ClassCard
                key={cls.id}
                id={cls.id}
                classNumber={cls.classNumber}
                title={cls.title}
                description={cls.description}
                thumbnailUrl={cls.thumbnailUrl}
                youtubeUrl={cls.youtubeUrl}
                notesUrl={cls.notesUrl}
                isCompleted={Boolean(completedMap[cls.id])}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
