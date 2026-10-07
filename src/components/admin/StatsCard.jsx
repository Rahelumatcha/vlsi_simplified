import React from 'react';

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  variant = 'primary'
}) => {
  const getIconColor = () => {
    switch (variant) {
      case 'success': return { bg: 'rgba(16, 185, 129, 0.12)', fg: '#10b981' };
      case 'warning': return { bg: 'rgba(245, 158, 11, 0.12)', fg: '#f59e0b' };
      case 'danger': return { bg: 'rgba(239, 68, 68, 0.12)', fg: '#ef4444' };
      default: return { bg: 'rgba(14, 165, 233, 0.12)', fg: '#0ea5e9' };
    }
  };

  const colors = getIconColor();

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e1effa',
        boxShadow: '0 2px 8px rgba(7, 26, 43, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}
    >
      <div>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '6px' }}>
          {title}
        </span>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#071a2b', lineHeight: 1.1 }}>
          {value}
        </div>
        {subtitle && (
          <span style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
            {subtitle}
          </span>
        )}
      </div>

      {Icon && (
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: colors.bg,
            color: colors.fg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};
