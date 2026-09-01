import React, { useEffect, useRef } from 'react';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';

export const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const reduceMotion = useReducedMotionPref();

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const getParticleCount = (w: number) => {
      if (w > 1200) return 45;
      if (w > 768) return 30;
      return 16;
    };

    const palette = [
      { fill: 'rgba(192, 132, 252, 0.85)', glow: 'rgba(168, 85, 247, 0.8)' }, // Purple
      { fill: 'rgba(56, 189, 248, 0.85)', glow: 'rgba(14, 165, 233, 0.8)' },  // Cyan
      { fill: 'rgba(251, 191, 36, 0.85)', glow: 'rgba(245, 158, 11, 0.8)' },  // Amber
      { fill: 'rgba(244, 63, 94, 0.8)', glow: 'rgba(225, 29, 72, 0.75)' },   // Rose
    ];

    class Particle {
      x: number;
      y: number;
      baseSize: number;
      size: number;
      vx: number;
      vy: number;
      color: string;
      glowColor: string;
      alpha: number;
      pulseSpeed: number;
      pulseAngle: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseSize = Math.random() * 1.8 + 1.2;
        this.size = this.baseSize;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;

        const p = palette[Math.floor(Math.random() * palette.length)];
        this.color = p.fill;
        this.glowColor = p.glow;
        this.alpha = Math.random() * 0.4 + 0.6;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseAngle = Math.random() * Math.PI * 2;
      }

      update() {
        this.pulseAngle += this.pulseSpeed;
        this.size = this.baseSize + Math.sin(this.pulseAngle) * 0.5;

        // Subtle cursor repulsion
        if (mouseRef.current.active) {
          const dx = this.x - mouseRef.current.x;
          const dy = this.y - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);
          const maxDist = 120;
          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 0.8;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
          }
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.glowColor;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    let particles: Particle[] = [];
    const count = getParticleCount(width);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    let animationFrameId: number;
    let isPaused = false;
    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
      }
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = () => {
      if (isPaused) return;

      if (!isScrolling) {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      const targetCount = getParticleCount(width);
      if (particles.length !== targetCount) {
        particles = [];
        for (let i = 0; i < targetCount; i++) {
          particles.push(new Particle());
        }
      }
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

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
