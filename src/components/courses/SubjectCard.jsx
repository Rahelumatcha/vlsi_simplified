import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Layers, Youtube } from 'lucide-react';
import { APP_CONFIG } from '../../config';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

export const SubjectCard = ({ subject }) => {
  const navigate = useNavigate();
  const classCount = subject.classCount ?? 0;

  const handleCardClick = () => {
    navigate(`/courses/${subject.slug}`);
  };

  const handleYouTubeClick = (e) => {
    e.stopPropagation(); // Prevents triggering card navigation
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        overflow: 'hidden',
        border: '1.5px solid #e0f2fe',
        boxShadow: '0 4px 14px rgba(14, 165, 233, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease'
      }}
      className="subject-card modern-card"
      title={`Click to explore ${subject.name} classes`}
    >
      {/* Thumbnail with Dynamic Class Count Badge */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '190px',
          overflow: 'hidden',
          backgroundColor: '#f0f9ff'
        }}
      >
        <img
          src={normalizeImageUrl(subject.thumbnailUrl) || APP_CONFIG.assets.defaultSubjectThumbnail}
          alt={subject.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          className="subject-img"
          onError={(e) => {
            e.target.src = APP_CONFIG.assets.defaultSubjectThumbnail;
          }}
        />

        {/* Dynamic Class Count Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            zIndex: 2,
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '0.03em',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {classCount} {classCount === 1 ? 'Class' : 'Classes'}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
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
              borderRadius: '5px',
              border: '1px solid #bae6fd'
            }}
          >
            VLSI Curriculum
          </span>

          <span
            style={{
              fontSize: '0.775rem',
              color: '#64748b',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Layers size={13} color="#0ea5e9" />
            <span>{classCount} Lectures</span>
          </span>
        </div>

        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0f172a',
            marginBottom: '10px',
            lineHeight: 1.3
          }}
        >
          {subject.name}
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            lineHeight: 1.6,
            color: '#475569',
            marginBottom: '24px',
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {subject.description}
        </p>

        {/* Card Footer: [Watch on YouTube (Red)] + [Explore Course →] */}
        <div
          style={{
            paddingTop: '16px',
            borderTop: '1px solid #f0f9ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap'
          }}
        >
          {/* Red YouTube Button (Opens YouTube in new tab, does not open course page) */}
          <a
            href={subject.youtubePlaylistUrl || APP_CONFIG.youtubeChannel}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleYouTubeClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              backgroundColor: '#ff0000',
              color: '#ffffff',
              borderRadius: '7px',
              fontSize: '0.775rem',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(255, 0, 0, 0.25)',
              transition: 'background-color 0.15s ease, transform 0.15s ease'
            }}
            className="subject-yt-btn"
            title="Watch subject playlist on YouTube"
          >
            <Youtube size={14} />
            <span>Watch on YouTube</span>
          </a>

          {/* Explore Course Button */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 13px',
              backgroundColor: '#f0f9ff',
              color: '#0284c7',
              border: '1.5px solid #bae6fd',
              borderRadius: '7px',
              fontSize: '0.8rem',
              fontWeight: '700',
              transition: 'all 0.15s ease'
            }}
            className="subject-explore-btn"
          >
            <span>Explore</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </div>

      <style>{`
        .subject-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(14, 165, 233, 0.14) !important;
          border-color: #38bdf8 !important;
        }
        .subject-card:hover .subject-img {
          transform: scale(1.05);
        }
        .subject-card:hover .subject-explore-btn {
          background-color: #0ea5e9;
          color: #ffffff;
          border-color: #0ea5e9;
        }
        .subject-yt-btn:hover {
          background-color: #dc2626 !important;
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
};
