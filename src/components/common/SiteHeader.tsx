import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { useCinematicSound } from '@/hooks/useCinematicSound';

export const SiteHeader: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { playHoverTick } = useCinematicSound();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenDropdown(prev => prev === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    if (playHoverTick) playHoverTick();
    setMobileMenuOpen(false);
    
    if (path.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.querySelector(path)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        if (path === '#top') window.scrollTo({ top: 0, behavior: 'smooth' });
        else document.querySelector(path)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  // Close mobile menu on resize if it's open
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  return (
    <>
      <header className={`site ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-row">
          <a href="#top" className="brand" onClick={(e) => handleLinkClick(e, '#top')}>
            <span className="brand__word">ELITE<span>.</span></span>
          </a>

          <nav className="nav-pill" aria-label="التنقل الرئيسي">
            {/* 1. الرئيسية */}
            <a 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
              href="#top" 
              onClick={(e) => handleLinkClick(e, '#top')}
            >
              <span>{t('nav.home')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
            </a>

            {/* 2. المشاريع */}
            <div className={`dropdown-wrapper ${openDropdown === 'projects' ? 'open' : ''}`}>
              <Link 
                to="/projects"
                className={`nav-link dropdown-toggle ${location.pathname.includes('/projects') ? 'active' : ''}`} 
                aria-expanded={openDropdown === 'projects'}
                onClick={(e) => toggleDropdown(e, 'projects')}
              >
                <span>{t('nav.projects')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon"><path d="m6 9 6 6 6-6"></path></svg>
              </Link>
              <div className="dropdown-menu">
                <a 
                  href="#projects" 
                  className="dropdown-item" 
                  onClick={(e) => {
                    e.preventDefault();
                    window.dispatchEvent(new Event('openProjectsModal'));
                    setOpenDropdown(null);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"></path></svg>
                  <div>
                    <strong>{i18n.language === 'ar' ? 'إضافة مشروع جديد' : 'Add New Project'}</strong>
                    <span>{i18n.language === 'ar' ? 'تقديم طلب مشروع مخصص للفريق' : 'Submit a custom project request'}</span>
                  </div>
                </a>
                <Link 
                  to="/projects" 
                  className="dropdown-item" 
                  onClick={(e) => {
                    if (playHoverTick) playHoverTick();
                    setOpenDropdown(null);
                    setMobileMenuOpen(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18M9 21V9"></path></svg>
                  <div>
                    <strong>{i18n.language === 'ar' ? 'قسم المشاريع' : 'Projects Hub'}</strong>
                    <span>{i18n.language === 'ar' ? 'الانتقال لمركز طلبات المشاريع' : 'Go to project request hub'}</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* 3. تواصل معنا */}
            <div className={`dropdown-wrapper ${openDropdown === 'contact' ? 'open' : ''}`}>
              <button 
                className="nav-link dropdown-toggle" 
                aria-expanded={openDropdown === 'contact'}
                onClick={(e) => toggleDropdown(e, 'contact')}
              >
                <span>{t('nav.contact')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="chevron-icon"><path d="m6 9 6 6 6-6"></path></svg>
              </button>
              <div className="dropdown-menu">
                <a href="https://instagram.com/el8dev" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                  <i className="social-menu-icon social-menu-icon--insta" aria-hidden="true"><svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg></i>
                  <div>
                    <strong>{t('nav.contact_insta')}</strong>
                    <span>@el8dev</span>
                  </div>
                </a>
                <a href="https://tiktok.com/@el8.dev" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                  <i className="social-menu-icon social-menu-icon--tiktok" aria-hidden="true"><svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0h88a121.18 121.18 0 0 0 1.86 22.17A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"></path></svg></i>
                  <div>
                    <strong>{t('nav.contact_tiktok')}</strong>
                    <span>@el8.dev</span>
                  </div>
                </a>
                <a href="https://t.me/el8dev" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                  <i className="social-menu-icon social-menu-icon--telegram" aria-hidden="true"><svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 15.6 252c-22.2-6.9-22.6-22.2 4.6-32.9L418.2 66.4c18.5-6.9 34.7 4.1 28.5 32.2z"></path></svg></i>
                  <div>
                    <strong>{t('nav.contact_telegram')}</strong>
                    <span>t.me/el8dev</span>
                  </div>
                </a>
                <a href="https://github.com/el8dev" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                  <i className="social-menu-icon social-menu-icon--github" aria-hidden="true"><svg viewBox="0 0 496 512" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg></i>
                  <div>
                    <strong>{t('nav.contact_github')}</strong>
                    <span>github.com/el8dev</span>
                  </div>
                </a>
              </div>
            </div>
          </nav>

          <div className="nav-actions">
            <button className={`icon-btn theme-btn ${isFlipping ? 'is-flipping' : ''}`} onClick={toggleTheme} aria-label="Toggle Theme">
              <span className="theme-icon">
                <svg className="tm" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <defs>
                    <radialGradient id="tmHalo" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#F5EFF6" stopOpacity=".55"/>
                      <stop offset="55%" stopColor="#BA68CB" stopOpacity=".22"/>
                      <stop offset="100%" stopColor="#BA68CB" stopOpacity="0"/>
                    </radialGradient>
                    <linearGradient id="tmOrb" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F5EFF6"/>
                      <stop offset="55%" stopColor="#BC87C8"/>
                      <stop offset="100%" stopColor="#9756A5"/>
                    </linearGradient>
                    <linearGradient id="tmOrbNight" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#BC87C8"/>
                      <stop offset="55%" stopColor="#8A4E97"/>
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
            <button className="lang-pill" onClick={toggleLanguage} aria-label="Toggle Language">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                <path d="M2 12h20"></path>
              </svg>
              <span>{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
            </button>
            <button className="burger" onClick={() => setMobileMenuOpen(true)} aria-label="Open Menu">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer open">
          <div className="mobile-drawer__panel open">
            <button className="mobile-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close Menu">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
            <a className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} href="#top" onClick={(e) => handleLinkClick(e, '#top')}>
              <span>{t('nav.home')}</span>
            </a>
            <Link className={`nav-link ${location.pathname.includes('/projects') ? 'active' : ''}`} to="/projects" onClick={() => setMobileMenuOpen(false)}>
              <span>{t('nav.projects')}</span>
            </Link>
            
            <div style={{ width: '100%', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
              <strong style={{ display: 'block', fontSize: '.85rem', color: 'var(--text-2)', marginBottom: '10px' }}>
                {t('nav.contact')}
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="https://instagram.com/el8dev" target="_blank" rel="noopener noreferrer" className="dropdown-item" style={{ padding: '8px 10px' }}>
                  <i className="social-menu-icon social-menu-icon--insta" aria-hidden="true"><svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path></svg></i>
                  <strong>{t('nav.contact_insta')}</strong>
                </a>
                <a href="https://tiktok.com/@el8.dev" target="_blank" rel="noopener noreferrer" className="dropdown-item" style={{ padding: '8px 10px' }}>
                  <i className="social-menu-icon social-menu-icon--tiktok" aria-hidden="true"><svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0h88a121.18 121.18 0 0 0 1.86 22.17A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14Z"></path></svg></i>
                  <strong>{t('nav.contact_tiktok')}</strong>
                </a>
                <a href="https://t.me/el8dev" target="_blank" rel="noopener noreferrer" className="dropdown-item" style={{ padding: '8px 10px' }}>
                  <i className="social-menu-icon social-menu-icon--telegram" aria-hidden="true"><svg viewBox="0 0 448 512" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 15.6 252c-22.2-6.9-22.6-22.2 4.6-32.9L418.2 66.4c18.5-6.9 34.7 4.1 28.5 32.2z"></path></svg></i>
                  <strong>{t('nav.contact_telegram')}</strong>
                </a>
                <a href="https://github.com/el8dev" target="_blank" rel="noopener noreferrer" className="dropdown-item" style={{ padding: '8px 10px' }}>
                  <i className="social-menu-icon social-menu-icon--github" aria-hidden="true"><svg viewBox="0 0 496 512" fill="currentColor" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg></i>
                  <strong>{t('nav.contact_github')}</strong>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
