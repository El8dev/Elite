import React from 'react';
import { motion } from 'motion/react';

export const InfiniteMarquee: React.FC = () => {
  const marqueeText = "INNOVATION   MASTERPIECES   ENGINEERING   CREATIVITY   ";
  
  return (
    <div className="fixed bottom-0 left-0 w-full overflow-hidden whitespace-nowrap pointer-events-none z-0 opacity-[0.03]">
      <motion.div
        className="inline-block text-[15vw] leading-none font-black tracking-tighter uppercase font-outfit"
        style={{ willChange: 'transform' }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {marqueeText}
        {marqueeText}
      </motion.div>
    </div>
  );
};
