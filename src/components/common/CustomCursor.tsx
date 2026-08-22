import React, { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
interface Ripple {
  id: number;
  x: number;
  y: number;
}

// ──────────────────────────────────────────────────────────────────────────────
// CustomCursor
// ──────────────────────────────────────────────────────────────────────────────
const CustomCursor: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [ringColor, setRingColor] = useState('rgba(139,92,246,0.55)');
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // ── Cursor position (raw + spring-smoothed ring) ──
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springCfg = { damping: 22, stiffness: 400, mass: 0.25 };
  const ringX = useSpring(cursorX, springCfg);
  const ringY = useSpring(cursorY, springCfg);

  // ── Click ripple spawner ──
  const spawnRipple = useCallback((x: number, y: number) => {
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 620);
  }, []);

  useEffect(() => {
    // Only on pointer-fine (desktop) devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    setVisible(true);

    // ── Mouse move ──
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    // ── Click ripple ──
    const onDown = (e: MouseEvent) => {
      spawnRipple(e.clientX, e.clientY);
    };

    // ── Throttled Hover detection ──
    let lastOverTime = 0;
    const onOver = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastOverTime < 32) return; // Throttle to max 30 checks/sec
      lastOverTime = now;

      const target = e.target as HTMLElement;
      if (!target) return;
      const interactive = target.closest(
        'button, a, [role="button"], .interactive-cursor, input, textarea, select'
      );

      if (interactive) {
        setIsHovered(true);
        setHoverText(interactive.getAttribute('data-cursor-text') || '');
        const colorAttr = interactive.getAttribute('data-cursor-color');
        if (colorAttr === 'cyan')    setRingColor('rgba(34,211,238,0.6)');
        else if (colorAttr === 'emerald') setRingColor('rgba(52,211,153,0.6)');
        else if (colorAttr === 'amber')   setRingColor('rgba(245,158,11,0.6)');
        else                              setRingColor('rgba(139,92,246,0.6)');
      } else {
        setIsHovered(false);
        setHoverText('');
        setRingColor('rgba(139,92,246,0.45)');
      }
    };

    // ── Hide when cursor leaves window ──
    const onLeave = () => cursorX.set(-200);

    window.addEventListener('mousemove', onMove,  { passive: true });
    window.addEventListener('mousedown', onDown,  { passive: true });
    window.addEventListener('mouseover', onOver,  { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [cursorX, cursorY, spawnRipple]);

  if (!visible) return null;

  return (
    <>
      {/* ── Inner dot — snaps exactly to cursor center ── */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[2147483647] rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width:  5,
          height: 5,
          backgroundColor: '#ffffff',
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.9)',
        }}
        transition={{ type: 'spring', stiffness: 900, damping: 45, mass: 0.1 }}
      />

      {/* ── Outer Gemini Spark Outline — spring-lagged fixed center ── */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[2147483646] flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width:  34,
          height: 34,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-full h-full overflow-visible"
          style={{ animation: 'spin-slow 8s linear infinite', transformOrigin: 'center center' }}
        >
          <defs>
            <linearGradient id="gemini-cursor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <filter id="gemini-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#a855f7" floodOpacity="0.8" />
            </filter>
          </defs>
          <path
            d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
            fill="none"
            stroke="url(#gemini-cursor-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#gemini-glow)"
          />
        </svg>

        {hoverText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute font-jetbrains text-[9px] font-bold text-white uppercase tracking-wider px-1 text-center bg-black/60 backdrop-blur-md rounded-md py-0.5 border border-purple-500/30 whitespace-nowrap"
          >
            {hoverText}
          </motion.span>
        )}
      </motion.div>

      {/* ── Click Gemini spark ripple bursts ── */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="pointer-events-none fixed top-0 left-0 z-[2147483645]"
          style={{
            left: r.x,
            top:  r.y,
            transform: 'translate(-50%, -50%)',
            width:  34,
            height: 34,
            animation: 'cursor-ripple 0.65s ease-out forwards',
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
              fill="none"
              stroke={ringColor}
              strokeWidth="1.5"
            />
          </svg>
        </div>
      ))}
    </>
  );
};

export default CustomCursor;
