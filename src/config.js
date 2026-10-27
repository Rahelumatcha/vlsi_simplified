// Application Configuration
// The source of truth for all course, class, quiz, and portfolio data
// is Google Sheets accessed via Google Apps Script serverless API.

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim();

// Helper to determine if a live Google Apps Script endpoint is connected
export const isApiConfigured = () => {
  return (
    Boolean(API_BASE_URL) &&
    API_BASE_URL.startsWith('https://script.google.com') &&
    !API_BASE_URL.includes('YOUR_DEPLOYMENT_ID')
  );
};

// Central configuration for short-lived public browser cache (in milliseconds)
// Keeps the public site fast while refreshing content changes within seconds.
export const PUBLIC_DATA_CACHE_TTL = 60 * 1000; // 60 seconds (configurable)

// Application-wide Brand & Contact Configuration
// Easily replace placeholders here with actual trainer assets
export const APP_CONFIG = {
  appName: 'VLSI Simplified',
  tagline: 'Daily VLSI tutorials, straight from the channel — Verilog, SystemVerilog, UVM, ASIC Design & Verification.',
  youtubeChannel: 'https://www.youtube.com/@VLSI_Simlified',
  whatsappNumber: '918143286575',
  whatsappDisplayNumber: '+91 8143286575',
  get whatsappUrl() {
    return this.whatsappNumber
      ? `https://wa.me/${this.whatsappNumber.replace(/[^0-9]/g, '')}`
      : 'https://wa.me/918143286575';
  },
  contactEmail: 'sanathrtldv@gmail.com',
  gmailComposeUrl: 'https://mail.google.com/mail/?view=cm&fs=1&to=sanathrtldv@gmail.com',
  linkedinProfile: 'https://linkedin.com/in/rtldv/',

  // Placeholder Asset references (Easy to replace later)
  assets: {
    logoPlaceholder: '/logo.png',
    trainerPhoto: '/sanath.png',
    // Background hero video (16:9 ratio) from assets folder
    heroVideoUrl: '/assets/vlsi_vd.mp4',
    heroVideoFallbackUrl: '/vlsi_vd.mp4',
    heroVideoPoster: '', // Removed default image so only video plays on load/refresh
    defaultSubjectThumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  }
};

// EmailJS Configuration for Direct Frontend Delivery
export const EMAILJS_CONFIG = {
  serviceId: (import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_j9mgr66').trim(),
  templateId: (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_uswyqno').trim(),
  publicKey: (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'MKXFPbpt61e-hrlgD').trim()
};
