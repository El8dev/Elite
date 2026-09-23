import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardMicroIllustration } from '@/components/ui/CardMicroIllustrations';
import { SERVICE_CARDS } from '@/data/serviceCards';

export const ServicesSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="deck deck--services wrap" id="services">
      <div className="deck-panel reveal">
        <span aria-hidden="true" className="deck-aura deck-aura--1"></span>
        <span aria-hidden="true" className="deck-aura deck-aura--2"></span>
        <span className="deck-brand">EL8 Tech</span>

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
          {SERVICE_CARDS.map((card, idx) => (
            <article key={card.key} className="deck-card deck-card--svc reveal" data-delay={idx * 90}>
              <div className="deck-card__media">
                <CardMicroIllustration name={card.illustration} />
              </div>
              <div className="deck-card__content">
                <h3 className="deck-card__title">{t(`services_section.cards.${card.key}.title`)}</h3>
                <p className="deck-card__desc">{t(`services_section.cards.${card.key}.desc`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
