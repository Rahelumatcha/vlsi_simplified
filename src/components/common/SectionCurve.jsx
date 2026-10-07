import React from 'react';

/**
 * SectionCurve - High-precision Maven Silicon inspired SVG curve divider
 * Eliminates subpixel seams, providing fluid, seamlessly fitted section transitions.
 */
export const SectionCurve = ({
  fill = '#ffffff',
  bg = 'transparent',
  flip = false,
  height = 54,
  variant = 'wave',
  style = {}
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        lineHeight: 0,
        backgroundColor: bg,
        transform: flip ? 'rotate(180deg)' : 'none',
        pointerEvents: 'none',
        zIndex: 5,
        ...style
      }}
    >
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        style={{
          display: 'block',
          width: '100%',
          height: `${height}px`,
          verticalAlign: 'bottom'
        }}
      >
        {variant === 'slant' ? (
          <path
            fill={fill}
            d="M0,0 L1440,55 L1440,90 L0,90 Z"
          />
        ) : (
          /* Maven Silicon-style smooth S-curve wave */
          <path
            fill={fill}
            d="M0,36 C280,72 480,12 720,40 C960,68 1200,16 1440,36 L1440,90 L0,90 Z"
          />
        )}
      </svg>
    </div>
  );
};
