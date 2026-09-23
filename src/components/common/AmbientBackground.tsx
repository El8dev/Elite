import React, { useEffect } from 'react';

/**
 * AmbientBackground
 * ─────────────────
 * Fixed full-screen EL8 cyber-ambient background layer:
 *  1. An infinite, seamlessly looping pixelated "8" matrix pattern (pure CSS/SVG vector)
 *  2. Hardware-composited diagonal drift animation (zero CPU loop, zero canvas memory)
 *  3. Static atmospheric brand radial glows at the viewport extremities
 */
const AmbientBackground: React.FC = () => {
  useEffect(() => {
    const sync = () => document.body.classList.toggle('page-hidden', document.hidden);
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => { document.removeEventListener('visibilitychange', sync); document.body.classList.remove('page-hidden'); };
  }, []);

  return (
    <div className="el8-bg-root" aria-hidden="true">
      {/* Static soft ambient depth glow */}
      <div className="el8-bg-glow" />

      {/* Infinite looping pixel '8' pattern matrix */}
      <div className="el8-pixel-bg" />

      {/* Subtle vignette fade on edges */}
      <div className="el8-bg-vignette" />
    </div>
  );
};

export default AmbientBackground;
