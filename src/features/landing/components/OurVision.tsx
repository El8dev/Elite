import React from 'react';
import { useTranslation } from 'react-i18next';

const OurVision: React.FC = () => {
  const { t } = useTranslation();
  const servicesList = t('vision.services', { returnObjects: true }) as string[];

  const features = [
    { text: servicesList[0], color: '#9756A5', img: '/vision_0.webp' },
    { text: servicesList[1], color: '#BA68CB', img: '/vision_1.webp' },
    { text: servicesList[2], color: '#8898F6', img: '/vision_2.webp' },
    { text: servicesList[3], color: '#F688D0', img: '/vision_3.webp' },
    { text: servicesList[4], color: '#F6C188', img: '/vision_4.webp' },
    { text: servicesList[5], color: '#A5F688', img: '/vision_5.webp' },
    { text: servicesList[6], color: '#88E3F6', img: '/vision_6.webp' },
  ];

  return (
    <section className="deck wrap" id="vision">
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
          {features.map((feature, idx) => (
            <article 
              key={idx} 
              className="deck-card reveal" 
              data-delay={idx * 70} 
              style={{ '--acc': feature.color } as React.CSSProperties}
            >
              <div className="deck-card__media">
                <img alt="" decoding="async" loading="lazy" src={feature.img} />
              </div>
              <div aria-hidden="true" className="deck-card__scrim"></div>
              <div className="deck-card__content">
                <span aria-hidden="true" className="deck-card__rule"></span>
                <span className="deck-card__text">
                  {feature.text}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurVision;
