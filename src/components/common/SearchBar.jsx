import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search courses, subjects, or classes...',
  className = '',
  maxWidth = '460px'
}) => {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Search
        size={18}
        color="#64748b"
        style={{
          position: 'absolute',
          left: '14px',
          pointerEvents: 'none'
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '11px 40px 11px 42px',
          borderRadius: '12px',
          border: '1.5px solid #cbd5e1',
          backgroundColor: '#ffffff',
          color: '#071a2b',
          fontSize: '0.925rem',
          outline: 'none',
          boxShadow: '0 2px 4px rgba(7, 26, 43, 0.04)',
          transition: 'border-color 0.2s, box-shadow 0.2s'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#0ea5e9';
          e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.15)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#cbd5e1';
          e.target.style.boxShadow = '0 2px 4px rgba(7, 26, 43, 0.04)';
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '12px',
            color: '#94a3b8',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
