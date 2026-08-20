import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Instagram } from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const telegramUrl = "https://t.me/el8dev";
  const instagramUrl = "https://instagram.com/el8dev";

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="flex flex-col gap-3 mb-3"
          >
            {/* Instagram Button */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-pink-500/40 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:border-pink-400 hover:shadow-[0_0_30px_rgba(236,72,153,0.55)] hover:scale-105 transition-all duration-300 decoration-none"
              style={{ textDecoration: 'none' }}
            >
              <span className="font-bold text-xs tracking-wider text-pink-300 group-hover:text-white transition-colors">INSTAGRAM</span>
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md">
                <Instagram className="w-4 h-4" />
              </div>
            </a>

            {/* Telegram Button */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-purple-500/40 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.55)] hover:scale-105 transition-all duration-300 decoration-none"
              style={{ textDecoration: 'none' }}
            >
              <span className="font-bold text-xs tracking-wider text-purple-300 group-hover:text-white transition-colors">TELEGRAM</span>
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.304-.346-.108l-6.4 4.024-2.76-.86c-.6-.188-.61-.6.126-.89l10.814-4.17c.5-.188.937.108.846.858z" />
                </svg>
              </div>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleOpen}
        className="flex items-center justify-center w-14 h-14 bg-slate-950/85 backdrop-blur-xl border border-purple-500/50 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.45)] hover:border-purple-400 hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] hover:scale-105 transition-all duration-300 text-purple-300 hover:text-white"
        aria-label="Live Chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

export default LiveChatWidget;
