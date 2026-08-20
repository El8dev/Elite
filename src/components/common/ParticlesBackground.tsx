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
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const isMobile = width < 640;
    
    canvas.width = width;
    canvas.height = height;
    mouse.current.targetX = width / 2;
    mouse.current.targetY = height / 2;
    mouse.current.currX = width / 2;
    mouse.current.currY = height / 2;

    const particles: Particle[] = [];
    const particleCount = isMobile ? 35 : Math.floor((width * height) / 6500);

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
        this.size = Math.random() * 2.0 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;

        const rand = Math.random();
        if (rand < 0.55) {
          this.colorType = 'violet';
        } else if (rand < 0.85) {
          this.colorType = 'cyan';
        } else {
          this.colorType = 'amber';
        }
        this.baseAlpha = Math.random() * 0.5 + 0.4;
      }

      update(mX: number, mY: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Smooth magnetic push when mouse is close
        const dx = this.x - mX;
        const dy = this.y - mY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 140;

        if (dist < maxDist && dist > 0) {
          const force = (1 - dist / maxDist) * 2.2;
          this.x += (dx / dist) * force;
          this.y += (dy / dist) * force;
        }

        // Clean bounds wrap
        if (this.x < 0) this.x += width;
        if (this.x > width) this.x -= width;
        if (this.y < 0) this.y += height;
        if (this.y > height) this.y -= height;
      }

      draw(mX: number, mY: number, isDark: boolean) {
        if (!ctx) return;
        
        ctx.beginPath();
        let colorStr = isDark 
          ? `rgba(168, 85, 247, ${this.baseAlpha})`
          : `rgba(147, 51, 234, ${Math.min(1, this.baseAlpha + 0.2)})`;
        let glowColor = isDark ? 'rgba(168, 85, 247, 0.55)' : 'rgba(147, 51, 234, 0.4)';

        if (this.colorType === 'cyan') {
          colorStr = isDark 
            ? `rgba(34, 211, 238, ${this.baseAlpha})`
            : `rgba(8, 145, 178, ${Math.min(1, this.baseAlpha + 0.2)})`;
          glowColor = isDark ? 'rgba(34, 211, 238, 0.55)' : 'rgba(8, 145, 178, 0.4)';
        } else if (this.colorType === 'amber') {
          colorStr = isDark 
            ? `rgba(245, 158, 11, ${this.baseAlpha})`
            : `rgba(217, 119, 6, ${Math.min(1, this.baseAlpha + 0.2)})`;
          glowColor = isDark ? 'rgba(245, 158, 11, 0.55)' : 'rgba(217, 119, 6, 0.4)';
        }

        // Optimized lightweight shadow glow
        ctx.shadowBlur = 5;
        ctx.shadowColor = glowColor;

        ctx.fillStyle = colorStr;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // Reset after particle fill

        // Draw soft glowing constellation lines to mouse cursor if near
        const dx = this.x - mX;
        const dy = this.y - mY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 130;

        if (dist < maxDist && mouse.current.active) {
          const lineAlpha = (1 - dist / maxDist) * (isDark ? 0.4 : 0.5);
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

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;

    const render = () => {
      // Smooth lerp mouse coordinates
      mouse.current.currX += (mouse.current.targetX - mouse.current.currX) * 0.08;
      mouse.current.currY += (mouse.current.targetY - mouse.current.currY) * 0.08;

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

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full"
      aria-hidden="true"
    />
  );
};
