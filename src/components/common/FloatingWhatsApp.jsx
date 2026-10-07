import React from 'react';
import { MessageCircle } from 'lucide-react';
import { APP_CONFIG } from '../../config';

export const FloatingWhatsApp = () => {
  return (
    <a
      href={APP_CONFIG.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      title="Chat with Trainer on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={22} fill="currentColor" strokeWidth={0} />
      <span>Chat on WhatsApp</span>
    </a>
  );
};
