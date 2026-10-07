import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastItem = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} color="#10b981" />;
      case 'warning':
        return <AlertTriangle size={18} color="#f59e0b" />;
      case 'error':
        return <AlertCircle size={18} color="#ef4444" />;
      case 'info':
      default:
        return <Info size={18} color="#0ea5e9" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#0ea5e9';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#071a2b',
        color: '#ffffff',
        padding: '12px 16px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.35)',
        borderLeft: `4px solid ${getBorderColor()}`,
        minWidth: '280px',
        maxWidth: '420px',
        fontSize: '0.9rem',
        animation: 'fadeIn 0.2s ease-out',
        pointerEvents: 'auto'
      }}
    >
      <div style={{ flexShrink: 0 }}>{getIcon()}</div>
      <div style={{ flex: 1, wordBreak: 'break-word', lineHeight: 1.4 }}>{toast.message}</div>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          color: '#94a3b8',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex'
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};
