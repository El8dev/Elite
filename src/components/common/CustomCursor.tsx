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

    // ── Hover detection ──
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'button, a, [role="button"], .interactive-cursor, input, textarea, select'
      );

      if (interactive) {
        setIsHovered(true);
        setHoverText(interactive.getAttribute('data-cursor-text') || '');
        // Support per-element color: data-cursor-color="cyan" | "emerald" | "amber"
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

  const ringSize = isHovered ? 56 : 24;

  return (
    <>
      {/* ── Inner dot — snaps exactly to cursor ── */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorX,
          y: cursorY,
          width:  isHovered ? 8 : 6,
          height: isHovered ? 8 : 6,
          backgroundColor: '#ffffff',
          mixBlendMode: 'difference',
        }}
        transition={{ type: 'spring', stiffness: 900, damping: 45, mass: 0.1 }}
      />

      {/* ── Outer ring — spring-lagged + conic-gradient border ── */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden"
        style={{
          x: ringX,
          y: ringY,
          width:  ringSize,
          height: ringSize,
          mixBlendMode: 'difference',
          background: `conic-gradient(#ffffff 0deg, transparent 220deg)`,
          WebkitMask: `
            radial-gradient(farthest-side, transparent calc(100% - 1.5px), #fff calc(100% - 1.5px))
          `,
          mask: `
            radial-gradient(farthest-side, transparent calc(100% - 1.5px), #fff calc(100% - 1.5px))
          `,
          animation: 'spin-slow 5s linear infinite',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      >
        {hoverText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-jetbrains text-[9px] font-bold text-white uppercase tracking-wider px-1 text-center"
            style={{ WebkitMask: 'none', mask: 'none' }}
          >
            {hoverText}
          </motion.span>
        )}
      </motion.div>

      {/* ── Click ripple bursts ── */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="pointer-events-none fixed top-0 left-0 z-[9997] rounded-full border"
          style={{
            left: r.x,
            top:  r.y,
            width:  24,
            height: 24,
            borderColor: ringColor,
            borderWidth: '1px',
            animation: 'cursor-ripple 0.62s ease-out forwards',
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export default CustomCursor;
