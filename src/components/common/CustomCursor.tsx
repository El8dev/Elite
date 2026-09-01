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
  const sparkInnerRef = useRef<HTMLDivElement>(null);
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
    let isHovering = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isMoving) {
        sparkX = mouseX;
        sparkY = mouseY;
      }

      if (dotRef.current) {
        dotRef.current.style.opacity = '1';
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (sparkRef.current) {
        sparkRef.current.style.opacity = '1';
      }
      isMoving = true;
    };

    const onDown = (e: MouseEvent) => {
      spawnRipple(e.clientX, e.clientY);
    };

    let lastOver = 0;
    const onOver = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastOver < 30) return;
      lastOver = now;

      const target = e.target as HTMLElement;
      if (!target) return;
      const interactive = target.closest(
        'button, a, [role="button"], .interactive-cursor, input, textarea, select'
      );

      if (interactive) {
        if (!isHovering) {
          isHovering = true;
          if (sparkInnerRef.current) {
            sparkInnerRef.current.style.transform = 'scale(1.28)';
          }
        }
        const text = interactive.getAttribute('data-cursor-text');
        if (labelRef.current) {
          if (text) {
            labelRef.current.textContent = text;
            labelRef.current.style.display = 'block';
          } else {
            labelRef.current.style.display = 'none';
          }
        }
      } else {
        if (isHovering) {
          isHovering = false;
          if (sparkInnerRef.current) {
            sparkInnerRef.current.style.transform = 'scale(1)';
          }
        }
        if (labelRef.current) {
          labelRef.current.style.display = 'none';
        }
      }
    };

    const onLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (sparkRef.current) sparkRef.current.style.opacity = '0';
    };

    // Smooth responsive spark follower loop
    const tick = () => {
      if (isMoving) {
        // Higher lerp factor (0.55) maintains smooth flow without lagging far behind on menu buttons
        sparkX += (mouseX - sparkX) * 0.55;
        sparkY += (mouseY - sparkY) * 0.55;
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
        className="pointer-events-none fixed top-0 left-0 z-[2147483647] rounded-full transition-opacity duration-150"
        style={{
          width: 5,
          height: 5,
          backgroundColor: '#ffffff',
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.95)',
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          willChange: 'transform',
          opacity: 0,
        }}
      />

      {/* ── Outer Gemini Spark Outline — lerp follower container ── */}
      <div
        ref={sparkRef}
        className="pointer-events-none fixed top-0 left-0 z-[2147483646] flex items-center justify-center transition-opacity duration-150"
        style={{
          width: 32,
          height: 32,
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
          willChange: 'transform',
          opacity: 0,
        }}
      >
        <div
          ref={sparkInnerRef}
          className="w-full h-full flex items-center justify-center transition-transform duration-150 ease-out"
          style={{ transform: 'scale(1)', transformOrigin: 'center center' }}
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-full h-full overflow-visible pointer-events-none"
            style={{ 
              animation: 'spin-slow 8s linear infinite', 
              transformOrigin: 'center center',
              filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.75))'
            }}
          >
            <defs>
              <linearGradient id="gemini-cursor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
            <path
              d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
              fill="none"
              stroke="url(#gemini-cursor-grad)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span
          ref={labelRef}
          className="absolute font-jetbrains text-[9px] font-bold text-white uppercase tracking-wider px-1 text-center bg-black/75 rounded-md py-0.5 border border-purple-500/30 whitespace-nowrap pointer-events-none"
          style={{ display: 'none', top: '100%', marginTop: '4px' }}
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
            width: 32,
            height: 32,
            animation: 'cursor-ripple 0.65s ease-out forwards',
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
              fill="none"
              stroke="rgba(168, 85, 247, 0.7)"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      ))}
    </>
  );
};

export default CustomCursor;
