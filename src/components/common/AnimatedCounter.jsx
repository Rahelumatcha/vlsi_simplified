import React, { useEffect, useRef, useState } from 'react';

/**
 * AnimatedCounter Component
 * Animates numbers (e.g. 700+, 5K+, 10+) when scrolled into viewport.
 * If text is non-numeric (e.g. 'Live'), it gracefully displays the value directly.
 * Respects prefers-reduced-motion accessibility.
 */
export const AnimatedCounter = ({
  value = '0',
  duration = 1400,
  className = '',
  style = {}
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const rawStr = String(value || '').trim();
    
    // Parse numeric portion and prefix/suffix
    // Handles formats like: "700+", "5K+", "10+", "15"
    const match = rawStr.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);

    if (!match) {
      // Non-numeric (e.g., "Live", "Daily")
      setDisplayValue(rawStr);
      return;
    }

    const prefix = match[1] || '';
    const targetNum = parseFloat(match[2]);
    const suffix = match[3] || '';

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) {
      setDisplayValue(rawStr);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            observer.unobserve(entry.target);

            const startTime = performance.now();
            const startVal = 0;

            const update = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic curve: 1 - (1 - t)^3
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const currentNum = Math.round(startVal + (targetNum - startVal) * easeProgress);

              setDisplayValue(`${prefix}${currentNum}${suffix}`);

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                setDisplayValue(rawStr); // Ensure exact final value matches prop
              }
            };

            requestAnimationFrame(update);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [value, duration]);

  return (
    <span ref={elementRef} className={className} style={style}>
      {displayValue}
    </span>
  );
};
