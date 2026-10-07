import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * - Resets window scroll position to (0, 0) upon standard route changes.
 * - If targetSection is specified in router state, smoothly scrolls to that element.
 */
export const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    const targetSection = location.state?.targetSection;

    if (targetSection) {
      // Delay slightly to ensure DOM has rendered
      const timer = setTimeout(() => {
        const el = document.getElementById(targetSection);
        if (el) {
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Standard page navigation: reset to top
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.state]);

  return null;
};
