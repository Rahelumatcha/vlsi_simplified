import React from 'react';
import { Layers } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = Layers,
  title = 'No items found',
  description = 'There are currently no items available in this section.',
  actionText,
  onAction
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '56px 20px',
        backgroundColor: '#ffffff',
        border: '1.5px dashed #cbd5e1',
        borderRadius: '16px',
        margin: '20px 0'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0ea5e9',
          marginBottom: '16px'
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#071a2b', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', marginBottom: actionText ? '20px' : 0 }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
