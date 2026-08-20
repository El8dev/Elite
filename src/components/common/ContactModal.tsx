import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ContactModal: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      document.body.classList.add('overlay-open');
    };
    
    window.addEventListener('openContactModal', handleOpen);
    
    return () => {
      window.removeEventListener('openContactModal', handleOpen);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    document.body.classList.remove('overlay-open');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className={`projects-modal-backdrop active`} 
      id="contactModal" 
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="projects-modal relative overflow-hidden" style={{ maxWidth: '640px' }}>
        {/* Ambient mesh background glow spheres inside modal */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl" />

        <button 
          className="projects-modal-close" 
          id="closeContactModal" 
          aria-label={t('drawer_close_aria') || 'Close'}
          onClick={handleClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="badge" style={{ display: 'inline-flex', width: 'fit-content', marginBottom: '12px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span>{t('nav.contact')}</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '8px' }}>
            منصات <span className="grad">التواصل الرسمية</span>
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '.92rem', lineHeight: 1.7 }}>
            اختر المنصة المناسبة للتواصل المباشر مع فريق El8 التقني.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {/* Instagram Card */}
          <a 
            href="https://instagram.com/el8dev" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] dark:bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-pink-500/60 hover:shadow-[0_0_25px_rgba(225,48,108,0.35)] transition-all duration-300 hover:-translate-y-1 text-white"
            style={{ textDecoration: 'none' }}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg shadow-pink-500/25 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </div>
            <div>
              <strong className="block text-sm font-extrabold text-white group-hover:text-pink-400 transition-colors">{t('nav.contact_insta')}</strong>
              <span className="text-xs text-slate-400">@el8dev</span>
            </div>
          </a>

          {/* TikTok Card */}
          <a 
            href="https://tiktok.com/@el8.dev" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] dark:bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(0,242,254,0.35)] transition-all duration-300 hover:-translate-y-1 text-white"
            style={{ textDecoration: 'none' }}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-400 via-slate-900 to-rose-500 text-white shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-2.83V7.58a6.34 6.34 0 0 0-5.11 6.16A6.34 6.34 0 0 0 10.7 20a6.34 6.34 0 0 0 6.34-6.34V9.37a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-2.22-.8s0 0 0 0z"></path></svg>
            </div>
            <div>
              <strong className="block text-sm font-extrabold text-white group-hover:text-cyan-400 transition-colors">{t('nav.contact_tiktok')}</strong>
              <span className="text-xs text-slate-400">@el8.dev</span>
            </div>
          </a>

          {/* Telegram Card */}
          <a 
            href="https://t.me/el8dev" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] dark:bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-sky-400/60 hover:shadow-[0_0_25px_rgba(42,171,238,0.35)] transition-all duration-300 hover:-translate-y-1 text-white"
            style={{ textDecoration: 'none' }}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/25 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.304-.346-.108l-6.4 4.024-2.76-.86c-.6-.188-.61-.6.126-.89l10.814-4.17c.5-.188.937.108.846.858z"></path></svg>
            </div>
            <div>
              <strong className="block text-sm font-extrabold text-white group-hover:text-sky-400 transition-colors">{t('nav.contact_telegram')}</strong>
              <span className="text-xs text-slate-400">t.me/el8dev</span>
            </div>
          </a>

          {/* GitHub Card */}
          <a 
            href="https://github.com/el8dev" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] dark:bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-purple-400/60 hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] transition-all duration-300 hover:-translate-y-1 text-white"
            style={{ textDecoration: 'none' }}
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            </div>
            <div>
              <strong className="block text-sm font-extrabold text-white group-hover:text-purple-400 transition-colors">{t('nav.contact_github')}</strong>
              <span className="text-xs text-slate-400">github.com/el8dev</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
