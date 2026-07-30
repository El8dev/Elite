import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';
import { useCinematicSound } from '@/hooks/useCinematicSound';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per char
  delay?: number; // ms before starting
  className?: string;
  playSound?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 30,
  delay = 500,
  className = '',
  playSound = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const { playHoverTick } = useCinematicSound();

  useEffect(() => {
    if (!isInView) return;

    let i = 0;
    let timer: NodeJS.Timeout;

    const startTyping = () => {
      setIsTyping(true);
      timer = setInterval(() => {
        setDisplayedText((prev) => {
          const nextChar = text.charAt(i);
          if (playSound && nextChar !== ' ') {
            // Play sound selectively to avoid audio overload
            if (i % 3 === 0) playHoverTick(); 
          }
          i++;
          if (i === text.length) {
            clearInterval(timer);
            setIsTyping(false);
          }
          return text.substring(0, i);
        });
      }, speed);
    };

    const delayTimer = setTimeout(startTyping, delay);

    return () => {
      clearTimeout(delayTimer);
      if (timer) clearInterval(timer);
    };
  }, [isInView, text, speed, delay, playSound, playHoverTick]);

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {displayedText}
      {isTyping && (
        <span className="inline-block w-[3px] h-[1em] bg-purple-500 animate-pulse ml-1 align-middle" />
      )}
    </span>
  );
};
