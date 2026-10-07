import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, Youtube, Shield, Cpu } from 'lucide-react';
import { APP_CONFIG } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { navigateToSection } from '../../utils/navigationHelper';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', sectionId: 'home' },
    { name: 'About', sectionId: 'about' },
    { name: 'Courses', sectionId: 'courses' },
    { name: 'Quizzes', sectionId: 'quizzes' },
    { name: 'Workshops', sectionId: 'workshops' },
    { name: 'Contact', sectionId: 'contact' }
  ];

  // Track window scroll for subtle elevation and active section highlighting
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (location.pathname === '/') {
        const sections = ['contact', 'workshops', 'quizzes', 'courses', 'about', 'home'];
        for (const sec of sections) {
          if (sec === 'home') {
            if (window.scrollY < 300) {
              setActiveSection('home');
              break;
            }
          } else {
            const el = document.getElementById(sec);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= 140 && rect.bottom >= 140) {
                setActiveSection(sec);
                break;
              }
            }
          }
        }
      } else {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (sectionId, e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigateToSection(sectionId, navigate, location);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigateToSection('home', navigate, location);
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.96)' : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e0f2fe',
        boxShadow: scrolled
          ? '0 4px 20px -2px rgba(14, 165, 233, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)'
          : '0 1px 3px rgba(14, 165, 233, 0.04)',
        transition: 'all 0.25s ease'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '52px' // Sleek, compact navbar
        }}
      >
        {/* Brand Logo & Title */}
        <a
          href="/"
          onClick={handleLogoClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
          title="VLSI Simplified - Return to Top"
        >
          {/* Logo Icon with subtle glowing ring */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '7px',
              backgroundColor: '#f0f9ff',
              border: '1.5px solid #bae6fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(14, 165, 233, 0.12)'
            }}
          >
            <img
              src={APP_CONFIG.assets.logoPlaceholder}
              alt="VLSI Simplified Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                color: '#0ea5e9'
              }}
            >
              <Cpu size={18} />
            </div>
          </div>

          <div>
            <span
              style={{
                fontSize: '1.08rem',
                fontWeight: '800',
                color: '#0f172a',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.15
              }}
            >
              VLSI <span style={{ color: '#0ea5e9' }}>Simplified</span>
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                color: '#64748b',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              Engineering Education
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links & Action Button */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '22px'
          }}
          className="desktop-nav"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === '/' && activeSection === link.sectionId;

              return (
                <a
                  key={link.name}
                  href={`#${link.sectionId}`}
                  onClick={(e) => handleNavClick(link.sectionId, e)}
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: isActive ? '700' : '600',
                    color: isActive ? '#0284c7' : '#334155',
                    padding: '4px 2px',
                    position: 'relative',
                    transition: 'color 0.2s ease',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                  className="nav-link-item"
                >
                  {link.name}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '-2px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: '#0ea5e9',
                        borderRadius: '9999px',
                        boxShadow: '0 0 6px rgba(14, 165, 233, 0.4)'
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* YouTube Action Button & Admin */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href={APP_CONFIG.youtubeChannel}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                backgroundColor: '#ff0000',
                color: '#ffffff',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(255, 0, 0, 0.2)',
                transition: 'transform 0.15s ease, background-color 0.2s ease'
              }}
              className="yt-nav-btn"
              title="Watch on YouTube (External Channel)"
            >
              <Youtube size={14} />
              <span>YouTube</span>
            </a>

            {/* Admin Badge */}
            {isAuthenticated && (
              <Link
                to="/admin/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 9px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#0ea5e9',
                  backgroundColor: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '6px',
                  textDecoration: 'none'
                }}
              >
                <Shield size={12} />
                <span>Admin</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f172a',
            padding: '5px',
            borderRadius: '6px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            cursor: 'pointer'
          }}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e0f2fe',
            padding: '16px 20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 12px 24px rgba(14, 165, 233, 0.08)'
          }}
          className="mobile-drawer"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={`#${link.sectionId}`}
              onClick={(e) => handleNavClick(link.sectionId, e)}
              style={{
                fontSize: '1rem',
                fontWeight: activeSection === link.sectionId ? '700' : '600',
                color: activeSection === link.sectionId ? '#0ea5e9' : '#1e293b',
                padding: '8px 4px',
                display: 'block',
                textDecoration: 'none'
              }}
            >
              {link.name}
            </a>
          ))}

          <a
            href={APP_CONFIG.youtubeChannel}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 16px',
              backgroundColor: '#ff0000',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              marginTop: '6px',
              textDecoration: 'none'
            }}
          >
            <Youtube size={17} />
            <span>Watch on YouTube</span>
          </a>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
        .nav-link-item:hover {
          color: #0ea5e9 !important;
        }
        .yt-nav-btn:hover {
          background-color: #dc2626;
          transform: translateY(-1px);
        }
      `}</style>
    </header>
  );
};
