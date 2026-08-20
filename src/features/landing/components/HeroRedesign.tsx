import React from 'react';
import { useTranslation } from 'react-i18next';

export const HeroRedesign: React.FC = () => {
  const { t } = useTranslation();
  
  // Use sessionStorage so the state survives HMR and page reloads during the session
  const [hasPlayedEntrance, setHasPlayedEntrance] = React.useState(() => {
    return sessionStorage.getItem('hasPlayedHeroEntrance') === 'true';
  });
  
  const [runAnim, setRunAnim] = React.useState(hasPlayedEntrance);
  const [isDone, setIsDone] = React.useState(hasPlayedEntrance);

  React.useEffect(() => {
    if (hasPlayedEntrance) return;

    const isSplashing = document.documentElement.classList.contains('is-splashing');
    const delay = isSplashing ? 4450 : 0;
    
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setRunAnim(true);
          setHasPlayedEntrance(true);
          sessionStorage.setItem('hasPlayedHeroEntrance', 'true');
        });
      });
      setTimeout(() => setIsDone(true), 2500);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [hasPlayedEntrance]);

  const renderAnimatedLine = (text: string, lineIndex: number, isAccent = false) => {
    const lineStagger = 170;
    const wordStagger = 65;
    const baseDelay = lineIndex * lineStagger;
    
    if (isAccent) {
      return (
        <span className="entry-line-wrap" data-entry-line>
          <span className={`entry-glow ${runAnim ? 'run' : ''}`} style={{ '--d': `${baseDelay + 150}ms` } as React.CSSProperties}></span>
          <span className={`entry-fill entry-fill--accent ${runAnim ? 'run' : ''}`} style={{ '--d': `${baseDelay}ms` } as React.CSSProperties}>
            {text}
          </span>
        </span>
      );
    }

    const words = text.split(' ').filter(w => w.trim() !== '');
    return (
      <span className="entry-line-wrap" data-entry-line>
        <span className={`entry-fill ${runAnim ? 'run' : ''}`}>
          {words.map((word, i) => {
            const d = baseDelay + i * wordStagger;
            return (
              <React.Fragment key={i}>
                <span className="entry-word">
                  <span style={{ '--d': `${d}ms` } as React.CSSProperties}>{word}</span>
                </span>
                {i < words.length - 1 ? ' ' : ''}
              </React.Fragment>
            );
          })}
        </span>
      </span>
    );
  };

  return (
    <>
      <section className="hero wrap">
        <span aria-hidden="true" className="hero-aura"></span>
        <div className={`badge reveal ${hasPlayedEntrance ? 'in' : ''}`} style={{ display: 'flex', width: 'fit-content' }}>
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
            <path d="M2 12h20"></path>
          </svg>
          <span>{t('hero_redesign.badge')}</span>
        </div>
        <h1 className={`entry-block ${isDone ? 'entry-done' : 'is-armed'}`}>
          <span aria-hidden="true">
            {renderAnimatedLine(t('hero_redesign.line1'), 0)}
          </span>
          <br aria-hidden="true"/>
          <span aria-hidden="true">
            {renderAnimatedLine(t('hero_redesign.line2'), 1)}
          </span>
          <br aria-hidden="true"/>
          <span aria-hidden="true">
            {renderAnimatedLine(t('hero_redesign.line3'), 2, true)}
          </span>
        </h1>
        <p className={`hero__text reveal ${hasPlayedEntrance ? 'in' : ''}`} data-delay="140">
          {t('hero_redesign.text')}
        </p>
        <div className={`hero-cta reveal ${hasPlayedEntrance ? 'in' : ''}`} data-delay="220">
          <a className="cta-btn hero-cta__main" href="#projects" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('openProjectsModal')); }}>
            <span aria-hidden="true" className="hand hand--top btn-hand btn-hand--left"></span>
            <span aria-hidden="true" className="hand hand--top btn-hand btn-hand--right"></span>
            <span>{t('hero_redesign.cta_main')}</span>
            <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
          </a>
          <button className="ghost-btn" type="button" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new Event('openContactModal')); }}>
            <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <span>{t('hero_redesign.cta_alt')}</span>
          </button>
        </div>
        <div className="hero__stats">
          <div className={`stat reveal-scale ${hasPlayedEntrance ? 'in' : ''}`} data-delay="0">
            <div className="stat__photo">
              <img alt="" decoding="async" loading="lazy" src="/extracted_img_3.webp"/>
            </div>
            <span className="stat__title">{t('globe.stats_value_1')}</span>
            <span className="stat__sub">{t('globe.stats_label_1')}</span>
          </div>
          <div className="stat-divider"></div>
          <div className={`stat reveal-scale ${hasPlayedEntrance ? 'in' : ''}`} data-delay="180">
            <div className="stat__photo">
              <img alt="" decoding="async" loading="lazy" src="/extracted_img_4.webp"/>
            </div>
            <span className="stat__title">{t('globe.stats_value_2')}</span>
            <span className="stat__sub">{t('globe.stats_label_2')}</span>
          </div>
          <div className="stat-divider"></div>
          <div className={`stat reveal-scale ${hasPlayedEntrance ? 'in' : ''}`} data-delay="360">
            <div className="stat__photo">
              <img alt="" decoding="async" loading="lazy" src="/extracted_img_5.webp"/>
            </div>
            <span className="stat__title">{t('globe.stats_value_3')}</span>
            <span className="stat__sub">{t('globe.stats_label_3')}</span>
          </div>
        </div>
        <a className={`hero-scroll reveal ${hasPlayedEntrance ? 'in' : ''}`} href="#vision">
          <span>↓</span>
        </a>
      </section>
    </>
  );
};
