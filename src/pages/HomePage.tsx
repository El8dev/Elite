import React from 'react';
import OurVision from '@/features/landing/components/OurVision';
import { ServicesSection } from '@/features/landing/components/ServicesSection';
import { PremiumFooter } from '@/components/common/PremiumFooter';
const CustomerReviewsSection = React.lazy(() =>
  import('@/features/landing/components/CustomerReviewsSection').then((m) => ({ default: m.CustomerReviewsSection }))
);
import { Helmet } from 'react-helmet-async';
import { SiteHeader } from '@/components/common/SiteHeader';
import { useTranslation } from 'react-i18next';
import { HeroRedesign } from '@/features/landing/components/HeroRedesign';

import { useRevealAnimations } from '@/hooks/useRevealAnimations';

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  useRevealAnimations();

  return (
    <>
      <Helmet>
        <title>{t('home.meta_title')}</title>
        <meta name="description" content={t('home.subtitle')} />
        <meta property="og:title" content={t('home.meta_title')} />
        <meta property="og:description" content={t('home.subtitle')} />
        <meta property="og:type" content="website" />
        <html lang={i18n.language.startsWith('ar') ? 'ar' : 'en'} />
        <link rel="canonical" href="https://el8.dev/" />
        <meta property="og:url" content="https://el8.dev" />
        <meta property="og:image" content="https://el8.dev/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('home.meta_title')} />
        <meta name="twitter:description" content={t('home.subtitle')} />
        <meta name="twitter:image" content="https://el8.dev/og-image.png" />
        {/* Organization schema lives in index.html so there is exactly one copy. */}
      </Helmet>

      <SiteHeader />


      <main id="top">
        <div id="homeView">
          <HeroRedesign />
          
          <div className="handoff handoff--between reveal">
            <div className="handoff__row">
              <span aria-hidden="true" className="hand hand--bottom handoff__hand handoff__hand--left"></span>
              <div aria-hidden="true" className="handoff__filament handoff__filament--left"></div>
              <div aria-hidden="true" className="handoff__ai">
                <svg viewBox="0 0 24 24" className="handoff__gemini-spark">
                  <defs>
                    <linearGradient id="gemini-spark-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#f43f5e" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
                    fill="none"
                    stroke="url(#gemini-spark-grad-1)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div aria-hidden="true" className="handoff__filament handoff__filament--right"></div>
              <span aria-hidden="true" className="hand hand--bottom handoff__hand handoff__hand--right"></span>
            </div>
          </div>

          <OurVision />
          
          <div className="handoff handoff--between reveal">
            <div className="handoff__row">
              <span aria-hidden="true" className="hand hand--bottom handoff__hand handoff__hand--left"></span>
              <div aria-hidden="true" className="handoff__filament handoff__filament--left"></div>
              <div aria-hidden="true" className="handoff__ai">
                <svg viewBox="0 0 24 24" className="handoff__gemini-spark">
                  <defs>
                    <linearGradient id="gemini-spark-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
                    fill="none"
                    stroke="url(#gemini-spark-grad-2)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div aria-hidden="true" className="handoff__filament handoff__filament--right"></div>
              <span aria-hidden="true" className="hand hand--bottom handoff__hand handoff__hand--right"></span>
            </div>
          </div>

          <ServicesSection />
          <React.Suspense fallback={null}>
            <CustomerReviewsSection />
          </React.Suspense>

          <div className="handoff handoff--closing reveal">
            <div className="handoff__row">
              <span aria-hidden="true" className="hand hand--bottom handoff__hand handoff__hand--left"></span>
              <div aria-hidden="true" className="handoff__filament handoff__filament--left"></div>
              <div aria-hidden="true" className="handoff__ai">
                <svg viewBox="0 0 24 24" className="handoff__gemini-spark">
                  <defs>
                    <linearGradient id="gemini-spark-grad-3" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
                    fill="none"
                    stroke="url(#gemini-spark-grad-3)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div aria-hidden="true" className="handoff__filament handoff__filament--right"></div>
              <span aria-hidden="true" className="hand hand--bottom handoff__hand handoff__hand--right"></span>
            </div>
          </div>
          
        </div>
      </main>

      <PremiumFooter />
    </>
  );
};

export default HomePage;
