import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Linkedin, MessageCircle, Mail, Shield, ExternalLink } from 'lucide-react';
import { APP_CONFIG } from '../../config';
import { publicDataService } from '../../services/publicDataService';
import { courseService } from '../../services/courseService';
import { portfolioService } from '../../services/portfolioService';

export const Footer = () => {
  const [publishedSubjects, setPublishedSubjects] = useState(() =>
    (publicDataService.getCachedSubjects() || []).filter((s) => s.published !== false)
  );
  const [trainerProfile, setTrainerProfile] = useState(() =>
    publicDataService.getCachedTrainer() || {}
  );

  useEffect(() => {
    let isMounted = true;
    courseService.getSubjects().then((subs) => {
      if (isMounted && Array.isArray(subs)) {
        setPublishedSubjects(subs.filter((s) => s.published !== false));
      }
    }).catch(() => {});

    portfolioService.getTrainerProfile().then((prof) => {
      if (isMounted && prof) {
        setTrainerProfile(prof);
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, []);
  return (
    <footer
      style={{
        background: 'linear-gradient(145deg, #072540 0%, #03456c 40%, #0284c7 85%, #0369a1 100%)',
        color: '#bae6fd',
        padding: '64px 0 28px',
        marginTop: 'auto',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(56, 189, 248, 0.2)'
      }}
    >
      {/* Semiconductor circuit matrix dot overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none'
        }}
      />

      {/* Ambient luminous glow orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '5%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '10%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '40px',
            marginBottom: '48px'
          }}
        >
          {/* Col 1: Brand & Positioning */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '9px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '1.5px solid rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                  flexShrink: 0
                }}
              >
                <img
                  src={APP_CONFIG.assets.logoPlaceholder}
                  alt="VLSI Simplified Logo"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                VLSI <span style={{ color: '#38bdf8' }}>Simplified</span>
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: '#bae6fd', marginBottom: '22px' }}>
              Making complex silicon design intuitive, structured, and accessible. High-impact video lessons covering Verilog, SystemVerilog, UVM, and ASIC verification flows.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={trainerProfile.youtube || APP_CONFIG.youtubeChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn youtube"
                title="YouTube Channel"
              >
                <Youtube size={18} />
              </a>

              <a
                href={trainerProfile.linkedin || APP_CONFIG.linkedinProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn linkedin"
                title="LinkedIn Profile"
              >
                <Linkedin size={18} />
              </a>

              <a
                href={APP_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn whatsapp"
                title="Chat on WhatsApp"
              >
                <MessageCircle size={18} />
              </a>

              <Link
                to="/contact"
                className="footer-social-btn mail"
                title="Email Trainer"
              >
                <Mail size={18} />
              </Link>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
              Quick Navigation
            </h4>
            <div style={{ width: '28px', height: '2.5px', backgroundColor: '#38bdf8', borderRadius: '9999px', marginBottom: '18px' }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '0.9rem' }}>
              <li>
                <Link to="/" className="footer-link">Home</Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">About Trainer</Link>
              </li>
              <li>
                <Link to="/courses" className="footer-link">All Courses</Link>
              </li>
              <li>
                <Link to="/quizzes" className="footer-link">Quizzes & Practice</Link>
              </li>
              <li>
                <Link to="/workshops" className="footer-link">Workshops</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Learning Subjects */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
              Learning Domains
            </h4>
            <div style={{ width: '28px', height: '2.5px', backgroundColor: '#38bdf8', borderRadius: '9999px', marginBottom: '18px' }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '0.9rem' }}>
              {publishedSubjects.map((sub) => (
                <li key={sub.id || sub.slug}>
                  <Link to={`/courses/${sub.slug}`} className="footer-link">
                    {sub.name}
                  </Link>
                </li>
              ))}
              {publishedSubjects.length === 0 && (
                <li>
                  <Link to="/courses" className="footer-link">All Courses</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Platform Focus */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
              Direct Channel Hub
            </h4>
            <div style={{ width: '28px', height: '2.5px', backgroundColor: '#38bdf8', borderRadius: '9999px', marginBottom: '18px' }} />
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '18px',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#e0f2fe', marginBottom: '14px' }}>
                Tutorials are structured directly on YouTube for high-speed streaming. Notes and exercise sheets are linked through Google Drive.
              </p>
              <a
                href={trainerProfile.youtube || APP_CONFIG.youtubeChannel}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#38bdf8',
                  transition: 'color 0.2s ease'
                }}
              >
                <span>{trainerProfile.youtube ? 'Visit YouTube Channel' : 'Visit @VLSI_Simlified'}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '22px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '0.85rem',
            color: '#93c5fd'
          }}
        >
          <div>
            © 2026 VLSI Simplified. All rights reserved.
          </div>

          {/* Discreet Admin Portal Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              to="/admin/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: '#7dd3fc',
                fontSize: '0.8rem',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              title="Trainer Management Portal"
            >
              <Shield size={13} />
              <span>Trainer Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
