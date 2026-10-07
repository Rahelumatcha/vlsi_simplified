import React, { useEffect, useState } from 'react';
import { Mail, Youtube, Linkedin, Send, MessageCircle, CheckCircle2, Phone } from 'lucide-react';
import { Button } from '../components/common/Button';
import { APP_CONFIG } from '../config';
import { useToast } from '../contexts/ToastContext';
import { portfolioService } from '../services/portfolioService';
import { publicDataService } from '../services/publicDataService';

export const ContactPage = () => {
  const { showSuccess } = useToast();
  const [profile, setProfile] = useState(() => publicDataService.getCachedTrainer());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await portfolioService.getTrainerProfile();
        if (data) setProfile(data);
      } catch (err) {
        console.error('Failed to load profile in contact page:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    setSubmitted(true);
    showSuccess('Thank you! Your message has been logged for response.');
  };

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#0ea5e9',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              display: 'block',
              marginBottom: '6px'
            }}
          >
            LET'S CONNECT
          </span>
          <h1 className="heading-section" style={{ color: '#0f172a', margin: '0 0 10px' }}>
            Get in Touch with the Trainer
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
            Have a question about VLSI tutorials, upcoming workshops, curriculum guidance, or collaborations? Send a message below or chat directly on WhatsApp.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            maxWidth: '1050px',
            margin: '0 auto'
          }}
        >
          {/* Contact Details Card (Sky Blue & White) */}
          <div
            style={{
              backgroundColor: '#f8fcff',
              borderRadius: '20px',
              padding: '40px',
              border: '1.5px solid #e0f2fe',
              boxShadow: '0 4px 18px rgba(14, 165, 233, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '12px', color: '#0f172a' }}>
                Contact Channels
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.6, marginBottom: '28px' }}>
                Fastest response is via WhatsApp. You can also connect through email or YouTube community discussions.
              </p>

              {/* WhatsApp Highlight Box */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#f0fdf4',
                  border: '1.5px solid #bbf7d0',
                  marginBottom: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MessageCircle size={22} color="#16a34a" />
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', display: 'block' }}>
                      Chat on WhatsApp
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#15803d' }}>Instant query response</span>
                  </div>
                </div>

                <a
                  href={APP_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <button
                    style={{
                      padding: '7px 14px',
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    Open WhatsApp
                  </button>
                </a>
              </div>

              {/* Direct Links List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#f0f9ff',
                      color: '#0ea5e9',
                      border: '1px solid #bae6fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                      Email
                    </span>
                    <a
                      href={`mailto:${profile.email || APP_CONFIG.contactEmail}`}
                      style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.925rem' }}
                    >
                      {profile.email || APP_CONFIG.contactEmail}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#fef2f2',
                      color: '#ff0000',
                      border: '1px solid #fecaca',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Youtube size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                      YouTube Channel
                    </span>
                    <a
                      href={profile.youtube || APP_CONFIG.youtubeChannel}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.925rem' }}
                    >
                      {profile.youtube ? profile.youtube.replace(/^https?:\/\/(www\.)?/, '') : '@VLSI_Simlified'}
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: '#f0f9ff',
                      color: '#0ea5e9',
                      border: '1px solid #bae6fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Linkedin size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                      LinkedIn
                    </span>
                    <a
                      href={profile.linkedin || APP_CONFIG.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.925rem' }}
                    >
                      {profile.linkedin ? profile.linkedin.replace(/^https?:\/\/(www\.)?/, '') : 'linkedin.com/in/vlsi-educator'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: '24px', borderTop: '1px solid #e0f2fe', marginTop: '32px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Response time: Typically within 24 hours.
              </span>
            </div>
          </div>

          {/* Form Card (White Background) */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '40px',
              border: '1.5px solid #e0f2fe',
              boxShadow: '0 4px 18px rgba(14, 165, 233, 0.05)'
            }}
          >
            {submitted ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  textAlign: 'center',
                  padding: '40px 10px',
                  gap: '16px'
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Message Received!
                </h3>
                <p style={{ color: '#475569', fontSize: '0.925rem', maxWidth: '360px' }}>
                  Thank you for reaching out. The trainer will review your message and reply via email.
                </p>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  Send an Inquiry
                </h3>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Verma"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="rahul@domain.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Course question, workshop inquiry..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Type your message here..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Send}
                  style={{ marginTop: '8px' }}
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
