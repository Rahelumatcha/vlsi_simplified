import React from 'react';
import { UploadCloud, AlertCircle, X } from 'lucide-react';
import { Button } from '../common/Button';

export const PublishModal = ({ isOpen, onClose, onConfirm, isPublishing }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 26, 43, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '480px',
          padding: '28px',
          boxShadow: '0 20px 40px -10px rgba(7, 26, 43, 0.25)',
          border: '1px solid #e1effa',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isPublishing}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: isPublishing ? 'not-allowed' : 'pointer',
            padding: '4px'
          }}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <UploadCloud size={24} />
          </div>

          <div>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#071a2b',
                margin: 0,
                lineHeight: 1.3
              }}
            >
              Publish Changes?
            </h3>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#475569',
                margin: '8px 0 0',
                lineHeight: 1.5
              }}
            >
              Your latest Subjects, Classes, Quizzes, and Trainer Profile data stored in Google Sheets will be synced and published to the live student portal.
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '0.8rem',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={16} color="#0284c7" style={{ flexShrink: 0 }} />
          <span>
            {isPublishing
              ? 'Publishing changes and refreshing live caches...'
              : 'Content changes reflect immediately via live API. If cloud deploy hooks are configured, a background build will also be triggered.'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={UploadCloud}
            loading={isPublishing}
            onClick={onConfirm}
          >
            {isPublishing ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>
    </div>
  );
};
