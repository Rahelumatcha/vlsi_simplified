/**
 * Navigation and Smooth Scrolling Helper
 * Provides seamless section scrolling on the homepage, and cross-route navigation
 * (e.g. /courses/vlsi -> Home -> #about) with guaranteed top reset for Home/Logo.
 */

export const navigateToSection = (sectionId, navigate, location) => {
  const currentPath = location ? location.pathname : window.location.pathname;

  // 1. HOME / LOGO - Always scroll to the very top (top: 0)
  if (!sectionId || sectionId === 'home') {
    if (currentPath === '/') {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      // Navigate to homepage and ensure top scroll
      navigate('/', { state: { scrollToTop: true } });
      window.scrollTo(0, 0);
    }
    return;
  }

  // 2. TARGET SECTION (about, courses, quizzes, workshops, contact)
  if (currentPath === '/') {
    // Already on homepage, smooth scroll directly to target element
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.warn(`Section #${sectionId} not found on page.`);
    }
  } else {
    // On another route (e.g., /courses/vlsi) -> navigate to '/' with targetSection state
    navigate('/', { state: { targetSection: sectionId } });
  }
};
