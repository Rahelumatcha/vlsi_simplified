import React, { useState } from 'react';
import { Calendar, Clock, Video, CheckCircle2, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { APP_CONFIG } from '../config';

// Default empty: workshops will only display when added by admin
export const initialWorkshopsList = [];

export const WorkshopsPage = () => {
  const [workshops] = useState(initialWorkshopsList);

  return (
    <div style={{ padding: '48px 0 80px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
      <section className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
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
            INTERACTIVE LIVE TRAINING
          </span>
          <h1 className="heading-section" style={{ color: '#0f172a', margin: '0 0 12px' }}>
            Live VLSI Workshops & Bootcamps
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6 }}>
            Deep-dive weekend masterclasses focused on practical RTL design, SystemVerilog verification, and UVM architectures.
          </p>
        </div>

        {/* Workshop Cards Grid or Coming Soon State */}
        {workshops.length === 0 ? (
          <div
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '56px 40px',
              border: '2px dashed #bae6fd',
              boxShadow: '0 10px 30px rgba(14, 165, 233, 0.06)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: '#f0f9ff',
                color: '#0ea5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                border: '1.5px solid #bae6fd',
                boxShadow: '0 4px 14px rgba(14, 165, 233, 0.15)'
              }}
            >
              <Calendar size={32} />
            </div>

            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#0284c7',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                padding: '4px 12px',
                borderRadius: '9999px',
                marginBottom: '14px'
              }}
            >
              SCHEDULE IN PROGRESS
            </span>

            <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
              Live Workshops Coming Soon
            </h3>

            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.65, maxWidth: '520px', marginBottom: '28px' }}>
              Upcoming live cohorts for SystemVerilog, UVM, and Digital Design are currently being scheduled. Once the trainer announces the dates, registration links will appear right here.
            </p>

            <a
              href={`${APP_CONFIG.whatsappUrl}?text=${encodeURIComponent('Hi Trainer! Please notify me when upcoming live workshops and bootcamps are announced.')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Button variant="primary" size="lg" icon={MessageCircle}>
                Get Notified on WhatsApp
              </Button>
            </a>
          </div>
        ) : (
          <div className="grid-cards">
            {workshops.map((ws) => (
              <div
                key={ws.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '1.5px solid #e0f2fe',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.06)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                className="modern-card"
              >
                {/* Image & Status Badge */}
                <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={ws.image}
                    alt={ws.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <Badge variant={ws.status === 'Registrations Open' ? 'success' : 'primary'}>
                      {ws.status}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
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
    </div>
  );
};
