import React from 'react';
import { Youtube, FileText, ExternalLink, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG } from '../../config';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

export const ClassCard = ({
  id,
  classNumber,
  title,
  description,
  thumbnailUrl,
  youtubeUrl,
  notesUrl,
  level = 'Beginner',
  isCompleted = false,
  onToggleComplete
}) => {
  const formattedClassNumber = typeof classNumber === 'number'
    ? `CLASS ${String(classNumber).padStart(2, '0')}`
    : `CLASS ${classNumber}`;

  // Check if valid YouTube URL is present
  const hasYouTubeUrl = Boolean(youtubeUrl && youtubeUrl.trim());
  const hasNotesUrl = Boolean(notesUrl && notesUrl.trim());

  // Use class thumbnailUrl from Google Sheets (or default local/Unsplash fallback).
  // Never automatically load YouTube video players or YouTube network thumbnails.
  const resolvedThumbnail = (thumbnailUrl && thumbnailUrl.trim())
    ? normalizeImageUrl(thumbnailUrl)
    : APP_CONFIG.assets.defaultSubjectThumbnail;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: `1.5px solid ${isCompleted ? '#bae6fd' : '#e0f2fe'}`,
        boxShadow: '0 2px 10px rgba(14, 165, 233, 0.05)',
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        gap: '24px',
        width: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
      }}
      className="class-card-horizontal modern-card"
    >
      {/* LEFT: Compact Horizontal Thumbnail (180–220px) - Pure Image, NEVER an iframe/embed */}
      <div
        style={{
          position: 'relative',
          width: '210px',
          height: '125px',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#f0f9ff',
          flexShrink: 0
        }}
        className="card-thumb-container"
      >
        <img
          src={resolvedThumbnail}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          className="card-thumb-img"
          onError={(e) => {
            e.target.src = APP_CONFIG.assets.defaultSubjectThumbnail;
          }}
        />

        {/* Hover play icon overlay linking to YouTube ONLY if youtubeUrl is present */}
        {hasYouTubeUrl && (
          <a
            href={youtubeUrl.trim()}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.2s ease',
              textDecoration: 'none'
            }}
            className="card-thumb-overlay"
            title="Watch on YouTube (Opens in new browser tab)"
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#ff0000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 16px rgba(255, 0, 0, 0.5)'
              }}
            >
              <Youtube size={22} />
            </div>
          </a>
        )}
      </div>

      {/* CENTER: Metadata, Class number, Level, Title, Description */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            style={{
              backgroundColor: '#f0f9ff',
              color: '#0284c7',
              border: '1px solid #bae6fd',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.725rem',
              fontWeight: '700',
              letterSpacing: '0.04em'
            }}
          >
            {formattedClassNumber}
          </span>

          <span
            style={{
              backgroundColor: '#f8fcff',
              color: '#64748b',
              border: '1px solid #e2e8f0',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.725rem',
              fontWeight: '600'
            }}
          >
            {level || 'Beginner'}
          </span>

          {isCompleted && (
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#059669',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.725rem',
                fontWeight: '700'
              }}
            >
              Completed
            </span>
          )}
        </div>

        <h4
          style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: '2px 0 0',
            lineHeight: 1.35
          }}
        >
          {title}
        </h4>

        <p
          style={{
            fontSize: '0.85rem',
            lineHeight: 1.55,
            color: '#475569',
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {description}
        </p>
      </div>

      {/* RIGHT: Action Controls (Watch on YouTube, Notes, Mark Done) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: '10px',
          flexShrink: 0,
          width: '210px'
        }}
        className="card-actions-col"
      >
        <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          {/* Watch on YouTube button (Opens stored youtubeUrl in a new browser tab; NEVER embedded) */}
          {hasYouTubeUrl ? (
            <a
              href={youtubeUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: '#ff0000',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(255, 0, 0, 0.2)',
                transition: 'background-color 0.2s, transform 0.15s',
                flex: '1 1 auto'
              }}
              className="yt-play-btn"
              title="Watch on YouTube (Opens in new browser tab)"
            >
              <Youtube size={15} />
              <span>Watch on YouTube</span>
              <ExternalLink size={12} style={{ opacity: 0.8 }} />
            </a>
          ) : (
            /* If youtubeUrl is missing, show "Video coming soon" */
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                backgroundColor: '#f1f5f9',
                color: '#94a3b8',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '600',
                border: '1px dashed #cbd5e1',
                flex: '1 1 auto',
                cursor: 'default'
              }}
              title="Video link will be updated soon"
            >
              <Youtube size={14} style={{ opacity: 0.5 }} />
              <span>Video coming soon</span>
            </span>
          )}

          {/* Notes button */}
          {hasNotesUrl ? (
            <a
              href={notesUrl.trim()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '8px 12px',
                backgroundColor: '#f0f9ff',
                color: '#0369a1',
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'background-color 0.2s'
              }}
              className="notes-doc-btn"
              title="Open Lecture Notes in Google Drive (Opens in new tab)"
            >
              <FileText size={14} />
              <span>Notes</span>
              <ExternalLink size={11} style={{ opacity: 0.7 }} />
            </a>
          ) : (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '8px 10px',
                backgroundColor: '#f8fcff',
                color: '#94a3b8',
                borderRadius: '8px',
                fontSize: '0.775rem',
                fontWeight: '500',
                border: '1px dashed #cbd5e1',
                cursor: 'default'
              }}
              title="Lecture notes will be updated soon"
            >
              <FileText size={13} />
              <span>Notes soon</span>
            </span>
          )}
        </div>

        {/* Mark Done progress toggle */}
        {onToggleComplete && (
          <button
            onClick={() => onToggleComplete(id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: isCompleted ? '#bae6fd' : '#e2e8f0',
              backgroundColor: isCompleted ? '#f0f9ff' : '#ffffff',
              color: isCompleted ? '#0ea5e9' : '#64748b',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <CheckCircle2 size={13} color={isCompleted ? '#0ea5e9' : '#94a3b8'} />
            <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
          </button>
        )}
      </div>

      <style>{`
        .class-card-horizontal:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px -4px rgba(14, 165, 233, 0.12);
          border-color: #38bdf8;
        }
        .class-card-horizontal:hover .card-thumb-overlay {
          opacity: 1;
        }
        .class-card-horizontal:hover .card-thumb-img {
          transform: scale(1.04);
        }
        .yt-play-btn:hover {
          background-color: #e60000;
          transform: translateY(-1px);
        }
        .notes-doc-btn:hover {
          background-color: #e0f2fe;
        }

        @media (max-width: 768px) {
          .class-card-horizontal {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 14px !important;
            gap: 16px !important;
          }
          .card-thumb-container {
            width: 100% !important;
            height: 190px !important;
          }
          .card-actions-col {
            width: 100% !important;
            align-items: stretch !important;
            flex-direction: row !important;
            justifyContent: space-between !important;
          }
        }

        @media (max-width: 520px) {
          .card-thumb-container {
            height: 160px !important;
          }
          .card-actions-col {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .card-actions-col > div {
            justify-content: stretch !important;
            flex-direction: column !important;
          }
          .yt-play-btn, .notes-doc-btn {
            min-height: 42px !important;
            width: 100% !important;
            flex: 1 1 auto !important;
          }
        }
      `}</style>
    </div>
  );
};
