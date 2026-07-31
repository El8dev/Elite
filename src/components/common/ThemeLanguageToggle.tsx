import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCinematicSound } from '@/hooks/useCinematicSound';

export const ThemeLanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();
  const { i18n } = useTranslation();
  const { playHoverTick } = useCinematicSound();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (playHoverTick) playHoverTick();
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    if (playHoverTick) playHoverTick();
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  if (!mounted) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white focus:outline-none"
        aria-label="Toggle Theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === 'dark' ? (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-5 h-5 text-purple-400" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-5 h-5 text-amber-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="relative flex items-center gap-1.5 px-3 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-outfit focus:outline-none"
        aria-label="Toggle Language"
      >
        <Globe className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-semibold mt-0.5">
          {i18n.language === 'ar' ? 'EN' : 'AR'}
        </span>
      </button>
    </div>
  );
};
