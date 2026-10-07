import React, { useEffect, useState, useMemo } from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import { courseService } from '../services/courseService';
import staticSubjects from '../data/subjects.json';
import staticClasses from '../data/classes.json';
import { SubjectCard } from '../components/courses/SubjectCard';
import { SearchBar } from '../components/common/SearchBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

export const CoursesPage = () => {
  const [subjects, setSubjects] = useState(() => {
    const pubSubjects = (staticSubjects || []).filter((s) => s.published !== false);
    const pubClasses = (staticClasses || []).filter((c) => c.published !== false);
    return courseService.attachDynamicClassCounts(pubSubjects, pubClasses);
  });
  const [classes, setClasses] = useState(() => (staticClasses || []).filter((c) => c.published !== false));
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Keep in sync in background if service cache updates, without showing a blocking spinner
    const refreshData = async () => {
      try {
        const [subjectsData, classesData] = await Promise.all([
          courseService.getSubjects(),
          courseService.getClasses()
        ]);
        const dynamicSubjects = courseService.attachDynamicClassCounts(subjectsData, classesData);
        setSubjects(dynamicSubjects);
        setClasses(classesData);
      } catch (err) {
        console.error('Failed to refresh courses:', err);
      }
    };

    refreshData();
  }, []);

  // Filter subjects based on search input
  const filteredSubjects = useMemo(() => {
    if (!searchTerm.trim()) return subjects;
    const term = searchTerm.toLowerCase();

    return subjects.filter((subject) => {
      const matchName = subject.name?.toLowerCase().includes(term);
      const matchDesc = subject.description?.toLowerCase().includes(term);

      // Also match if any of its classes match the search query!
      const matchClass = classes.some(
        (cls) =>
          String(cls.subjectId) === String(subject.id) &&
          cls.published &&
          (cls.title?.toLowerCase().includes(term) || cls.description?.toLowerCase().includes(term))
      );

      return matchName || matchDesc || matchClass;
    });
  }, [subjects, classes, searchTerm]);

  return (
    <div style={{ padding: '48px 0 80px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <section className="container">
        {/* Header & Search Bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            marginBottom: '16px'
          }}
        >
          <div>
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
              FREE VIDEO CURRICULUM
            </span>
            <h1 className="heading-section" style={{ color: '#071a2b', margin: 0 }}>
              Courses & Subject Specializations
            </h1>
            <p style={{ color: '#53708a', fontSize: '1rem', marginTop: '8px', maxWidth: '680px' }}>
              Explore comprehensive video courses structured sequentially. Each lecture includes direct YouTube access and downloadable lecture notes hosted on Google Drive.
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search subjects or lecture titles..."
              maxWidth="450px"
            />
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>
              Showing {filteredSubjects.length} of {subjects.length} subjects
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <LoadingSpinner message="Loading courses and calculating class statistics..." />
        ) : subjects.length === 0 ? (
          <EmptyState
            title="No courses published yet"
            description="Courses will appear here once published by the trainer."
          />
        ) : filteredSubjects.length === 0 ? (
          <EmptyState
            title="No matching subjects or classes"
            description={`We couldn't find any courses matching "${searchTerm}". Try searching for terms like "Digital", "Verilog", or "UVM".`}
            actionText="Clear Search"
            onAction={() => setSearchTerm('')}
          />
        ) : (
          <div className="grid-cards">
            {filteredSubjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
