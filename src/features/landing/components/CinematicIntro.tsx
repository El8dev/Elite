import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCinematicSound } from '@/hooks/useCinematicSound';

export interface CinematicIntroProps {
  children: React.ReactNode;
}

// ──────────────────────────────────────────────────────────────────────────────
// Timing Constants — Total: ~2.8s (Balanced & Professional)
// ──────────────────────────────────────────────────────────────────────────────
const T = {
  // Phase 1: SVG path draw (both paths simultaneously)
  DRAW_START:    0.20,
  DRAW_DUR:      1.00,

  // Phase 2: Logo fill + neon glow bloom
  FILL_START:    0.90,
  FILL_DUR:      0.60,

  // Phase 3: "ELITE" text letter-stagger
  TEXT_START:    1.20,
  TEXT_DUR:      0.50,

  // Phase 4: Expanding center line
  LINE_START:    1.70,
  LINE_DUR:      0.45,

  // Phase 5: Hold
  HOLD:          0.70,

  // Phase 6: Full overlay wipe-up exit
  EXIT_DUR:      0.80,
};

const TOTAL_DISPLAY_TIME =
  T.LINE_START + T.LINE_DUR + T.HOLD; // Time before exit starts
// JS timer fires after display; exit animation is handled by AnimatePresence
const DISMISS_AFTER_MS = (TOTAL_DISPLAY_TIME) * 1000;

import { EliteLogo } from '@/components/common/EliteLogo';

// ──────────────────────────────────────────────────────────────────────────────
// Animated Logo
// ──────────────────────────────────────────────────────────────────────────────
const AnimatedEliteLogo: React.FC = () => {
  const pathD_top =
    'M 65 15 L 130 15 C 135 15 138 18 138 23 L 138 33 C 138 38 135 41 130 41 L 65 41 C 60 41 57 38 57 33 L 57 23 C 57 18 60 15 65 15 Z';
  const pathD_body =
    'M 25 55 L 90 55 C 95 55 98 58 100 63 L 115 88 C 117 93 114 98 109 98 L 68 98 C 63 98 60 101 62 106 L 77 131 C 79 136 82 139 87 139 L 145 139 C 150 139 153 136 153 131 L 153 123 C 153 118 150 115 145 115 L 98 115 C 93 115 90 112 88 107 L 73 82 C 71 77 74 72 79 72 L 120 72 C 125 72 128 69 128 64 L 128 56 C 128 51 125 48 120 48 L 60 48 C 55 48 52 51 50 56 L 35 81 C 33 86 30 89 25 89 L 20 89 C 15 89 12 86 12 81 L 12 63 C 12 58 15 55 20 55 L 25 55 Z';

  return (
    <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
      {/* Ambient glow ring that pulses outward during draw */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(34,211,238,0.25) 0%, rgba(139,92,246,0.18) 40%, transparent 70%)',
          filter: 'blur(18px)',
          transform: 'translate(-50%, -50%) scale(0)',
          top: '50%',
          left: '50%',
          width: '180px',
          height: '180px',
        }}
        animate={{
          scale:   [0, 1.6, 1.2],
          opacity: [0, 0.9, 0.5],
        }}
        transition={{
          duration: T.DRAW_DUR + T.FILL_DUR,
          delay:    T.DRAW_START,
          ease:     'easeOut',
        }}
      />

      <svg
        viewBox="0 0 170 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-[0_0_16px_rgba(139,92,246,0.6)]"
        aria-hidden="true"
      >
        {/* Stroke draw phase (Cyan neon stroke) */}
        <motion.path
          d={pathD_top}
          stroke="#22D3EE"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="transparent"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: T.DRAW_DUR, ease: 'easeInOut', delay: T.DRAW_START },
            opacity:    { duration: 0.1, delay: T.DRAW_START },
          }}
        />
        <motion.path
          d={pathD_body}
          stroke="#22D3EE"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="transparent"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: T.DRAW_DUR + 0.06, ease: 'easeInOut', delay: T.DRAW_START },
            opacity:    { duration: 0.1, delay: T.DRAW_START },
          }}
        />

        {/* Fill bloom phase (Violet solid fill) */}
        <motion.path
          d={pathD_top}
          fill="#8B5CF6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: T.FILL_DUR, delay: T.FILL_START, ease: 'easeOut' }}
        />
        <motion.path
          d={pathD_body}
          fill="#8B5CF6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: T.FILL_DUR, delay: T.FILL_START, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// "ELITE" text with per-letter stagger
// ──────────────────────────────────────────────────────────────────────────────
const letters = ['E', 'L', 'I', 'T', 'E'];

const EliteText: React.FC = () => (
  <div className="relative flex items-center" aria-label="ELITE">
    {letters.map((char, i) => (
      <motion.span
        key={i}
        className="text-5xl md:text-7xl font-bold tracking-[0.14em] text-white select-none font-outfit"
        initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{
          duration: T.TEXT_DUR,
          delay:    T.TEXT_START + i * 0.045,
          ease:     [0.25, 1, 0.5, 1],
        }}
      >
        {char}
      </motion.span>
    ))}
  </div>
);

// ──────────────────────────────────────────────────────────────────────────────
// Overlay exit variants
// ──────────────────────────────────────────────────────────────────────────────
const overlayExit = {
  initial: { opacity: 1, clipPath: 'circle(150% at 50% 50%)' },
  exit: {
    clipPath: 'circle(0% at 50% 50%)',
    transition: { duration: T.EXIT_DUR, ease: [0.76, 0, 0.24, 1] },
  },
} as const;

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────
const CinematicIntro: React.FC<CinematicIntroProps> = ({ children }) => {
  const [showIntro, setShowIntro] = useState(() => {
    return sessionStorage.getItem('hasPlayedCinematicIntro') !== 'true';
  });
  const { playSubBassDrop } = useCinematicSound();

  // Lock scroll while active
  useEffect(() => {
    if (showIntro) {
      document.body.style.overflow    = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow    = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow    = '';
      document.body.style.touchAction = '';
    };
  }, [showIntro]);

  // Dismiss after animation completes
  useEffect(() => {
    if (!showIntro) return;
    const t = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem('hasPlayedCinematicIntro', 'true');
      try {
        if (playSubBassDrop) playSubBassDrop();
      } catch (e) {
        // Ignore audio context autoplay restrictions
      }
    }, DISMISS_AFTER_MS);
    return () => clearTimeout(t);
  }, [playSubBassDrop, showIntro]);

  const handleDismiss = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasPlayedCinematicIntro', 'true');
    try {
      if (playSubBassDrop) playSubBassDrop();
    } catch (e) {}
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            onClick={handleDismiss}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black cursor-pointer select-none"
            initial={overlayExit.initial}
            exit={overlayExit.exit}
            role="status"
            aria-live="polite"
            aria-label="Loading ELITE"
          >
            {/* ── Subtle scanline texture ── */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
              }}
              aria-hidden="true"
            />

            {/* ── Ambient background pulse ── */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.07), transparent)',
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />

            {/* ── Logo + Text row + Expanding Line ── */}
            <div className="relative z-10 flex flex-col items-center" dir="ltr">
              <div className="flex items-center gap-5 md:gap-7">
                <AnimatedEliteLogo />
                <EliteText />
              </div>
              
              {/* ── Expanding Center Line ── */}
              <motion.div
                className="mt-6 h-[2px] w-[280px] md:w-[400px] rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(34,211,238,1) 50%, transparent)',
                  boxShadow: '0 0 15px rgba(34,211,238,0.8), 0 0 5px rgba(139,92,246,0.6)',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{
                  duration: T.LINE_DUR,
                  delay: T.LINE_START,
                  ease: 'easeOut',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App content — always rendered, revealed as intro exits */}
      {children}
    </>
  );
};

export default CinematicIntro;
