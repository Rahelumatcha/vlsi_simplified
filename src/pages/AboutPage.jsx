import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Code,
  Terminal,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Mail,
  Youtube,
  Linkedin,
  Sparkles
} from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { courseService } from '../services/courseService';
import { publicDataService } from '../services/publicDataService';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ScrollReveal } from '../components/common/ScrollReveal';
import { APP_CONFIG } from '../config';

export const AboutPage = () => {
  const [profile, setProfile] = useState(() => publicDataService.getCachedTrainer());
  const [subjects, setSubjects] = useState(() => (publicDataService.getCachedSubjects() || []).filter((s) => s.published !== false));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const refreshProfile = async () => {
      try {
        const [profileData, subjectsData] = await Promise.all([
          portfolioService.getTrainerProfile(),
          courseService.getSubjects()
        ]);
        if (profileData) {
          setProfile(profileData);
        }
        if (subjectsData) {
          setSubjects((subjectsData || []).filter((s) => s.published !== false));
        }
      } catch (err) {
        console.error('Failed to refresh profile or subjects:', err);
      }
    };
    refreshProfile();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading trainer profile..." />;
  }

  const p = profile || {};

  return (
    <div style={{ padding: '48px 0 80px', display: 'flex', flexDirection: 'column', gap: '56px' }}>
      {/* Profile Overview Header */}
      <section className="container">
        <ScrollReveal direction="up">
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: 'clamp(20px, 4.5vw, 48px)',
              border: '1.5px solid #e0f2fe',
              boxShadow: '0 6px 24px rgba(14, 165, 233, 0.05)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(24px, 4vw, 48px)',
              alignItems: 'center'
            }}
          >
          <div>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0ea5e9',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              ABOUT THE TRAINER
            </span>

            <h1 className="heading-section" style={{ color: '#0f172a', marginBottom: '8px' }}>
              {p.trainerName || 'Technical Trainer & VLSI Educator'}
            </h1>

            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0369a1', marginBottom: '20px' }}>
              {p.designation || 'Specialist in Digital Systems & Semiconductor Verification'}
            </p>

            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#475569', marginBottom: '24px', whiteSpace: 'pre-line' }}>
              {p.fullBiography || p.bio ||
                'A passionate VLSI trainer focused on making complex digital design and verification concepts simple, practical, and easy to understand.'}
            </p>

            {/* Qualifications & Experience Block */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '16px',
                padding: '16px 20px',
                borderRadius: '12px',
                backgroundColor: '#f8fcff',
                border: '1px solid #e0f2fe',
                marginBottom: '28px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  Industry Focus
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {p.industryFocus || 'Design & Verification'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  Experience
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  {p.experienceHeadline || `${p.yearsExperience || '10+'} Years in VLSI & Teaching`}
                </span>
              </div>
            </div>

            {/* Social Channels */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link to="/contact">
                <Button variant="primary" icon={Mail}>
                  Get in Touch
                </Button>
              </Link>
              <a href={p.youtube || APP_CONFIG.youtubeChannel} target="_blank" rel="noopener noreferrer">
                <Button variant="youtube" icon={Youtube}>
                  YouTube Channel
                </Button>
              </a>
              {p.linkedin && (
                <a href={p.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" icon={Linkedin}>
                    LinkedIn
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Trainer Image */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '360px',
                aspectRatio: '1 / 1',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px rgba(14, 165, 233, 0.15)',
                border: '4px solid #f0f9ff'
              }}
            >
              <img
                src={p.profileImage || APP_CONFIG.assets.trainerPhoto}
                alt={p.trainerName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = APP_CONFIG.assets.trainerPhoto;
                }}
              />
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>

      {/* Teaching Philosophy (Sky Blue + White Theme) */}
      <section className="container">
        <ScrollReveal direction="up">
          <div
            style={{
              backgroundColor: '#f0f9ff',
              color: '#0f172a',
              borderRadius: '24px',
              padding: 'clamp(20px, 4.5vw, 48px)',
              border: '2px solid #bae6fd',
              boxShadow: '0 6px 20px rgba(14, 165, 233, 0.05)'
            }}
          >
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0ea5e9',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'block',
                marginBottom: '10px'
              }}
            >
              PEDAGOGICAL APPROACH
            </span>
            <h2 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.75rem)', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              Teaching Philosophy: Silicon-First Education
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#334155', maxWidth: '900px', margin: 0 }}>
              {p.teachingPhilosophy ||
                'Hardware engineering is best learned from the silicon up. By uniting abstract Boolean theory with real CMOS physical constraints and industrial verification workflows, students develop true silicon intuition.'}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Expertise & Skills */}
      <section className="container">
        <ScrollReveal direction="up">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
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
              CORE MASTERY
            </span>
            <h2 className="heading-section" style={{ color: '#0f172a', marginBottom: '10px' }}>
              Areas of Specialization
            </h2>
            <p style={{ color: '#475569', fontSize: '0.95rem' }}>
              Structured knowledge domains honed over {p.yearsExperience || '10+'} years in semiconductor design and verification.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid-cards-4">
          {(subjects || []).filter((s) => s.published !== false).map((sub) => (
            <div
              key={sub.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e0f2fe',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
              className="modern-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#f0f9ff',
                    color: '#0ea5e9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Cpu size={20} />
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#0369a1',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}
                >
                  Track
                </span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                {sub.name}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                {sub.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Timeline (Rendered only if actual timeline data exists in Google Sheets) */}
      {Array.isArray(p.experienceTimeline) && p.experienceTimeline.length > 0 && (
        <section className="container">
          <h2 className="heading-section" style={{ color: '#0f172a', marginBottom: '32px', textAlign: 'center' }}>
            Industry & Educational Milestones
          </h2>

          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {p.experienceTimeline.map((exp, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '28px',
                  border: '1px solid #e0f2fe',
                  boxShadow: '0 2px 10px rgba(14, 165, 233, 0.04)'
                }}
                className="modern-card"
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0ea5e9' }}>
                  {exp.period}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                  {exp.role}
                </h3>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569', marginBottom: '12px' }}>
                  {exp.organization}
                </div>
                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
