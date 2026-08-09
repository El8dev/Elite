import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export const FilmGrain: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9995] opacity-[0.035] mix-blend-overlay overflow-hidden">
      <motion.div
        className="absolute w-[200%] h-[200%] -left-[50%] -top-[50%]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          willChange: 'transform',
        }}
        animate={{
          x: ['0%', '-5%', '5%', '-2%', '0%'],
          y: ['0%', '5%', '-5%', '2%', '0%'],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
        }}
      />
    </div>
  );
};
