import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

export const ThumbnailPreview = ({ url, label = 'Thumbnail Preview' }) => {
  const [loadError, setLoadError] = useState(false);

  // Normalize Google Drive links, YouTube links, and relative paths
  const normalizedUrl = normalizeImageUrl(url);

  // Reset load error state whenever the URL input prop changes
  useEffect(() => {
    setLoadError(false);
  }, [url]);

  if (!url || !url.trim()) {
    return (
      <div style={{ marginTop: '8px' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>
          {label}
        </span>
        <div
          style={{
            width: '100%',
            height: '110px',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            border: '1.5px dashed #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: '#94a3b8'
          }}
        >
          <ImageIcon size={22} />
          <span style={{ fontSize: '0.75rem' }}>No image URL entered (default fallback will be used)</span>
        </div>
      </div>
    );
  }

  const isGoogleDriveOriginal = url.includes('drive.google.com') && !url.includes('thumbnail');

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>
          {label}
        </span>
        {isGoogleDriveOriginal && (
          <span
            style={{
              fontSize: '0.675rem',
              color: '#0284c7',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 600
            }}
          >
            Google Drive link auto-formatted for display
          </span>
        )}
      </div>

      <div
        style={{
          width: '100%',
          height: '130px',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#071a2b',
          border: `1.5px solid ${loadError ? '#fca5a5' : '#e2e8f0'}`,
          position: 'relative'
        }}
      >
        {loadError ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              padding: '12px',
              textAlign: 'center'
            }}
          >
            <AlertCircle size={20} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              Unable to load image. Verify the URL is valid and publicly accessible.
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b', lineHeight: 1.4 }}>
              If using Google Drive, make sure file sharing is set to "Anyone with the link". Direct images usually end in .png, .jpg, or come from Unsplash / Imgur.
            </span>
          </div>
        ) : (
          <img
            key={normalizedUrl}
            src={normalizedUrl}
            alt="Preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setLoadError(true)}
            onLoad={() => setLoadError(false)}
          />
        )}
      </div>
    </div>
  );
};
