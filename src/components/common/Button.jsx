import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'youtube' | 'ghost' | 'danger' | 'dark'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  style = {},
  ...props
}) => {
  const styles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    textDecoration: 'none',
    border: 'none',
    gap: size === 'sm' ? '6px' : '8px',
    padding: size === 'sm' ? '6px 14px' : size === 'lg' ? '12px 26px' : '9px 20px',
    fontSize: size === 'sm' ? '0.825rem' : size === 'lg' ? '1rem' : '0.9rem',
    ...style
  };

  if (variant === 'primary') {
    styles.backgroundColor = '#0ea5e9';
    styles.color = '#ffffff';
    styles.boxShadow = '0 2px 8px rgba(14, 165, 233, 0.25)';
  } else if (variant === 'secondary') {
    styles.backgroundColor = '#f0f9ff';
    styles.color = '#0369a1';
    styles.border = '1px solid #bae6fd';
  } else if (variant === 'outline') {
    styles.backgroundColor = '#ffffff';
    styles.color = '#0ea5e9';
    styles.border = '1.5px solid #0ea5e9';
  } else if (variant === 'youtube') {
    styles.backgroundColor = '#ff0000';
    styles.color = '#ffffff';
    styles.boxShadow = '0 2px 8px rgba(255, 0, 0, 0.25)';
  } else if (variant === 'ghost') {
    styles.backgroundColor = 'transparent';
    styles.color = '#334155';
  } else if (variant === 'danger') {
    styles.backgroundColor = '#ef4444';
    styles.color = '#ffffff';
  } else if (variant === 'dark') {
    styles.backgroundColor = '#0f2a43';
    styles.color = '#ffffff';
  }

  return (
    <button
      type={type}
      style={styles}
      disabled={disabled || loading}
      onClick={onClick}
      className={`custom-btn ${className}`}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.75s linear infinite'
          }}
        />
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
    </button>
  );
};
