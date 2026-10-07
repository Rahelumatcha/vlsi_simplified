import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, KeyRound, AlertCircle, ArrowLeft, Info, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../../components/common/Button';
import { isApiConfigured } from '../../config';

export const AdminLoginPage = () => {
  const [adminKey, setAdminKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, isLoading, isAuthenticated } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';
  const isOnline = isApiConfigured();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await login(adminKey);
      showSuccess('Authenticated successfully. Welcome back, Trainer!');
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid admin credentials.');
    }
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        backgroundColor: '#f8fafc'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '36px',
          border: '1px solid #e1effa',
          boxShadow: '0 10px 30px rgba(7, 26, 43, 0.06)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              backgroundColor: '#071a2b',
              color: '#0ea5e9',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 0 15px rgba(14, 165, 233, 0.3)'
            }}
          >
            <Shield size={28} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#071a2b', margin: '0 0 6px' }}>
            Trainer Portal Login
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Restricted access for managing courses, lectures, quizzes, and portfolio.
          </p>
        </div>

        {/* Security Architecture Notice (Per instructions: zero fake security) */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '10px',
            backgroundColor: isOnline ? 'rgba(16, 185, 129, 0.08)' : 'rgba(14, 165, 233, 0.08)',
            border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.25)' : 'rgba(14, 165, 233, 0.25)'}`,
            marginBottom: '22px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            fontSize: '0.8rem',
            color: '#334155'
          }}
        >
          <Info size={16} color={isOnline ? '#10b981' : '#0ea5e9'} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Architecture Notice:</strong>
            {isOnline ? (
              <span> Write operations are authenticated server-side against Google Apps Script Script Properties.</span>
            ) : (
              <span> Development Mode active: Enter any demo passphrase (e.g. <code>trainer2026</code>) to test CRUD locally. Connect Google Apps Script to save directly to Google Sheets.</span>
            )}
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#dc2626',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#071a2b', marginBottom: '8px' }}>
              Admin Secret Key / Passphrase
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <KeyRound size={18} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter your private Admin Key"
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 40px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
              Configured via Google Apps Script (ADMIN_KEY property).
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            style={{ width: '100%', marginTop: '4px' }}
          >
            Sign In to Dashboard
          </Button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.825rem',
              color: '#64748b',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={14} />
            <span>Return to Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};
