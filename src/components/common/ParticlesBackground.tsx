import React, { useEffect, useRef } from 'react';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';

export const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ 
    currX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
    currY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    targetX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, 
    targetY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
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
    const isMobile = isTouch || width < 768;

    if (isMobile) return; // Skip canvas particle loop entirely on mobile
    
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const particleCount = 16; // Lean, high-performance particle count

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;

        const rand = Math.random();
        if (rand < 0.6) {
          this.color = 'rgba(168, 85, 247, 0.45)';
        } else if (rand < 0.85) {
          this.color = 'rgba(34, 211, 238, 0.45)';
        } else {
          this.color = 'rgba(245, 158, 11, 0.4)';
        }
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x += width;
        if (this.x > width) this.x -= width;
        if (this.y < 0) this.y += height;
        if (this.y > height) this.y -= height;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;
    let isPaused = false;
    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        document.body.classList.add('is-scrolling');
      }
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        document.body.classList.remove('is-scrolling');
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
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      document.body.classList.remove('is-scrolling');
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
