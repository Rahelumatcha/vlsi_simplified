import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component
 * Smooth, lightweight scroll animation using browser-native IntersectionObserver.
 * Zero external dependencies. Fully respects prefers-reduced-motion accessibility.
 */
export const ScrollReveal = ({
  children,
  direction = 'up', // 'up' | 'down' | 'left' | 'right' | 'fade' | 'none'
  delay = 0, // delay in ms
  duration = 0.55, // duration in seconds
  distance = 24, // initial offset in px
  threshold = 0.12, // viewport trigger threshold
  className = '',
  style = {},
  as: Component = 'div'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold]);

  // Compute transform offset based on direction
  const getTransform = () => {
    if (isVisible || direction === 'none' || direction === 'fade') return 'translate3d(0, 0, 0)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const dynamicStyle = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
    ...style
  };

  return (
    <Component ref={elementRef} className={`scroll-reveal ${className}`} style={dynamicStyle}>
      {children}
    </Component>
  );
};
