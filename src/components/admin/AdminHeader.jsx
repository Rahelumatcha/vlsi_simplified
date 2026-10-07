import React, { useState } from 'react';
import { Menu, Shield, ExternalLink, AlertCircle, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isApiConfigured } from '../../config';
import { PublishModal } from './PublishModal';
import { publishService } from '../../services/publishService';
import { useToast } from '../../contexts/ToastContext';

export const AdminHeader = ({ title, subtitle, onToggleSidebar }) => {
  const isOnline = isApiConfigured();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { showSuccess, showError } = useToast();

  const handlePublishConfirm = async () => {
    try {
      setIsPublishing(true);
      const result = await publishService.triggerPublish();
      if (result && result.success) {
        if (result.details?.method === 'standalone') {
          showSuccess('Published! Changes are live on the website via real-time API sync.');
        } else {
          showSuccess(result.message || 'Published! Changes are live on the website.');
        }
        setIsModalOpen(false);
      } else {
        const errMsg = result?.error || 'Publish failed.';
        if (errMsg.includes('Unknown POST action: publish')) {
          showError('Apps Script update required: Please copy the updated backend/Code.gs into Google Apps Script and deploy a New Version.');
        } else {
          showError(errMsg);
        }
      }
    } catch (err) {
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

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e1effa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 900
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            display: 'none'
          }}
          className="admin-hamburger"
          aria-label="Toggle admin sidebar"
        >
          <Menu size={20} color="#071a2b" />
        </button>

        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#071a2b', margin: 0, lineHeight: 1.2 }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Publish Changes Quick Trigger */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={isPublishing}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '8px',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.825rem',
            fontWeight: 700,
            cursor: isPublishing ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)',
            transition: 'background-color 0.2s',
            opacity: isPublishing ? 0.7 : 1
          }}
          title="Publish latest saved changes from Google Sheets to the public website"
        >
          <UploadCloud size={15} />
          <span>{isPublishing ? 'Publishing...' : 'Publish Changes'}</span>
        </button>

        {/* Backend Connectivity Status Indicator */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.12)',
            color: isOnline ? '#059669' : '#d97706',
            border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.3)'}`
          }}
          title={
            isOnline
              ? 'Connected to live Google Apps Script API & Google Sheets'
              : 'Using Development Fallback (Connect VITE_API_BASE_URL to link Google Sheets)'
          }
          className="admin-status-pill"
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isOnline ? '#10b981' : '#f59e0b'
            }}
          />
          <span>{isOnline ? 'Google Sheets Live' : 'Dev Mode'}</span>
        </div>

        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            color: '#071a2b',
            fontSize: '0.825rem',
            fontWeight: 600,
            textDecoration: 'none'
          }}
        >
          <span>Open Site</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      <PublishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePublishConfirm}
        isPublishing={isPublishing}
      />

      <style>{`
        @media (max-width: 900px) {
          .admin-hamburger {
            display: flex !important;
          }
          .admin-status-pill {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
