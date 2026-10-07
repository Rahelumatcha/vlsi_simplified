import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, HelpCircle, BookOpen, Award, Cpu } from 'lucide-react';
import { Button } from '../common/Button';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

export const SubjectQuizCard = ({ subject, onExplore }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const quizCount = subject.totalQuizCount ?? subject.quizCount ?? subject.quizzes?.length ?? 0;
  const beginnerCount = subject.beginnerCount ?? 0;
  const intermediateCount = subject.intermediateCount ?? 0;
  const advancedCount = subject.advancedCount ?? 0;

  const handleCardClick = () => {
    if (onExplore) {
      onExplore(subject);
    } else {
      navigate(`/quizzes?subject=${subject.slug || subject.id}`);
    }
  };

  const resolvedThumb = !imgError && subject.thumbnailUrl ? normalizeImageUrl(subject.thumbnailUrl) : null;

  return (
    <div
      onClick={handleCardClick}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1.5px solid #e0f2fe',
        boxShadow: '0 8px 24px rgba(7, 26, 43, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease'
      }}
      className="subject-quiz-card modern-card"
      title={`Explore quizzes for ${subject.name}`}
    >
      {/* Prominent Subject Image at the Top */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '180px',
          overflow: 'hidden',
          backgroundColor: '#0284c7'
        }}
      >
        {resolvedThumb ? (
          <img
            src={resolvedThumb}
            alt={subject.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.35s ease'
            }}
            className="subject-img"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Clean, Theme-Aligned Fallback Visual */
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 60%, #38bdf8 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '20px',
              textAlign: 'center',
              color: '#ffffff'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255, 255, 255, 0.35)'
              }}
            >
              <Cpu size={24} color="#ffffff" />
            </div>
            <span
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {subject.name}
            </span>
          </div>
        )}

        {/* Dynamic Quiz Count Badge on top of image */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            zIndex: 2,
            backgroundColor: 'rgba(7, 26, 43, 0.88)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '0.775rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <HelpCircle size={13} color="#38bdf8" />
          <span>{quizCount} {quizCount === 1 ? 'Quiz' : 'Quizzes'}</span>
        </div>
      </div>

      {/* White Card Body */}
      <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Subject Track Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '0.725rem',
              fontWeight: 700,
              color: '#0284c7',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backgroundColor: '#f0f9ff',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid #bae6fd',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <BookOpen size={11} color="#0284c7" />
            <span>Subject Track</span>
          </span>
        </div>

        {/* Subject Title */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0 0 10px 0',
            lineHeight: 1.3
          }}
        >
          {subject.name}
        </h3>

        {/* Optional Brief Description */}
        {subject.description && (
          <p
            style={{
              fontSize: '0.85rem',
              color: '#64748b',
              lineHeight: 1.5,
              margin: '0 0 16px 0',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {subject.description}
          </p>
        )}

        {/* Difficulty Statistics Bar */}
        <div
          style={{
            marginTop: 'auto',
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            marginBottom: '18px'
          }}
        >
          <div
            style={{
              fontSize: '0.775rem',
              fontWeight: 600,
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '6px'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              {beginnerCount} Beginner
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
              {intermediateCount} Intermediate
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              {advancedCount} Advanced
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          size="md"
          icon={ArrowRight}
          iconPosition="right"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
        >
          Explore Quizzes
        </Button>
      </div>
    </div>
  );
};
