import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Magnetic } from '@/components/common/Magnetic';
import { useCinematicSound } from '@/hooks/useCinematicSound';
import { EliteLogo } from '@/components/common/EliteLogo';
import { ArrowLeft, Menu, X } from 'lucide-react';

import { ThemeLanguageToggle } from '@/components/common/ThemeLanguageToggle';
import { useTranslation } from 'react-i18next';

const NAV_ITEMS = [
  { nameKey: 'nav.home', path: '/' },
  { nameKey: 'nav.projects', path: '/projects' },
  { nameKey: 'nav.developers', path: '/developers' },
  { nameKey: 'nav.masterpieces', path: '/masterpieces' },
  { nameKey: 'nav.articles', path: '/articles' },
];

export const SiteHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { playHoverTick } = useCinematicSound();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogoClick = () => {
    if (playHoverTick) playHoverTick();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 z-[60] w-full px-4 py-3 md:px-8 md:py-5 bg-gradient-to-b from-background/95 via-background/80 to-transparent backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Logo */}
        <Magnetic strength={0.2}>
          <button
            onClick={handleLogoClick}
            dir="ltr"
            className="group relative flex items-center gap-3 focus:outline-none transition-transform duration-300 hover:scale-[1.03]"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#6366F1]/20 shadow-[0_0_20px_rgba(139,92,246,0.15)] border border-purple-500/30">
               <EliteLogo fill="#8B5CF6" className="w-5 h-5 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
            </div>
            <span className="font-outfit text-lg font-bold tracking-widest text-foreground">
              ELITE<span className="text-[#8B5CF6]">.</span>
            </span>
          </button>
        </Magnetic>

        {/* Desktop Nav Links & Actions */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-card/70 border border-border/50 backdrop-blur-xl shadow-lg" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Magnetic key={item.path} strength={0.15}>
                  <Link
                    to={item.path}
                    onMouseEnter={() => { if (playHoverTick) playHoverTick(); }}
                    className={`relative px-4 py-2 min-h-[38px] inline-flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-300 ${i18n.language === 'ar' ? 'font-alexandria' : 'font-outfit'} focus:outline-none group ${
                      isActive ? 'text-foreground font-bold' : 'text-muted-foreground hover:text-foreground'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <span>{t(item.nameKey)}</span>
                      <ArrowLeft className="w-3.5 h-3.5 opacity-0 transition-all duration-300 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-pill"
                        className="absolute inset-0 z-0 rounded-full bg-purple-600/20 dark:bg-purple-600/30 border border-purple-500/60 shadow-[0_0_22px_rgba(168,85,247,0.4)] backdrop-blur-md"
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 z-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-purple-600/15 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]" />
                    )}
                  </Link>
                </Magnetic>
              );
            })}
          </nav>

          <div className="h-6 w-px bg-border/50" />

          <Magnetic strength={0.2}>
            <Link
              to="/login"
              onMouseEnter={() => { if (playHoverTick) playHoverTick(); }}
              className={`relative px-5 py-2 min-h-[40px] inline-flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-300 ${i18n.language === 'ar' ? 'font-alexandria' : 'font-outfit'} focus:outline-none group text-foreground dark:text-white border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 shadow-[0_0_20px_-4px_rgba(139,92,246,0.3)]`}
            >
              {t('nav.login')}
            </Link>
          </Magnetic>

          <ThemeLanguageToggle />
        </div>

        {/* Mobile Action Trigger Group */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeLanguageToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-card border border-border/80 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="md:hidden overflow-hidden mt-3 rounded-2xl bg-card/95 border border-border/80 backdrop-blur-2xl p-4 shadow-2xl"
          >
            <div className="flex flex-col space-y-2">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                      isActive ? 'bg-primary/15 text-primary border border-primary/20' : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    <span>{t(item.nameKey)}</span>
                    {isActive && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-border/60">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 rounded-xl font-bold text-center text-white bg-gradient-to-r from-purple-600 to-indigo-600 block shadow-md"
                >
                  {t('nav.login')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
