import React, { useState } from 'react';
import { Youtube, Bell, Check, Sparkles, ExternalLink } from 'lucide-react';
import { APP_CONFIG } from '../../config';
import { publicDataService } from '../../services/publicDataService';

/**
 * YouTubeSubscribeAnimation
 * Clean White 3D Animated Showcase of a Person / Hand physically clicking the YouTube "Subscribe"
 * button, triggering celebration confetti, then clicking the Notification Bell with ringing 3D soundwaves.
 */
export const YouTubeSubscribeAnimation = ({ channelUrl }) => {
  const [userClicked, setUserClicked] = useState(false);

  const fallbackUrl = publicDataService.getCachedTrainer()?.youtube || APP_CONFIG.youtubeChannel;
  const youtubeLink = channelUrl || fallbackUrl || 'https://www.youtube.com/@VLSI_Simlified';

  const handleDirectClick = () => {
    setUserClicked(true);
    window.open(youtubeLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '920px',
        margin: '0 auto',
        perspective: '1200px'
      }}
      className="yt-subscribe-section-wrap"
    >
      {/* Main 3D Card Stage - Clean White Aesthetic */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#ffffff',
          borderRadius: '26px',
          padding: 'clamp(32px, 5vw, 48px) clamp(20px, 4vw, 40px)',
          border: '2px solid #bae6fd',
          boxShadow: '0 16px 40px rgba(14, 165, 233, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)'
        }}
        className="yt-stage-card"
      >
        {/* Subtle semiconductor circuit matrix dot overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(14, 165, 233, 0.12) 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
            zIndex: 0
          }}
          aria-hidden="true"
        />

        {/* Ambient Top Glow Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '450px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, rgba(56, 189, 248, 0.1) 50%, transparent 75%)',
            filter: 'blur(35px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
          aria-hidden="true"
        />

        {/* Section Pill Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '9999px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            color: '#0284c7',
            fontSize: '0.8rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: '14px',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Sparkles size={14} color="#0ea5e9" />
          <span>OFFICIAL YOUTUBE CHANNEL</span>
        </div>

        {/* Section Heading */}
        <h2
          style={{
            fontSize: 'clamp(1.75rem, 3.8vw, 2.5rem)',
            fontWeight: 900,
            color: '#0f172a',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            marginBottom: '12px',
            position: 'relative',
            zIndex: 1
          }}
        >
          Learn with Us on <span style={{ color: '#ff0000' }}>YouTube</span>
        </h2>

        {/* Section Description */}
        <p
          style={{
            color: '#475569',
            fontSize: 'clamp(0.95rem, 1.8vw, 1.05rem)',
            maxWidth: '640px',
            lineHeight: 1.65,
            marginBottom: '32px',
            position: 'relative',
            zIndex: 1
          }}
        >
          Subscribe to <strong style={{ color: '#0284c7' }}>@VLSI_Simlified</strong> for daily tutorial updates, architecture walkthroughs, and industry interview series.
        </p>

        {/* ========================================================================= */}
        {/* 3D YOUTUBE CHANNEL INTERACTIVE SIMULATION (PERSON CLICKS SUBSCRIBE)       */}
        {/* ========================================================================= */}
        <div
          onClick={handleDirectClick}
          title="Click to visit VLSI Simplified on YouTube"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '560px',
            borderRadius: '20px',
            backgroundColor: '#ffffff',
            border: '1.5px solid #e0f2fe',
            boxShadow: '0 16px 36px rgba(14, 165, 233, 0.1), 0 4px 12px rgba(0, 0, 0, 0.04)',
            padding: '24px 20px',
            cursor: 'pointer',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease',
            zIndex: 2,
            marginBottom: '32px'
          }}
          className="yt-mock-interface"
        >
          {/* Top simulated browser / app pill header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px',
              paddingBottom: '14px',
              borderBottom: '1px solid #f1f5f9'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.74rem',
                color: '#64748b',
                fontWeight: 600,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '3px 10px',
                borderRadius: '6px'
              }}
            >
              <span>youtube.com/@VLSI_Simlified</span>
              <ExternalLink size={11} color="#0ea5e9" />
            </div>
          </div>

          {/* Channel Row: Avatar + Name + Subscribe & Bell Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            {/* Channel Avatar & Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
              <div
                style={{
                  position: 'relative',
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  padding: '2.5px',
                  background: 'linear-gradient(135deg, #ff0000 0%, #0ea5e9 100%)',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)'
                }}
              >
                <img
                  src="/logo.png"
                  alt="VLSI Simplified"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    backgroundColor: '#f8fafc'
                  }}
                  onError={(e) => {
                    e.target.src = '/logo.png';
                  }}
                />
                {/* Live YouTube badge indicator */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#ff0000',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff'
                  }}
                >
                  <Youtube size={10} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                    VLSI Simplified
                  </span>
                  {/* Verified check badge */}
                  <span
                    style={{
                      width: '15px',
                      height: '15px',
                      borderRadius: '50%',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      fontWeight: 900
                    }}
                    title="Verified Channel"
                  >
                    ✓
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  @VLSI_Simlified • <span style={{ color: '#0284c7', fontWeight: 700 }}>15K subscribers</span>
                </div>
              </div>
            </div>

            {/* Simulated Interactive Subscription Controls Container */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              className="yt-controls-area"
            >
              {/* THE SUBSCRIBE BUTTON WITH ANIMATED CLICK SEQUENCE */}
              <div
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '9px 20px',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  letterSpacing: '0.01em',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  userSelect: 'none'
                }}
                className="animated-sub-button"
              >
                {/* State A: Red "Subscribe" (Fades out when clicked) */}
                <span className="sub-text-initial" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Youtube size={15} />
                  <span>Subscribe</span>
                </span>

                {/* State B: Dark "Subscribed ✓" (Fades in when clicked) */}
                <span className="sub-text-clicked" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={15} color="#10b981" />
                  <span>Subscribed</span>
                </span>

                {/* Click Ripple Wave Effect */}
                <span className="sub-click-ripple" aria-hidden="true" />
              </div>

              {/* THE NOTIFICATION BELL WITH 3D RINGING CHIME ANIMATION */}
              <div
                style={{
                  position: 'relative',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  color: '#334155',
                  cursor: 'pointer'
                }}
                className="animated-bell-button"
                title="Turn on notifications"
              >
                <Bell size={18} className="animated-bell-icon" />

                {/* Expanding Soundwave Pulse Rings */}
                <span className="bell-soundwave wave-1" />
                <span className="bell-soundwave wave-2" />
              </div>

              {/* CELEBRATION 3D CONFETTI BURST PARTICLES */}
              <div className="confetti-container" aria-hidden="true">
                <span className="particle p1" />
                <span className="particle p2" />
                <span className="particle p3" />
                <span className="particle p4" />
                <span className="particle p5" />
                <span className="particle p6" />
                <span className="particle p7" />
                <span className="particle p8" />
              </div>

              {/* ============================================================= */}
              {/* 3D PERSON'S HAND CURSOR THAT GLIDES IN AND CLICKS THE BUTTON   */}
              {/* ============================================================= */}
              <div className="person-3d-hand-cursor" aria-hidden="true">
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    filter: 'drop-shadow(0 14px 18px rgba(15, 23, 42, 0.45))'
                  }}
                >
                  <defs>
                    <linearGradient id="handSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffdeb3" />
                      <stop offset="50%" stopColor="#f5aa74" />
                      <stop offset="100%" stopColor="#cf6b2b" />
                    </linearGradient>
                    <linearGradient id="sleeveColor" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#072a45" />
                    </linearGradient>
                  </defs>

                  {/* Arm Sleeve */}
                  <path
                    d="M44 48 L60 62 L48 64 L36 52 Z"
                    fill="url(#sleeveColor)"
                  />
                  {/* White Shirt Cuff */}
                  <ellipse cx="40" cy="50" rx="6" ry="3.5" transform="rotate(-40 40 50)" fill="#ffffff" />

                  {/* Main Hand Palm Base */}
                  <path
                    d="M30 32 C26 26, 36 20, 42 24 C46 27, 44 36, 40 40 C36 43, 30 42, 28 37 Z"
                    fill="url(#handSkinGrad)"
                  />

                  {/* Folded Thumb */}
                  <path
                    d="M26 36 C22 34, 24 28, 28 30 C31 32, 30 38, 26 36 Z"
                    fill="url(#handSkinGrad)"
                  />

                  {/* Extended Pointing Index Finger Touching the Button */}
                  <path
                    d="M14 10 C16 6, 21 7, 23 10 L30 26 C31 28, 28 31, 25 31 L18 18 Z"
                    fill="url(#handSkinGrad)"
                  />

                  {/* Fingernail Specular Highlight */}
                  <ellipse cx="17.5" cy="11" rx="2.2" ry="1.4" transform="rotate(-30 17.5 11)" fill="rgba(255,255,255,0.75)" />

                  {/* 3D Finger Highlights & Creases */}
                  <path
                    d="M17 14 L24 25"
                    stroke="rgba(255, 255, 255, 0.45)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Finger Dynamic Contact Press Shadow */}
                <div className="hand-contact-shadow" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DIRECT CLICKABLE "SUBSCRIBE ON YOUTUBE" CTA BUTTON                         */}
        {/* ========================================================================= */}
        <div style={{ position: 'relative', zIndex: 3 }}>
          <a
            href={youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '14px 34px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #ff0000 0%, #e60000 60%, #cc0000 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.05rem',
                letterSpacing: '0.01em',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 10px 24px rgba(255, 0, 0, 0.3), 0 3px 8px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              className="yt-primary-cta-btn"
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff0000'
                }}
              >
                <Youtube size={17} color="#ff0000" />
              </div>
              <span>Subscribe on YouTube</span>
            </div>
          </a>
        </div>

        {/* CSS 3D Person Click Keyframe Timeline & Interactions */}
        <style>{`
          /* Mock card hover tilt effect */
          .yt-mock-interface:hover {
            transform: translateY(-4px) scale(1.01);
            border-color: #38bdf8 !important;
            box-shadow: 0 20px 45px rgba(14, 165, 233, 0.16), 0 4px 14px rgba(0, 0, 0, 0.05) !important;
          }

          /* Loop duration: 6.5 seconds continuous cycle */
          /* 1. BUTTON MORPH ANIMATION */
          .animated-sub-button {
            animation: subButtonCycle 6.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          @keyframes subButtonCycle {
            0%, 24% {
              background-color: #ff0000;
              color: #ffffff;
              box-shadow: 0 4px 14px rgba(255, 0, 0, 0.45);
              transform: scale(1);
            }
            26% {
              /* Hand presses down on button! */
              background-color: #d90429;
              transform: scale(0.92);
              box-shadow: 0 2px 6px rgba(255, 0, 0, 0.25);
            }
            29%, 88% {
              /* Button turns to Subscribed state */
              background-color: #0f172a;
              color: #ffffff;
              box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
              transform: scale(1);
            }
            94%, 100% {
              /* Reset back to red Subscribe */
              background-color: #ff0000;
              color: #ffffff;
              box-shadow: 0 4px 14px rgba(255, 0, 0, 0.45);
              transform: scale(1);
            }
          }

          /* Text cross-fade */
          .sub-text-initial {
            position: relative;
            animation: textInitialFade 6.5s infinite;
          }
          .sub-text-clicked {
            position: absolute;
            animation: textClickedFade 6.5s infinite;
          }

          @keyframes textInitialFade {
            0%, 25% { opacity: 1; transform: translateY(0); }
            28%, 88% { opacity: 0; transform: translateY(-8px); }
            94%, 100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes textClickedFade {
            0%, 25% { opacity: 0; transform: translateY(8px); }
            28%, 88% { opacity: 1; transform: translateY(0); }
            94%, 100% { opacity: 0; transform: translateY(8px); }
          }

          /* 2. CLICK RIPPLE WAVE UNDER FINGER */
          .sub-click-ripple {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            animation: clickRippleCycle 6.5s infinite;
          }

          @keyframes clickRippleCycle {
            0%, 25% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            26% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
            30% { transform: translate(-50%, -50%) scale(14); opacity: 0; }
            100% { opacity: 0; }
          }

          /* 3. 3D PERSON HAND CURSOR MOVEMENT TIMELINE */
          .person-3d-hand-cursor {
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 10;
            animation: personHandMovement 6.5s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          }

          @keyframes personHandMovement {
            /* Hand starts off at lower-right */
            0% {
              transform: translate3d(120px, 90px, 40px) scale(1.1);
              opacity: 0;
            }
            8% {
              opacity: 1;
              transform: translate3d(70px, 40px, 30px) scale(1);
            }
            /* Glides directly over the Subscribe button */
            22% {
              transform: translate3d(36px, 12px, 20px) scale(1);
            }
            /* FINGER PRESSES DOWN ON SUBSCRIBE BUTTON! */
            26% {
              transform: translate3d(36px, 16px, 0px) scale(0.92);
            }
            /* Lifts up from Subscribe button */
            32% {
              transform: translate3d(36px, 8px, 25px) scale(1);
            }
            /* Glides across to the Notification Bell! */
            48% {
              transform: translate3d(130px, 8px, 20px) scale(1);
            }
            /* FINGER PRESSES DOWN ON THE BELL! */
            54% {
              transform: translate3d(130px, 12px, 0px) scale(0.92);
            }
            /* Lifts up from Bell */
            60% {
              transform: translate3d(130px, 4px, 25px) scale(1);
            }
            /* Retreats smoothly away */
            75% {
              transform: translate3d(150px, 40px, 30px) scale(1.05);
              opacity: 1;
            }
            88%, 100% {
              transform: translate3d(180px, 90px, 40px) scale(1.1);
              opacity: 0;
            }
          }

          /* Dynamic contact shadow below finger */
          .hand-contact-shadow {
            width: 16px;
            height: 8px;
            border-radius: 50%;
            background: rgba(15, 23, 42, 0.35);
            margin-top: -6px;
            margin-left: 12px;
            filter: blur(4px);
            animation: shadowPulse 6.5s infinite;
          }

          @keyframes shadowPulse {
            0%, 20% { opacity: 0.2; transform: scale(1.3); filter: blur(6px); }
            26% { opacity: 0.75; transform: scale(0.7); filter: blur(2px); } /* Press */
            32%, 50% { opacity: 0.25; transform: scale(1.2); filter: blur(5px); }
            54% { opacity: 0.75; transform: scale(0.7); filter: blur(2px); } /* Press bell */
            60%, 100% { opacity: 0; transform: scale(1.4); }
          }

          /* 4. NOTIFICATION BELL CHIME & SOUNDWAVES */
          .animated-bell-button {
            animation: bellButtonCycle 6.5s infinite;
          }

          @keyframes bellButtonCycle {
            0%, 52% {
              background-color: #f8fafc;
              border-color: #cbd5e1;
              color: #475569;
            }
            54% {
              /* Pressed */
              transform: scale(0.88);
            }
            57%, 88% {
              background-color: #fef3c7;
              border-color: #f59e0b;
              color: #d97706;
              transform: scale(1);
            }
            94%, 100% {
              background-color: #f8fafc;
              border-color: #cbd5e1;
              color: #475569;
            }
          }

          .animated-bell-icon {
            animation: bellIconShake 6.5s infinite;
            transform-origin: top center;
          }

          @keyframes bellIconShake {
            0%, 54% { transform: rotate(0); }
            56% { transform: rotate(22deg); }
            58% { transform: rotate(-22deg); }
            60% { transform: rotate(18deg); }
            62% { transform: rotate(-14deg); }
            64% { transform: rotate(8deg); }
            66%, 100% { transform: rotate(0); }
          }

          /* Bell sonic rings */
          .bell-soundwave {
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            border: 2px solid #f59e0b;
            pointer-events: none;
            opacity: 0;
          }
          .bell-soundwave.wave-1 {
            animation: bellRingWave 6.5s 0.05s infinite;
          }
          .bell-soundwave.wave-2 {
            animation: bellRingWave 6.5s 0.25s infinite;
          }

          @keyframes bellRingWave {
            0%, 55% { transform: scale(0.8); opacity: 0; }
            56% { transform: scale(1); opacity: 0.8; }
            64% { transform: scale(2.2); opacity: 0; }
            100% { opacity: 0; }
          }

          /* 5. CONFETTI CELEBRATION BURST */
          .confetti-container {
            position: absolute;
            top: 50%;
            left: 50px;
            width: 0;
            height: 0;
            pointer-events: none;
          }

          .particle {
            position: absolute;
            width: 7px;
            height: 7px;
            border-radius: 2px;
            opacity: 0;
          }

          .p1 { background: #ef4444; animation: confBurst1 6.5s infinite; }
          .p2 { background: #0ea5e9; animation: confBurst2 6.5s infinite; }
          .p3 { background: #f59e0b; animation: confBurst3 6.5s infinite; }
          .p4 { background: #10b981; animation: confBurst4 6.5s infinite; }
          .p5 { background: #8b5cf6; animation: confBurst5 6.5s infinite; }
          .p6 { background: #ec4899; animation: confBurst6 6.5s infinite; }
          .p7 { background: #0284c7; animation: confBurst7 6.5s infinite; }
          .p8 { background: #f97316; animation: confBurst8 6.5s infinite; }

          @keyframes confBurst1 {
            0%, 25% { opacity: 0; transform: translate(0, 0) scale(0); }
            27% { opacity: 1; }
            38%, 100% { opacity: 0; transform: translate(-35px, -45px) rotate(140deg) scale(1); }
          }
          @keyframes confBurst2 {
            0%, 25% { opacity: 0; transform: translate(0, 0) scale(0); }
            27% { opacity: 1; }
            38%, 100% { opacity: 0; transform: translate(25px, -50px) rotate(-120deg) scale(1); }
          }
          @keyframes confBurst3 {
            0%, 25% { opacity: 0; transform: translate(0, 0) scale(0); }
            27% { opacity: 1; }
            38%, 100% { opacity: 0; transform: translate(-50px, -15px) rotate(80deg) scale(1.2); }
          }
          @keyframes confBurst4 {
            0%, 25% { opacity: 0; transform: translate(0, 0) scale(0); }
            27% { opacity: 1; }
            38%, 100% { opacity: 0; transform: translate(45px, -20px) rotate(-90deg) scale(1); }
          }
          @keyframes confBurst5 {
            0%, 25% { opacity: 0; transform: translate(0, 0) scale(0); }
            27% { opacity: 1; }
            38%, 100% { opacity: 0; transform: translate(-30px, 30px) rotate(180deg) scale(0.9); }
          }
          @keyframes confBurst6 {
            0%, 25% { opacity: 0; transform: translate(0, 0) scale(0); }
            27% { opacity: 1; }
            38%, 100% { opacity: 0; transform: translate(35px, 25px) rotate(-140deg) scale(1.1); }
          }
          @keyframes confBurst7 {
            0%, 25% { opacity: 0; transform: translate(0, 0) scale(0); }
            27% { opacity: 1; }
            38%, 100% { opacity: 0; transform: translate(0px, -55px) rotate(45deg) scale(1); }
          }
          @keyframes confBurst8 {
            0%, 25% { opacity: 0; transform: translate(0, 0) scale(0); }
            27% { opacity: 1; }
            38%, 100% { opacity: 0; transform: translate(10px, 45px) rotate(-60deg) scale(0.8); }
          }

          /* CTA Hover styling */
          .yt-primary-cta-btn:hover {
            transform: scale(1.05) translateY(-2px);
            box-shadow: 0 16px 32px rgba(255, 0, 0, 0.4), 0 4px 10px rgba(0, 0, 0, 0.12) !important;
          }
          .yt-primary-cta-btn:active {
            transform: scale(0.98);
          }

          /* Mobile Responsive Tweaks */
          @media (max-width: 580px) {
            .yt-mock-interface {
              padding: 16px 12px !important;
            }
            .yt-controls-area {
              width: 100%;
              justifyContent: center;
              margin-top: 6px;
            }
            .person-3d-hand-cursor {
              transform-origin: top left;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .person-3d-hand-cursor,
            .animated-sub-button,
            .animated-bell-button,
            .animated-bell-icon,
            .particle {
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};
