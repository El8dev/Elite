import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContactAgencyModal } from '@/features/landing/components/ContactAgencyModal';
import { ClientTrackerModal } from '@/features/projects/components/ClientTrackerModal';

export const PremiumFooter: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  return (
    <>
      <footer className="site wrap--md">
        <div className="cta-card reveal">
          <div className="cta-word">ELITE</div>
          <p className="cta-text">
            {t('footer.brand_desc')}
          </p>
          <button className="cta-btn" onClick={() => setIsModalOpen(true)}>
            <span>{t('footer.start_project')}</span>
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
          </button>
          
          <div className="socials">
            <a aria-label="Instagram" className="social-btn social-btn--insta" href="https://instagram.com/el8dev" rel="noopener noreferrer" target="_blank" title="Instagram: @el8dev">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
              </svg>
            </a>
            <a aria-label="TikTok" className="social-btn social-btn--tiktok" href="https://tiktok.com/@el8.dev" rel="noopener noreferrer" target="_blank" title="TikTok: @el8.dev">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.39-2.9 5.67-1.55 1.13-3.6 1.48-5.46 1.05-1.92-.44-3.56-1.74-4.44-3.51-.78-1.57-.92-3.41-.38-5.11.53-1.68 1.83-3.1 3.44-3.83 1.5-.68 3.25-.8 4.8-.46.03 1.34.02 2.68.03 4.02-1.07-.46-2.39-.41-3.4.24-.91.59-1.4 1.62-1.39 2.7.01 1.05.51 2.06 1.36 2.67.87.62 2.06.74 3.09.31.95-.4 1.66-1.28 1.84-2.31.08-.43.1-.88.09-1.32-.05-5.32-.02-10.64-.04-15.96z"></path>
              </svg>
            </a>
            <a aria-label="Telegram" className="social-btn social-btn--telegram" href="https://t.me/el8dev" rel="noopener noreferrer" target="_blank" title="Telegram: @el8dev">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.304-.346-.108l-6.4 4.024-2.76-.86c-.6-.188-.61-.6.126-.89l10.814-4.17c.5-.188.937.108.846.858z"></path>
              </svg>
            </a>
            <a aria-label="GitHub" className="social-btn social-btn--github" href="https://github.com/el8dev" rel="noopener noreferrer" target="_blank" title="GitHub: @el8dev">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </a>
          </div>
        </div>
        <div className="foot-bottom">
          <p>
            {t('footer.rights', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>

      <ContactAgencyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ClientTrackerModal isOpen={isTrackerOpen} onClose={() => setIsTrackerOpen(false)} />
    </>
  );
};
