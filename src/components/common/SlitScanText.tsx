import React from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface SlitScanTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const SlitScanText: React.FC<SlitScanTextProps> = ({ text, className = '', delay = 0 }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
  const words = text.split(' ');

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden py-3 -my-3 px-1 -mx-1 align-bottom">
          <motion.span
            className="inline-block origin-bottom"
            initial={{ y: '100%', rotateX: -90, opacity: 0 }}
            animate={isInView ? { y: '0%', rotateX: 0, opacity: 1 } : { y: '100%', rotateX: -90, opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.76, 0, 0.24, 1],
              delay: delay + index * 0.05,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};
