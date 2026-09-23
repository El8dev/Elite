import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardMicroIllustration } from '@/components/ui/CardMicroIllustrations';
import { VISION_CARDS } from '@/data/serviceCards';

const OurVision: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="deck wrap" id="vision">
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
            {t('vision.kicker')}
          </span>
          <h2 className="deck-title reveal" data-delay="80">
            {t('vision.title')}
          </h2>
          <p className="deck-sub reveal" data-delay="150">
            {t('vision.subtitle')}
          </p>
        </header>

        <div className="deck-grid deck-grid--vision">
          {VISION_CARDS.map((card, idx) => (
            <article key={card.key} className="deck-card reveal" data-delay={idx * 70}>
              <div className="deck-card__media">
                <CardMicroIllustration name={card.illustration} />
              </div>
              <div className="deck-card__content">
                <h3 className="deck-card__title">{t(`vision.cards.${card.key}.title`)}</h3>
                <p className="deck-card__desc">{t(`vision.cards.${card.key}.desc`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurVision;
