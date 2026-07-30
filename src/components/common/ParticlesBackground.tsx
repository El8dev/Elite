import React, { useEffect, useRef } from 'react';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';

export const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const reduceMotion = useReducedMotionPref();

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const particleCount = Math.floor((width * height) / 7500); // Dense, vibrant particle field

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
        this.z = Math.random() * 2.5 + 0.3; // Parallax depth
        this.size = Math.random() * 2.0 + 0.8;
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
        this.baseAlpha = Math.random() * 0.5 + 0.4;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Parallax offset from mouse
        const dx = (mouse.current.x - width / 2) * 0.006 * this.z;
        const dy = (mouse.current.y - height / 2) * 0.006 * this.z;

        let renderX = this.x - dx;
        let renderY = this.y - dy;

        // Wrap around canvas bounds
        if (renderX < 0) this.x += width;
        if (renderX > width) this.x -= width;
        if (renderY < 0) this.y += height;
        if (renderY > height) this.y -= height;
      }

      draw() {
        if (!ctx) return;
        const dx = (mouse.current.x - width / 2) * 0.006 * this.z;
        const dy = (mouse.current.y - height / 2) * 0.006 * this.z;

        const drawX = this.x - dx;
        const drawY = this.y - dy;

        ctx.beginPath();
        let colorStr = `rgba(168, 85, 247, ${this.baseAlpha})`;
        let glowColor = 'rgba(168, 85, 247, 0.6)';

        if (this.colorType === 'cyan') {
          colorStr = `rgba(34, 211, 238, ${this.baseAlpha})`;
          glowColor = 'rgba(34, 211, 238, 0.6)';
        } else if (this.colorType === 'amber') {
          colorStr = `rgba(245, 158, 11, ${this.baseAlpha})`;
          glowColor = 'rgba(245, 158, 11, 0.6)';
        }

        ctx.shadowBlur = this.size > 1.8 ? 10 : 4;
        ctx.shadowColor = glowColor;
        ctx.fillStyle = colorStr;
        ctx.arc(drawX, drawY, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for performance
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
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
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
