import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 20px'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'rgba(14, 165, 233, 0.12)',
          color: '#0ea5e9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}
      >
        <AlertCircle size={36} />
      </div>

      <span
        style={{
          fontSize: '4.5rem',
          fontWeight: 800,
          color: '#071a2b',
          lineHeight: 1,
          letterSpacing: '-0.02em',
          marginBottom: '8px'
        }}
      >
        404
      </span>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#071a2b', marginBottom: '12px' }}>
        Page Not Found
      </h1>

      <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '440px', lineHeight: 1.6, marginBottom: '32px' }}>
        The lecture, curriculum, or page you were looking for doesn't exist or may have been relocated.
      </p>

      <div style={{ display: 'flex', gap: '14px' }}>
        <Link to="/">
          <Button variant="primary" icon={Home}>
            Back to Home
          </Button>
        </Link>
        <Link to="/courses">
          <Button variant="outline">
            Browse Courses
          </Button>
        </Link>
      </div>
    </div>
  );
};
