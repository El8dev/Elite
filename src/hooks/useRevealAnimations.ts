import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global hook to handle `.reveal` and `.reveal-scale` scroll animations.
 * It uses an IntersectionObserver to add the `.in` class when elements enter the viewport.
 */
export const useRevealAnimations = () => {
  const location = useLocation();

  useEffect(() => {
    let io: IntersectionObserver | null = null;

    const timer = setTimeout(() => {
      const items = document.querySelectorAll('.reveal, .reveal-scale');
      if (items.length === 0) return;

      io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
            if (delay > 0) {
              setTimeout(() => {
                entry.target.classList.add('in');
              }, delay);
            } else {
              entry.target.classList.add('in');
            }
            io?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      items.forEach((el) => {
        if (!el.classList.contains('in')) {
          io?.observe(el);
        }
      });
    }, 60);

    return () => {
      clearTimeout(timer);
      io?.disconnect();
    };
  }, [location.pathname]);
};
