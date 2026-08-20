import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global hook to handle `.reveal` and `.reveal-scale` scroll animations.
 * It uses an IntersectionObserver to add the `.in` class when elements enter the viewport.
 */
export const useRevealAnimations = () => {
  const location = useLocation();

  useEffect(() => {
    // Wait a brief moment for DOM mutations (e.g. page transitions/hydration) to settle
    const timer = setTimeout(() => {
      const items = document.querySelectorAll('.reveal, .reveal-scale');
      if (items.length === 0) return;

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
            setTimeout(() => {
              entry.target.classList.add('in');
            }, delay);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

      items.forEach((el) => {
        // If it already has 'in', we don't need to observe it again (unless we want to re-trigger)
        if (!el.classList.contains('in')) {
          io.observe(el);
        }
      });

      return () => {
        io.disconnect();
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-run when route changes
};
