import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, Clock, AlertTriangle, RefreshCw, Globe, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { PublishModal } from './PublishModal';
import { useToast } from '../../contexts/ToastContext';
import { publishService } from '../../services/publishService';

function formatDate(isoString) {
  if (!isoString) return 'Never';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Never';
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return 'Never';
  }
}

export const PublishStatusCard = ({
  statusData,
  onRefresh,
  isLoading
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishState, setPublishState] = useState('idle'); // 'idle' | 'publishing' | 'started' | 'failed'
  const { showSuccess, showError, showInfo } = useToast();

  const {
    lastModifiedAt,
    lastPublishedAt,
    hasPendingChanges
  } = statusData || {};

  const handlePublishConfirm = async () => {
    try {
      setIsPublishing(true);
      setPublishState('publishing');

      const result = await publishService.triggerPublish();

      if (result && result.success) {
        setPublishState('started');
        showSuccess(result.message || 'Publish started successfully. The public website is being updated.');
        setIsModalOpen(false);
        if (onRefresh) {
          setTimeout(onRefresh, 1500);
        }
      } else {
        setPublishState('failed');
        const errMsg = result?.error || 'Publish trigger failed.';
        if (errMsg.includes('Unknown POST action: publish')) {
          showError('Apps Script update required: Please copy the updated backend/Code.gs into Google Apps Script and deploy a New Version.');
        } else {
          showError(errMsg);
        }
      }
    } catch (err) {
      setPublishState('failed');
      const errMsg = err.message || '';
      if (errMsg.includes('Unknown POST action: publish')) {
        showError('Apps Script update required: Please copy the updated backend/Code.gs into Google Apps Script and deploy a New Version.');
      } else {
        showError(errMsg || 'Publish failed. Your saved changes are still safely stored in Google Sheets.');
      }
    } finally {
      setIsPublishing(false);
    }
  };

  // Compute status pill
  let badgeText = '✓ Published';
  let badgeColor = '#059669';
  let badgeBg = 'rgba(16, 185, 129, 0.1)';
  let badgeBorder = 'rgba(16, 185, 129, 0.25)';

  if (publishState === 'publishing') {
    badgeText = '↻ Publishing...';
    badgeColor = '#0284c7';
    badgeBg = 'rgba(14, 165, 233, 0.12)';
    badgeBorder = 'rgba(14, 165, 233, 0.3)';
  } else if (publishState === 'failed') {
    badgeText = '! Publish failed';
    badgeColor = '#e11d48';
    badgeBg = 'rgba(225, 29, 72, 0.1)';
    badgeBorder = 'rgba(225, 29, 72, 0.25)';
  } else if (hasPendingChanges) {
    badgeText = '● Changes pending';
    badgeColor = '#d97706';
    badgeBg = 'rgba(245, 158, 11, 0.12)';
    badgeBorder = 'rgba(245, 158, 11, 0.3)';
  }

  return (
    <>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          border: `1.5px solid ${hasPendingChanges ? '#fed7aa' : '#e0f2fe'}`,
          boxShadow: hasPendingChanges
            ? '0 4px 20px -2px rgba(245, 158, 11, 0.08)'
            : '0 4px 20px -2px rgba(14, 165, 233, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="publish-status-card"
      >
        {/* Subtle decorative background glow */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: hasPendingChanges
              ? 'radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, rgba(251, 146, 60, 0) 70%)'
              : 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Card Header: Title + Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: hasPendingChanges ? '#fff7ed' : '#f0f9ff',
                color: hasPendingChanges ? '#ea580c' : '#0284c7',
                border: `1px solid ${hasPendingChanges ? '#ffedd5' : '#e0f2fe'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Globe size={20} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#071a2b', margin: 0, lineHeight: 1.2 }}>
                Public Website Deployment
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
                Automated Static Sync & Production Delivery
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Status Badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.775rem',
                fontWeight: 700,
                backgroundColor: badgeBg,
                color: badgeColor,
                border: `1px solid ${badgeBorder}`
              }}
            >
              {badgeText}
            </span>

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                title="Refresh deployment status"
                style={{
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} />
              </button>
            )}
          </div>
        </div>

        {/* Card Body: Explanation & Timestamps */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            backgroundColor: '#f8fafc',
            padding: '14px 16px',
            borderRadius: '12px',
            border: '1px solid #f1f5f9'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Last Published
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#071a2b', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#0284c7" />
              <span>{formatDate(lastPublishedAt)}</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending Changes
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: hasPendingChanges ? '#d97706' : '#059669', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {hasPendingChanges ? (
                <>
                  <AlertTriangle size={14} color="#d97706" />
                  <span>Unpublished edits waiting</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} color="#059669" />
                  <span>Everything is published</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls & Description */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <p style={{ fontSize: '0.825rem', color: '#64748b', margin: 0, flex: '1 1 300px', lineHeight: 1.5 }}>
            {hasPendingChanges
              ? 'You have edits saved in Google Sheets. Click "Publish Changes" to sync data and trigger a new production build.'
              : 'All content in Google Sheets is synchronized with the live static student website.'}
          </p>

          <Button
            variant="primary"
            size="md"
            icon={UploadCloud}
            loading={isPublishing}
            disabled={isPublishing}
            onClick={() => setIsModalOpen(true)}
            style={{
              boxShadow: hasPendingChanges
                ? '0 4px 14px rgba(2, 132, 199, 0.35)'
                : '0 2px 8px rgba(2, 132, 199, 0.2)'
            }}
          >
            {isPublishing ? 'Publishing...' : 'Publish Changes'}
          </Button>
        </div>
      </div>

      <PublishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePublishConfirm}
        isPublishing={isPublishing}
      />

      <style>{`
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
