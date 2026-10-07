import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Youtube,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Cpu,
  Layers,
  Code,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Play,
  Award,
  Video,
  ExternalLink,
  Sparkles,
  Send,
  Mail,
  Linkedin,
  Clock,
  Users,
  GraduationCap
} from 'lucide-react';
import { APP_CONFIG } from '../config';
import { Button } from '../components/common/Button';
import { SubjectCard } from '../components/courses/SubjectCard';
import { QuizCard } from '../components/quiz/QuizCard';
import { initialWorkshopsList } from './WorkshopsPage';
import { courseService } from '../services/courseService';
import { quizService } from '../services/quizService';
import { portfolioService } from '../services/portfolioService';
import staticSubjects from '../data/subjects.json';
import staticClasses from '../data/classes.json';
import staticQuizzes from '../data/quizzes.json';
import staticTrainer from '../data/trainer.json';
import { initialTrainerProfile } from '../data/initialTrainerProfile';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SectionCurve } from '../components/common/SectionCurve';
import { TypingTitle } from '../components/common/TypingTitle';
import { useToast } from '../contexts/ToastContext';
import { navigateToSection } from '../utils/navigationHelper';

export const HomePage = () => {
  const [profile, setProfile] = useState(() => ({
    ...initialTrainerProfile,
    ...staticTrainer
  }));
  const [subjects, setSubjects] = useState(() => {
    const pubSubjects = (staticSubjects || []).filter((s) => s.published !== false);
    const pubClasses = (staticClasses || []).filter((c) => c.published !== false);
    return courseService.attachDynamicClassCounts(pubSubjects, pubClasses);
  });
  const [featuredQuizzes, setFeaturedQuizzes] = useState(() => {
    return (staticQuizzes || []).filter((q) => q.published !== false).slice(0, 3);
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Contact form state
  const [contactData, setContactData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const { showSuccess } = useToast();

  useEffect(() => {
    const refreshHomeData = async () => {
      try {
        const [trainerProfile, subjectsData, classesData, quizzesData] = await Promise.all([
          portfolioService.getTrainerProfile(),
          courseService.getSubjects(),
          courseService.getClasses(),
          quizService.getQuizzes()
        ]);

        const dynamicSubjects = courseService.attachDynamicClassCounts(subjectsData, classesData);

        setProfile(trainerProfile || {});
        setSubjects(dynamicSubjects);
        setFeaturedQuizzes((quizzesData || []).slice(0, 3));
      } catch (err) {
        console.error('Failed to refresh homepage data:', err);
      }
    };

    refreshHomeData();
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactData.name.trim() || !contactData.email.trim() || !contactData.message.trim()) {
      return;
    }
    setContactSubmitted(true);
    showSuccess('Thank you! Your message is ready for future email integration.');
  };

  const handleScrollToCourses = () => {
    navigateToSection('courses', navigate, location);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '72px', paddingBottom: '72px' }}>
      {/* ========================================================================= */}
      {/* 1. HERO / FULL BACKGROUND VIDEO BANNER (ALL TEXT ON LEFT SIDE)           */}
      {/* ========================================================================= */}
      <section
        id="home"
        style={{
          position: 'relative',
          minHeight: '680px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          backgroundColor: '#082f49',
          scrollMarginTop: '65px'
        }}
        className="hero-video-section"
      >
        {/* Full Background Video (Autoplay, Loop, Muted, PlaysInline) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={APP_CONFIG.assets.heroVideoPoster}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            opacity: 0.8
          }}
        >
          <source src={APP_CONFIG.assets.heroVideoUrl} type="video/mp4" />
          <source src={APP_CONFIG.assets.heroVideoFallbackUrl} type="video/mp4" />
        </video>

        {/* Subtle, Readable Dark Sky-Blue/Navy Gradient Overlay (Optimized for left readability) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(8, 47, 73, 0.94) 0%, rgba(8, 47, 73, 0.88) 45%, rgba(14, 165, 233, 0.45) 100%)',
            zIndex: 2,
            backdropFilter: 'blur(1px)'
          }}
        />

        {/* Hero Content Container - ALL TEXT ON LEFT SIDE */}
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 10,
            paddingTop: '64px',
            paddingBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // All text left-aligned
            textAlign: 'left',
            color: '#ffffff'
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#38bdf8',
              fontSize: '0.825rem',
              fontWeight: '700',
              letterSpacing: '0.04em',
              marginBottom: '20px'
            }}
          >
            <Sparkles size={15} color="#38bdf8" />
            <span style={{ color: '#ffffff' }}>DAILY VLSI TUTORIALS ON YOUTUBE</span>
          </div>

          {/* Heading with static "VLSI " and dynamic rotating synonyms */}
          <h1 style={{ marginBottom: '18px', maxWidth: '780px' }}>
            <div style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 800, letterSpacing: '-0.02em', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              <TypingTitle
                staticPrefix="VLSI "
                words={['Simplified', 'Made Easy', 'Demystified', 'Design & Verification', 'Mastery']}
              />
            </div>
            <div style={{ color: '#ffffff', fontSize: 'clamp(1.4rem, 2.8vw, 2.1rem)', fontWeight: 700, marginTop: '8px', textShadow: '0 2px 10px rgba(0,0,0,0.4)', lineHeight: 1.25 }}>
              Master Digital Systems, Verilog & UVM
            </div>
          </h1>

          {/* Value proposition description */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
              lineHeight: 1.7,
              color: '#e0f2fe',
              marginBottom: '28px',
              maxWidth: '640px',
              textShadow: '0 1px 4px rgba(0,0,0,0.4)'
            }}
          >
            Daily VLSI tutorials, straight from the channel — Verilog, SystemVerilog, UVM, ASIC Design & Verification. Structured tracks designed for students and working engineers.
          </p>

          {/* Left-Aligned Call to Actions */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '28px' }}>
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleScrollToCourses}
            >
              Start Learning
            </Button>

            <a
              href={APP_CONFIG.youtubeChannel}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Button variant="youtube" size="lg" icon={Youtube}>
                Watch on YouTube
              </Button>
            </a>

            <Button
              variant="outline"
              size="lg"
              style={{
                backgroundColor: 'transparent',
                color: '#38bdf8',
                borderColor: '#38bdf8',
                backdropFilter: 'blur(4px)'
              }}
              className="hero-explore-btn"
              onClick={handleScrollToCourses}
            >
              Explore Topics
            </Button>
          </div>

          {/* 4 STATISTICS (NO EXTRA CONTAINER - DIRECT IN FLOW) */}
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '24px',
              marginTop: '12px',
              marginBottom: '20px'
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>700+</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>Free Tutorials</div>
              <div style={{ fontSize: '0.775rem', color: '#bae6fd' }}>YouTube Video Classes</div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>5K+</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>Learners Taught</div>
              <div style={{ fontSize: '0.775rem', color: '#bae6fd' }}>Students & Engineers</div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>10+</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>VLSI Topics</div>
              <div style={{ fontSize: '0.775rem', color: '#bae6fd' }}>Curated Domains</div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#38bdf8', lineHeight: 1 }}>Live</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginTop: '6px' }}>Workshops & Classes</div>
              <div style={{ fontSize: '0.775rem', color: '#bae6fd' }}>Interactive Sessions</div>
            </div>
          </div>

          {/* Highlights positioned simply at the bottom of the stats */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              color: '#bae6fd',
              fontSize: '0.875rem',
              fontWeight: 600,
              flexWrap: 'wrap',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              width: '100%',
              marginBottom: '28px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#38bdf8" />
              <span>100% Free on YouTube</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#38bdf8" />
              <span>Google Drive Notes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#38bdf8" />
              <span>Topic-wise Quizzes</span>
            </div>
          </div>
        </div>

        {/* Maven Silicon-style Seamless Fitted Wave Transition */}
        <div style={{ position: 'relative', zIndex: 10, width: '100%', marginBottom: '-1px' }}>
          <SectionCurve fill="#ffffff" bg="transparent" height={54} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ABOUT THE TRAINER (DYNAMIC, ATTRACTIVE, REFINED)                     */}
      {/* ========================================================================= */}
      <section id="about" className="container" style={{ scrollMarginTop: '65px' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '48px',
            border: '1.5px solid #e0f2fe',
            boxShadow: '0 8px 30px rgba(14, 165, 233, 0.06)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}
        >
          {/* Left: Trainer Photo with Glowing Frame */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '360px',
                aspectRatio: '1 / 1',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '4px solid #f0f9ff',
                boxShadow: '0 16px 36px rgba(14, 165, 233, 0.18)'
              }}
            >
              <img
                src={
                  profile.profileImage && !profile.profileImage.includes('unsplash.com')
                    ? profile.profileImage
                    : APP_CONFIG.assets.trainerPhoto
                }
                alt={profile.trainerName || 'VLSI Trainer'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = APP_CONFIG.assets.trainerPhoto;
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(15, 23, 42, 0.82)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Award size={18} color="#38bdf8" />
                <span>10+ Years Semiconductor & Teaching Experience</span>
              </div>
            </div>
          </div>

          {/* Right: Dynamic Introduction & Credentials */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0ea5e9', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              <Sparkles size={15} />
              <span>ABOUT THE TRAINER</span>
            </div>

            <h2 className="heading-section" style={{ marginBottom: '6px' }}>
              {profile.trainerName || 'Technical Trainer & VLSI Educator'}
            </h2>

            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0369a1', marginBottom: '16px' }}>
              {profile.designation || 'Specialist in Digital Systems & Semiconductor Verification'}
            </p>

            <p style={{ fontSize: '0.975rem', lineHeight: 1.7, color: '#475569', marginBottom: '24px' }}>
              A dedicated educator on a mission to simplify complex chip design concepts. Teaching Digital Systems, Verilog, SystemVerilog, and UVM with industry-relevant testbenches and simulation waveforms.
            </p>

            {/* Quick Metrics Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '14px',
                padding: '16px 20px',
                borderRadius: '14px',
                backgroundColor: '#f8fcff',
                border: '1px solid #e0f2fe',
                marginBottom: '24px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  Industry Focus
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  Design & Verification
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  Learners
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0ea5e9' }}>
                  5,000+ Taught
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  YouTube Lectures
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                  700+ Published
                </span>
              </div>
            </div>

            {/* Areas of Expertise Chips */}
            {subjects.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '10px' }}>
                  Core Subject Domains:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {subjects.map((sub) => (
                    <span
                      key={sub.id || sub.name}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#0369a1',
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/about" style={{ textDecoration: 'none' }}>
                <Button variant="primary" icon={ArrowRight} iconPosition="right">
                  Read Full Bio
                </Button>
              </Link>
              <a
                href={APP_CONFIG.youtubeChannel}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Button variant="youtube" icon={Youtube}>
                  Channel Profile
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. COURSES / EXPLORE VLSI TOPICS (SUBJECT CARDS ONLY - NO CLASS LIST)   */}
      {/* ========================================================================= */}
      <section id="courses" className="container" style={{ scrollMarginTop: '65px' }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
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
            STRUCTURED VLSI CURRICULUM
          </span>
          <h2 className="heading-section" style={{ margin: '0 0 10px' }}>
            Explore Course Tracks
          </h2>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
            Click any course card to explore its full sequential lecture list, notes, and progress tracker.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading course curriculum..." />
        ) : subjects.length > 0 ? (
          <div className="grid-cards">
            {subjects.map((sub) => (
              <SubjectCard key={sub.id} subject={sub} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
            <p style={{ fontSize: '1.05rem', margin: 0 }}>No course tracks published yet.</p>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY LEARN WITH VLSI SIMPLIFIED (DARK SKY BLUE & MODERN CREATIVE CARDS) */}
      {/* ========================================================================= */}
      <section
        id="why-us"
        style={{
          background: 'linear-gradient(145deg, #072540 0%, #03456c 40%, #0284c7 85%, #0369a1 100%)',
          padding: '80px 0',
          scrollMarginTop: '65px',
          position: 'relative',
          overflow: 'hidden'
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
            top: '-10%',
            left: '15%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.14) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 52px' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#7dd3fc',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(14, 165, 233, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(125, 211, 252, 0.3)',
                padding: '6px 16px',
                borderRadius: '9999px',
                marginBottom: '16px'
              }}
            >
              <Cpu size={15} color="#38bdf8" />
              CORE PEDAGOGY
            </span>
            <h2
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.025em',
                margin: '0 0 14px',
                lineHeight: 1.2
              }}
            >
              Why Learn with{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #ffffff 30%, #7dd3fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                VLSI Simplified?
              </span>
            </h2>
            <p style={{ color: '#bae6fd', fontSize: '1.05rem', lineHeight: 1.65, margin: 0 }}>
              Four foundational pillars that make complex silicon design intuitive, structured, and accessible.
            </p>
          </div>

          {/* Creative 4-Pillar Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px'
            }}
          >
            {[
              {
                step: '01',
                tag: 'Boolean to UVM',
                title: 'Structured Learning',
                desc: 'Sequential syllabus organized from foundational Boolean logic to advanced UVM phase mechanisms.',
                icon: Layers
              },
              {
                step: '02',
                tag: 'Synthesizable RTL',
                title: 'Practical Examples',
                desc: 'Synthesizable Verilog code, waveform analysis, and simulation testbenches tested on real EDA tools.',
                icon: Terminal
              },
              {
                step: '03',
                tag: 'Zero Paywalls',
                title: 'Free YouTube Tutorials',
                desc: 'Unrestricted, high-definition video lessons freely accessible anytime on YouTube with zero paywalls.',
                icon: Youtube
              },
              {
                step: '04',
                tag: 'Core Chip Design',
                title: 'Interview-Oriented Concepts',
                desc: 'Focus on core technical interview questions asked by premier semiconductor product and service companies.',
                icon: Award
              }
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    padding: '30px 26px',
                    border: '1.5px solid rgba(255, 255, 255, 0.85)',
                    boxShadow: '0 16px 36px rgba(4, 28, 50, 0.28)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    cursor: 'default'
                  }}
                  className="modern-card"
                >
                  {/* Top Row: Icon + Number Index */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px'
                      }}
                    >
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '14px',
                          background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 6px 16px rgba(14, 165, 233, 0.35)'
                        }}
                      >
                        <Icon size={25} />
                      </div>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: '#0284c7',
                          backgroundColor: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          padding: '3px 10px',
                          borderRadius: '8px'
                        }}
                      >
                        {pillar.step}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        marginBottom: '10px',
                        lineHeight: 1.3
                      }}
                    >
                      {pillar.title}
                    </h3>
                    <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.65, margin: '0 0 20px' }}>
                      {pillar.desc}
                    </p>
                  </div>

                  {/* Bottom Feature Pill */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      alignSelf: 'flex-start',
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #e0f2fe',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#0369a1'
                    }}
                  >
                    <Sparkles size={12} color="#0ea5e9" />
                    <span>{pillar.tag}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. QUIZZES PREVIEW (COMING SOON OR DYNAMIC CARDS)                        */}
      {/* ========================================================================= */}
      <section id="quizzes" className="container" style={{ scrollMarginTop: '65px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
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
              TEST YOUR KNOWLEDGE
            </span>
            <h2 className="heading-section" style={{ margin: 0 }}>
              Technical Topic Quizzes
            </h2>
          </div>

          <Link to="/quiz" style={{ textDecoration: 'none' }}>
            <Button variant="outline" icon={HelpCircle} iconPosition="left">
              View All Quizzes
            </Button>
          </Link>
        </div>

        {featuredQuizzes.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '48px 32px',
              border: '2px dashed #bae6fd',
              boxShadow: '0 4px 18px rgba(14, 165, 233, 0.05)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                backgroundColor: '#f0f9ff',
                color: '#0ea5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                border: '1.5px solid #bae6fd'
              }}
            >
              <HelpCircle size={28} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Quizzes Coming Soon
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '520px', lineHeight: 1.6, marginBottom: '20px' }}>
              Interactive topic-wise quizzes are currently being curated. Once published by the trainer via the Admin Panel, they will appear right here!
            </p>

            <a href={APP_CONFIG.youtubeChannel} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" icon={Youtube}>
                Watch Video Classes While Waiting
              </Button>
            </a>
          </div>
        ) : (
          <div className="grid-cards">
            {featuredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} subjectName="VLSI Curriculum" />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 6. WORKSHOPS PREVIEW (COMING SOON OR DYNAMIC CARDS)                      */}
      {/* ========================================================================= */}
      <section id="workshops" className="container" style={{ scrollMarginTop: '65px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
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
              LIVE INTERACTION
            </span>
            <h2 className="heading-section" style={{ margin: 0 }}>
              Upcoming VLSI Workshops
            </h2>
          </div>

          <Link to="/workshops" style={{ textDecoration: 'none' }}>
            <Button variant="outline" icon={Calendar} iconPosition="left">
              All Workshops
            </Button>
          </Link>
        </div>

        {initialWorkshopsList.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '48px 32px',
              border: '2px dashed #bae6fd',
              boxShadow: '0 4px 18px rgba(14, 165, 233, 0.05)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                backgroundColor: '#f0f9ff',
                color: '#0ea5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                border: '1.5px solid #bae6fd'
              }}
            >
              <Calendar size={28} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
              Workshops Coming Soon
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '520px', lineHeight: 1.6, marginBottom: '22px' }}>
              Live interactive bootcamps on RTL Design, SystemVerilog, and UVM are being scheduled. Check back soon or pre-register on WhatsApp!
            </p>

            <a
              href={`${APP_CONFIG.whatsappUrl}?text=${encodeURIComponent('Hi Trainer! Please notify me when upcoming live workshops and bootcamps are announced.')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Button variant="primary" icon={MessageCircle}>
                Notify Me on WhatsApp
              </Button>
            </a>
          </div>
        ) : (
          <div className="grid-cards">
            {initialWorkshopsList.slice(0, 3).map((ws) => (
              <div
                key={ws.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e0f2fe',
                  boxShadow: '0 2px 10px rgba(14, 165, 233, 0.05)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                className="modern-card"
              >
                <div style={{ width: '100%', height: '160px', overflow: 'hidden' }}>
                  <img src={ws.image} alt={ws.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                    {ws.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, marginBottom: '16px', flex: 1 }}>
                    {ws.description}
                  </p>
                  <div style={{ fontSize: '0.825rem', color: '#0369a1', fontWeight: 600, marginBottom: '16px' }}>
                    📅 {ws.date} • {ws.duration}
                  </div>
                  <a
                    href={`${APP_CONFIG.whatsappUrl}?text=${encodeURIComponent(ws.whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="secondary" size="sm" icon={MessageCircle} style={{ width: '100%' }}>
                      Chat on WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 7. YOUTUBE CTA BANNER                                                     */}
      {/* ========================================================================= */}
      <section className="container">
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '52px 40px',
            border: '2px solid #bae6fd',
            boxShadow: '0 12px 32px rgba(14, 165, 233, 0.08)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ff0000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginBottom: '20px',
              boxShadow: '0 6px 20px rgba(255, 0, 0, 0.35)'
            }}
          >
            <Youtube size={34} />
          </div>

          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.35rem)', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
            Learn with Us on YouTube
          </h2>

          <p style={{ color: '#475569', fontSize: '1.05rem', maxWidth: '600px', lineHeight: 1.6, marginBottom: '28px' }}>
            Subscribe to <strong>@VLSI_Simlified</strong> for daily tutorial updates, architecture walkthroughs, and industry interview series.
          </p>

          <a
            href={APP_CONFIG.youtubeChannel}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Button variant="youtube" size="lg" icon={Youtube}>
              Subscribe on YouTube
            </Button>
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CONTACT SECTION                                                        */}
      {/* ========================================================================= */}
      <section id="contact" className="container" style={{ scrollMarginTop: '65px' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '48px',
            border: '1.5px solid #e0f2fe',
            boxShadow: '0 6px 24px rgba(14, 165, 233, 0.05)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px'
          }}
        >
          {/* Left: Contact Info & WhatsApp CTA */}
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
              GET IN TOUCH
            </span>
            <h2 className="heading-section" style={{ marginBottom: '12px' }}>
              Let's Connect
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Have a question about VLSI, courses, workshops, or collaboration? Reach out directly.
            </p>

            {/* Quick WhatsApp Block */}
            <div
              style={{
                padding: '20px',
                borderRadius: '16px',
                backgroundColor: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '28px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff'
                  }}
                >
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#166534', margin: 0 }}>
                    Have a quick question?
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: '#15803d' }}>Fastest response on WhatsApp</span>
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
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <MessageCircle size={15} />
                  <span>Chat on WhatsApp</span>
                </button>
              </a>
            </div>

            {/* Direct Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#0ea5e9" />
                <span>{APP_CONFIG.contactEmail}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Youtube size={18} color="#ff0000" />
                <a href={APP_CONFIG.youtubeChannel} target="_blank" rel="noopener noreferrer" style={{ color: '#0ea5e9', fontWeight: 600 }}>
                  youtube.com/@VLSI_Simlified
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div>
            {contactSubmitted ? (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '16px',
                  border: '1px solid #bae6fd'
                }}
              >
                <CheckCircle2 size={40} color="#0ea5e9" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Message Received!
                </h3>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '18px' }}>
                  Thank you for reaching out. We will get back to you shortly.
                </p>
                <Button variant="outline" size="sm" onClick={() => setContactSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactData.name}
                      onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                      placeholder="Your Full Name"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
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
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      placeholder="name@domain.com"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                      placeholder="+91..."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
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
                      value={contactData.subject}
                      onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                      placeholder="Course query, workshop, etc."
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    placeholder="Write your question or request..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <Button type="submit" variant="primary" size="md" icon={Send}>
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
