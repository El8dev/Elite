import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'motion/react';

interface MagneticProps {
  children: React.ReactNode;
  stiffness?: number;
  damping?: number;
  mass?: number;
  strength?: number;
}

export const Magnetic: React.FC<MagneticProps> = ({ 
  children, 
  stiffness = 150, 
  damping = 15, 
  mass = 0.1,
  strength = 0.5 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { stiffness, damping, mass };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate distance from center
    x.set((clientX - centerX) * strength);
    y.set((clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className="relative flex items-center justify-center cursor-pointer"
    >
      {children}
    </motion.div>
  );
};
