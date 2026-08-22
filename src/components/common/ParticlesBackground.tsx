import React, { useEffect, useRef } from 'react';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';

export const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ 
    targetX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
    targetY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    currX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    currY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    active: false
  });
  const reduceMotion = useReducedMotionPref();

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const isMobile = isTouch || width < 640;
    
    canvas.width = width;
    canvas.height = height;
    mouse.current.targetX = width / 2;
    mouse.current.targetY = height / 2;
    mouse.current.currX = width / 2;
    mouse.current.currY = height / 2;

    const particles: Particle[] = [];
    const particleCount = isMobile ? 20 : Math.min(60, Math.floor((width * height) / 9000));

    class Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      speedX: number;
      speedY: number;
      colorType: 'violet' | 'cyan' | 'amber';
      baseAlpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * 2.5 + 0.3;
        this.size = Math.random() * 1.8 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = (Math.random() - 0.5) * 0.25;

        const rand = Math.random();
        if (rand < 0.55) {
          this.colorType = 'violet';
        } else if (rand < 0.85) {
          this.colorType = 'cyan';
        } else {
          this.colorType = 'amber';
        }
        this.baseAlpha = Math.random() * 0.45 + 0.35;
      }

      update(mX: number, mY: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Smooth magnetic push when mouse is close (desktop only)
        if (!isTouch && mouse.current.active) {
          const dx = this.x - mX;
          const dy = this.y - mY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 120;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 1.8;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
          }
        }

        // Clean bounds wrap
        if (this.x < 0) this.x += width;
        if (this.x > width) this.x -= width;
        if (this.y < 0) this.y += height;
        if (this.y > height) this.y -= height;
      }

      draw(mX: number, mY: number, isDark: boolean) {
        if (!ctx) return;
        
        let coreColor = isDark 
          ? `rgba(192, 132, 252, ${Math.min(1, this.baseAlpha + 0.35)})`
          : `rgba(147, 51, 234, ${Math.min(1, this.baseAlpha + 0.35)})`;
        let haloColor = isDark
          ? `rgba(168, 85, 247, ${this.baseAlpha * 0.45})`
          : `rgba(147, 51, 234, ${this.baseAlpha * 0.35})`;

        if (this.colorType === 'cyan') {
          coreColor = isDark 
            ? `rgba(34, 211, 238, ${Math.min(1, this.baseAlpha + 0.35)})`
            : `rgba(8, 145, 178, ${Math.min(1, this.baseAlpha + 0.35)})`;
          haloColor = isDark
            ? `rgba(34, 211, 238, ${this.baseAlpha * 0.45})`
            : `rgba(8, 145, 178, ${this.baseAlpha * 0.35})`;
        } else if (this.colorType === 'amber') {
          coreColor = isDark 
            ? `rgba(251, 191, 36, ${Math.min(1, this.baseAlpha + 0.35)})`
            : `rgba(217, 119, 6, ${Math.min(1, this.baseAlpha + 0.35)})`;
          haloColor = isDark
            ? `rgba(245, 158, 11, ${this.baseAlpha * 0.45})`
            : `rgba(217, 119, 6, ${this.baseAlpha * 0.35})`;
        }

        // Pass 1: Soft outer neon halo (simulates shadowBlur efficiently)
        ctx.beginPath();
        ctx.fillStyle = haloColor;
        ctx.arc(this.x, this.y, this.size * 2.6, 0, Math.PI * 2);
        ctx.fill();

        // Pass 2: High-contrast core dot
        ctx.beginPath();
        ctx.fillStyle = coreColor;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw constellation lines to mouse cursor if near on desktop
        if (!isTouch && mouse.current.active) {
          const dx = this.x - mX;
          const dy = this.y - mY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * (isDark ? 0.45 : 0.55);
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mX, mY);
            ctx.strokeStyle = this.colorType === 'cyan' 
              ? (isDark ? `rgba(34, 211, 238, ${lineAlpha})` : `rgba(8, 145, 178, ${lineAlpha})`)
              : (isDark ? `rgba(168, 85, 247, ${lineAlpha})` : `rgba(147, 51, 234, ${lineAlpha})`);
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;
    let isPaused = false;

    const render = () => {
      if (isPaused) return;

      if (!isTouch) {
        mouse.current.currX += (mouse.current.targetX - mouse.current.currX) * 0.08;
        mouse.current.currY += (mouse.current.targetY - mouse.current.currY) * 0.08;
      }

      ctx.clearRect(0, 0, width, height);

      const mX = mouse.current.currX;
      const mY = mouse.current.currY;
      const isDark = document.documentElement.classList.contains('dark');

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mX, mY);
        particles[i].draw(mX, mY, isDark);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.targetX = e.clientX;
      mouse.current.targetY = e.clientY;
      mouse.current.active = true;
    };

    const handleMouseLeave = () => {
      mouse.current.active = false;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        cancelAnimationFrame(animationFrameId);
      } else {
        if (isPaused) {
          isPaused = false;
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (!isTouch) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (!isTouch) {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      aria-hidden="true"
    />
  );
};

