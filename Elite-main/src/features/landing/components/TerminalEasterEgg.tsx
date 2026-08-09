import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X } from 'lucide-react';
import TerminalText from '@/components/common/TerminalText';

// Matrix Rain Effect Component
const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const arabic = 'ضصثقفغعهخحجدطكمنتالبيسشئءؤرلاىةوزظ';
    const letters = arabic.split('');
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0'; // Green text
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30 pointer-events-none" />;
};

export const TerminalEasterEgg: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const secretCode = 'elite';

  useEffect(() => {
    let currentKeys = '';

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Escape') {
        setIsActive(false);
        return;
      }

      // Track exact character typed (works for any language)
      if (e.key.length === 1) {
        currentKeys += e.key.toLowerCase();
        
        // Keep the buffer small
        if (currentKeys.length > 10) {
          currentKeys = currentKeys.substring(currentKeys.length - 10);
        }
        
        // Check if it ends with either of the secret words
        if (currentKeys.endsWith('elite') || currentKeys.endsWith('رؤى')) {
          setIsActive(true);
          currentKeys = ''; // reset after match
        }
      }
    }; // <--- ADDED CLOSING BRACE

    document.addEventListener('keydown', handleKeyDown);
    
    // Fallback: Custom event
    const handleSecret = () => setIsActive(true);
    window.addEventListener('triggerEasterEgg', handleSecret);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('triggerEasterEgg', handleSecret as EventListener);
    };
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-black text-[#0F0] font-jetbrains flex flex-col overflow-hidden"
        >
          {/* Matrix Background */}
          <MatrixRain />

          {/* Terminal Window Overlay */}
          <div className="relative z-10 flex-1 p-6 md:p-12 flex flex-col pointer-events-none">
            <div className="flex justify-between items-center border-b border-[#0F0]/30 pb-4 mb-6">
              <div className="flex items-center gap-3 text-[#0F0]">
                <Terminal className="w-5 h-5" />
                <span className="font-bold tracking-widest uppercase">Elite Mainframe - Override Engaged</span>
              </div>
              <button 
                onClick={() => setIsActive(false)}
                className="w-10 h-10 border border-[#0F0]/50 hover:bg-[#0F0]/10 flex items-center justify-center rounded transition-colors pointer-events-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto mt-10">
              <TerminalText 
                command="./init_elite_protocol.sh"
                speed={30}
                output={[
                  "> ACCESS GRANTED.",
                  "> Welcome to the Elite Developer Network.",
                  "> Analyzing system architecture...",
                  "> Security level: OMEGA.",
                  "> Loading advanced modules...",
                  "> SUCCESS: All systems nominal.",
                  "> ",
                  "> Only the best coders find this place. If you are reading this,",
                  "> you belong here. Contact us at elite@tech.iq",
                  "> ",
                  "> Type 'exit' or press ESC to return to normal space."
                ]}
                className="bg-transparent border-none w-full !px-0"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
