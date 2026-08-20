import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import { useCinematicSound } from '@/hooks/useCinematicSound';

/**
 * ThemeLanguageToggle
 * Renders the exact same theme-toggle (icon-btn theme-btn) and language pill
 * (lang-pill) buttons used inside SiteHeader — so all pages look identical.
 *
 * IMPORTANT: gradient IDs must match those in redesign.css selectors
 * (tmOrbNight, tmOrb, tmHalo) — do NOT rename them.
 */
export const ThemeLanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme } = useTheme();
  const { i18n } = useTranslation();
  const { playHoverTick } = useCinematicSound();
  const [mounted, setMounted] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (playHoverTick) playHoverTick();
    document.documentElement.classList.add('theme-transitioning');
    setTheme(theme === 'dark' ? 'light' : 'dark');
    setIsFlipping(true);
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
      setIsFlipping(false);
    }, 150);
  };

  const toggleLanguage = () => {
    if (playHoverTick) playHoverTick();
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  if (!mounted) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Theme Toggle — identical CSS classes + SVG to SiteHeader */}
      <button
        className={`icon-btn theme-btn ${isFlipping ? 'is-flipping' : ''}`}
        onClick={toggleTheme}
        aria-label="Toggle Theme"
      >
        <span className="theme-icon">
          <svg className="tm" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <defs>
              {/* IDs must stay as tmHalo / tmOrb / tmOrbNight — redesign.css targets them */}
              <radialGradient id="tmHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#F5EFF6" stopOpacity=".55"/>
                <stop offset="55%"  stopColor="#BA68CB" stopOpacity=".22"/>
                <stop offset="100%" stopColor="#BA68CB" stopOpacity="0"/>
              </radialGradient>
              <linearGradient id="tmOrb" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="#F5EFF6"/>
                <stop offset="55%"  stopColor="#BC87C8"/>
                <stop offset="100%" stopColor="#9756A5"/>
              </linearGradient>
              <linearGradient id="tmOrbNight" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor="#BC87C8"/>
                <stop offset="55%"  stopColor="#8A4E97"/>
                <stop offset="100%" stopColor="#5B3564"/>
              </linearGradient>
              <mask id="tmMask">
                <circle cx="24" cy="24" r="9.4" fill="#fff"/>
                <circle className="tm-bite" cx="24" cy="24" r="8.2" fill="#000"/>
              </mask>
            </defs>
            <circle className="tm-halo" cx="24" cy="24" r="23" fill="url(#tmHalo)"/>
            <g className="tm-rays" fill="url(#tmOrb)">
              <path d="M23.20 12.63L24.00 5.60L24.80 12.63ZM29.00 13.75L33.20 8.07L30.37 14.55ZM33.45 17.63L39.93 14.80L34.25 19.00ZM35.37 23.20L42.40 24.00L35.37 24.80ZM34.25 29.00L39.93 33.20L33.45 30.37ZM30.37 33.45L33.20 39.93L29.00 34.25ZM24.80 35.37L24.00 42.40L23.20 35.37ZM19.00 34.25L14.80 39.93L17.63 33.45ZM14.55 30.37L8.07 33.20L13.75 29.00ZM12.63 24.80L5.60 24.00L12.63 23.20ZM13.75 19.00L8.07 14.80L14.55 17.63ZM17.63 14.55L14.80 8.07L19.00 13.75Z"/>
            </g>
            <circle className="tm-orb" cx="24" cy="24" r="9.4" fill="url(#tmOrb)" mask="url(#tmMask)"/>
          </svg>
        </span>
      </button>

      {/* Language Toggle — identical to SiteHeader lang-pill */}
      <button className="lang-pill" onClick={toggleLanguage} aria-label="Toggle Language">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
          <path d="M2 12h20"/>
        </svg>
        <span>{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
      </button>
    </div>
  );
};
