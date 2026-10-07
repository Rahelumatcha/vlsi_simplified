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
  whatsappNumber: 'YOUR_WHATSAPP_NUMBER', // Replace with trainer's phone number e.g. "919876543210"
  get whatsappUrl() {
    return this.whatsappNumber && this.whatsappNumber !== 'YOUR_WHATSAPP_NUMBER'
      ? `https://wa.me/${this.whatsappNumber.replace(/[^0-9]/g, '')}`
      : 'https://wa.me/YOUR_NUMBER';
  },
  contactEmail: 'trainer@vlsisimplified.com',
  linkedinProfile: 'https://linkedin.com/in/vlsi-educator',

  // Placeholder Asset references (Easy to replace later)
  assets: {
    logoPlaceholder: '/logo.png',
    trainerPhoto: '/sanath.png',
    // Public video path: drop your "trainer-intro.mp4" into public/videos/
    heroVideoUrl: '/videos/trainer-intro.mp4',
    heroVideoFallbackUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    heroVideoPoster: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1200&q=80',
    defaultSubjectThumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
  }
};
