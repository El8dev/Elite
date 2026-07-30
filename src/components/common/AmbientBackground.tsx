import React from 'react';

/**
 * AmbientBackground
 * ─────────────────
 * Fixed full-screen background layer providing:
 *  1. Three drifting CSS-animated gradient orbs (GPU-accelerated, no canvas)
 *  2. A subtle dot-grid mesh overlay (layered via CSS)
 *
 * Performance: 100% CSS — only `transform` and `opacity` are animated
 * (both GPU-composited), ensuring 0 Layout / 0 Paint invalidations.
 * Pointer-events are disabled so it never intercepts UI interactions.
 */
const AmbientBackground: React.FC = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* ── Orb 1 — Violet (top-left drift) ── */}
      <div
        className="absolute -top-[20%] -left-[15%] h-[55vmax] w-[55vmax] rounded-full animate-float will-change-transform"
        style={{
          background:
            'radial-gradient(circle at center, rgba(139,92,246,0.09) 0%, rgba(99,102,241,0.05) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* ── Orb 2 — Cyan (bottom-right drift, delayed) ── */}
      <div
        className="absolute -bottom-[25%] -right-[10%] h-[60vmax] w-[60vmax] rounded-full animate-float-delayed will-change-transform"
        style={{
          background:
            'radial-gradient(circle at center, rgba(34,211,238,0.055) 0%, rgba(34,211,238,0.025) 40%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* ── Orb 3 — Emerald (center-right, mid-speed) ── */}
      <div
        className="absolute top-[35%] right-[5%] h-[40vmax] w-[40vmax] rounded-full will-change-transform"
        style={{
          background:
            'radial-gradient(circle at center, rgba(52,211,153,0.045) 0%, transparent 65%)',
          filter: 'blur(55px)',
          animation: 'float 11s ease-in-out infinite 2s',
        }}
      />

      {/* ── Subtle vignette at edges ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
};

export default AmbientBackground;
