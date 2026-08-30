import React from 'react';

/**
 * AmbientBackground
 * ─────────────────
 * Fixed full-screen background layer providing:
 *  1. Five drifting CSS-animated gradient orbs (GPU-accelerated, no canvas)
 *  2. A subtle dot-grid mesh overlay (layered via CSS)
 *
 * Placed outside of any transformed/will-change containers so `position: fixed` works perfectly globally.
 */
const AmbientBackground: React.FC = () => {
  return (
    <div className="bg-fx" aria-hidden="true">
      {/* Cyber/Tech line grid overlay */}
      <div className="bg-fx__grid"></div>

      {/* Global cyber lattice mesh covering the full website */}
      <div aria-hidden="true" className="hero-mesh">
        <div className="hero-mesh__lattice"></div>
        <div className="hero-mesh__sweep"></div>
        <div className="hero-mesh__fade"></div>
      </div>

      <div className="bg-fx__orb bg-fx__orb--1"></div>
      <div className="bg-fx__orb bg-fx__orb--2"></div>
      <div className="bg-fx__orb bg-fx__orb--3"></div>
      <div className="bg-fx__orb bg-fx__orb--4"></div>
      <div className="bg-fx__orb bg-fx__orb--5"></div>
    </div>
  );
};

export default AmbientBackground;
