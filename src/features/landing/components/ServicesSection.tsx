import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardMicroIllustration } from '@/components/ui/CardMicroIllustrations';

export const ServicesSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="deck deck--services wrap" id="services">
      <div className="deck-panel reveal">
        <span aria-hidden="true" className="deck-aura deck-aura--1"></span>
        <span aria-hidden="true" className="deck-aura deck-aura--2"></span>
        <span className="deck-brand">El8 Tech</span>
        
        <header className="deck-head">
          <span aria-hidden="true" className="deck-head__mark">
            <svg fill="none" viewBox="0 0 64 64">
              <path d="M32 17.5 45 25v15L32 47.5 19 40V25l13-7.5Z" fill="currentColor" opacity=".16"></path>
              <path d="M32 4 56 18v28L32 60 8 46V18L32 4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6"></path>
              <path d="M32 4v56M8 18l48 28M56 18 8 46" opacity=".4" stroke="currentColor" strokeWidth=".8"></path>
              <circle cx="32" cy="32" fill="currentColor" r="3.4"></circle>
            </svg>
          </span>
          <span className="deck-kicker reveal" data-delay="0">
            {t('services_section.badge')}
          </span>
          <h2 className="deck-title reveal" data-delay="80">
            {t('services_section.title1')} <span className="grad">{t('services_section.title2')}</span>
          </h2>
          <p className="deck-sub reveal" data-delay="150">
            {t('services_section.subtitle')}
          </p>
        </header>
        
        <div className="deck-grid deck-grid--services">
          
          <article className="deck-card deck-card--svc reveal" data-delay="0" style={{ '--acc': '#F59E0B' } as React.CSSProperties}>
            <div className="deck-card__media">
              <CardMicroIllustration color="#F59E0B" type="app" />
            </div>
            <div aria-hidden="true" className="deck-card__scrim"></div>
            <div className="deck-card__content">
              <span className="deck-card__icon">
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  <path d="M4 5.4h16a1 1 0 0 1 1 1V9H3V6.4a1 1 0 0 1 1-1Z" fill="currentColor" opacity=".24"></path>
                  <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 15.5v-9ZM3 9h18M8 21h8M12 18v3M9.5 12l-1.6 1.6L9.5 15.2M14.5 12l1.6 1.6-1.6 1.6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7"></path>
                </svg>
              </span>
              <h3 className="deck-card__title">
                {t('services_section.web_dev')}
              </h3>
              <p className="deck-card__desc">
                {t('services_section.web_dev_desc')}
              </p>
            </div>
          </article>
          
          <article className="deck-card deck-card--svc reveal" data-delay="90" style={{ '--acc': '#10B981' } as React.CSSProperties}>
            <div className="deck-card__media">
              <CardMicroIllustration color="#10B981" type="analytics" />
            </div>
            <div aria-hidden="true" className="deck-card__scrim"></div>
            <div className="deck-card__content">
              <span className="deck-card__icon">
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  <path d="M4 6.4h16a1 1 0 0 1 1 1V10H3V7.4a1 1 0 0 1 1-1Z" fill="currentColor" opacity=".24"></path>
                  <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9ZM3 10h18M8 5V3M16 5V3M7 14h2M7 10h2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7"></path>
                </svg>
              </span>
              <h3 className="deck-card__title">
                {t('services_section.business_sys')}
              </h3>
              <p className="deck-card__desc">
                {t('services_section.business_sys_desc')}
              </p>
            </div>
          </article>

          <article className="deck-card deck-card--svc reveal" data-delay="180" style={{ '--acc': '#F43F5E' } as React.CSSProperties}>
            <div className="deck-card__media">
              <CardMicroIllustration color="#F43F5E" type="design" />
            </div>
            <div aria-hidden="true" className="deck-card__scrim"></div>
            <div className="deck-card__content">
              <span className="deck-card__icon">
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  <path d="M5 8.4h14a1 1 0 0 1 1 1V12H4V9.4a1 1 0 0 1 1-1Z" fill="currentColor" opacity=".24"></path>
                  <path d="M4 9.5A2.5 2.5 0 0 1 6.5 7h11A2.5 2.5 0 0 1 20 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-8ZM4 12h16M12 7V4M8 12v3M16 12v3M10.5 15l1.5 1.5L13.5 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7"></path>
                </svg>
              </span>
              <h3 className="deck-card__title">
                {t('services_section.uiux')}
              </h3>
              <p className="deck-card__desc">
                {t('services_section.uiux_desc')}
              </p>
            </div>
          </article>

          <article className="deck-card deck-card--svc reveal" data-delay="270" style={{ '--acc': '#8B5CF6' } as React.CSSProperties}>
            <div className="deck-card__media">
              <CardMicroIllustration color="#8B5CF6" type="terminal" />
            </div>
            <div aria-hidden="true" className="deck-card__scrim"></div>
            <div className="deck-card__content">
              <span className="deck-card__icon">
                <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
                  <path d="M4 10.4h16a1 1 0 0 1 1 1V14H3v-2.6a1 1 0 0 1 1-1Z" fill="currentColor" opacity=".24"></path>
                  <path d="M3 11.5A2.5 2.5 0 0 1 5.5 9h13A2.5 2.5 0 0 1 21 11.5v6a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-6ZM3 14h18M12 9V6M9 6h6M8 14v3M16 14v3M12 14v3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7"></path>
                </svg>
              </span>
              <h3 className="deck-card__title">
                {t('services_section.ai_data')}
              </h3>
              <p className="deck-card__desc">
                {t('services_section.ai_data_desc')}
              </p>
            </div>
          </article>
          
        </div>
      </div>
    </section>
  );
};
