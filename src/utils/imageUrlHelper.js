/**
 * ============================================================================
 * imageUrlHelper.js - Smart Image URL Normalizer
 * ============================================================================
 * Converts Google Drive links, YouTube links, and relative image references
 * into direct, embeddable image streams that render reliably in HTML <img> tags.
 * ============================================================================
 */

export const normalizeImageUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const url = rawUrl.trim();

  // 1. Google Drive Sharing URL -> Direct Google Drive Thumbnail / Content URL
  // e.g., https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // or https://drive.google.com/open?id=FILE_ID
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${driveFileMatch[1]}&sz=w1000`;
  }

  const driveIdMatch = url.match(/drive\.google\.com\/(?:open|uc)\?.*id=([a-zA-Z0-9_-]+)/i);
  if (driveIdMatch && driveIdMatch[1]) {
    return `https://drive.google.com/thumbnail?id=${driveIdMatch[1]}&sz=w1000`;
  }

  // 2. Local assets (e.g. 'logo.png' -> '/logo.png', 'sanath.png' -> '/sanath.png')
  if (url === 'logo.png' || url === 'sanath.png' || url.startsWith('assets/')) {
    return `/${url}`;
  }

  return url;
};

/**
 * Extracts YouTube video ID if present
 */
export const extractYouTubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  return match ? match[1] : null;
};
