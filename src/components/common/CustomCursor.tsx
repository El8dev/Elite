import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

/**
 * Hardware-Accelerated Zero-Re-Render Custom Cursor
 * ──────────────────────────────────────────────────
 * Manipulates DOM elements directly via translate3d without
 * triggering React component re-renders on mousemove/mouseover.
 */
const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [visible, setVisible] = useState(false);

  const spawnRipple = useCallback((x: number, y: number) => {
    const id = Date.now();
    setRipples((prev) => [...prev.slice(-3), { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 620);
  }, []);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    setVisible(true);

    let mouseX = -100;
    let mouseY = -100;
    let sparkX = -100;
    let sparkY = -100;
    let animId: number;
    let isMoving = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      isMoving = true;
    };

    const onDown = (e: MouseEvent) => {
      spawnRipple(e.clientX, e.clientY);
    };

    let lastOver = 0;
    const onOver = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastOver < 40) return;
      lastOver = now;

      const target = e.target as HTMLElement;
      if (!target) return;
      const interactive = target.closest(
        'button, a, [role="button"], .interactive-cursor, input, textarea, select'
      );

      if (interactive) {
        const text = interactive.getAttribute('data-cursor-text');
        if (labelRef.current) {
          if (text) {
            labelRef.current.textContent = text;
            labelRef.current.style.display = 'block';
          } else {
            labelRef.current.style.display = 'none';
          }
        }
        if (sparkRef.current) {
          sparkRef.current.style.transformOrigin = 'center center';
          sparkRef.current.style.scale = '1.25';
        }
      } else {
        if (labelRef.current) {
          labelRef.current.style.display = 'none';
        }
        if (sparkRef.current) {
          sparkRef.current.style.scale = '1';
        }
      }
    };

    const onLeave = () => {
      mouseX = -200;
      mouseY = -200;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(-200px, -200px, 0)`;
      }
    };

    // Smooth spark follower loop
    const tick = () => {
      if (isMoving) {
        sparkX += (mouseX - sparkX) * 0.22;
        sparkY += (mouseY - sparkY) * 0.22;
        if (sparkRef.current) {
          sparkRef.current.style.transform = `translate3d(${sparkX}px, ${sparkY}px, 0) translate(-50%, -50%)`;
        }
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [spawnRipple]);

  if (!visible) return null;

  return (
    <>
      {/* ── Inner dot — zero-render transform ── */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[2147483647] rounded-full"
        style={{
          width: 5,
          height: 5,
          backgroundColor: '#ffffff',
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.9)',
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />

      {/* ── Outer Gemini Spark Outline — lerp follower ── */}
      <div
        ref={sparkRef}
        className="pointer-events-none fixed top-0 left-0 z-[2147483646] flex items-center justify-center transition-[scale] duration-200"
        style={{
          width: 34,
          height: 34,
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          willChange: 'transform',
        }}
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-full h-full overflow-visible pointer-events-none"
          style={{ 
            animation: 'spin-slow 8s linear infinite', 
            transformOrigin: 'center center',
            filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.65))'
          }}
        >
          <defs>
            <linearGradient id="gemini-cursor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <path
            d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
            fill="none"
            stroke="url(#gemini-cursor-grad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span
          ref={labelRef}
          className="absolute font-jetbrains text-[9px] font-bold text-white uppercase tracking-wider px-1 text-center bg-black/70 rounded-md py-0.5 border border-purple-500/30 whitespace-nowrap"
          style={{ display: 'none' }}
        />
      </div>

      {/* ── Click Gemini spark ripple bursts ── */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="pointer-events-none fixed top-0 left-0 z-[2147483645]"
          style={{
            left: r.x,
            top: r.y,
            transform: 'translate(-50%, -50%)',
            width: 34,
            height: 34,
            animation: 'cursor-ripple 0.65s ease-out forwards',
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
              fill="none"
              stroke="rgba(168, 85, 247, 0.6)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      ))}
    </>
  );
};

export default CustomCursor;
