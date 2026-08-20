import React from 'react';
import OurVision from '@/features/landing/components/OurVision';
import { PremiumFooter } from '@/components/common/PremiumFooter';
import { ServicesSection } from '@/features/landing/components/ServicesSection';
import { CustomerReviewsSection } from '@/features/landing/components/CustomerReviewsSection';
import { Helmet } from 'react-helmet-async';
import { SiteHeader } from '@/components/common/SiteHeader';
import { useTranslation } from 'react-i18next';
import { SplashIntro } from '@/features/landing/components/SplashIntro';
import { HeroRedesign } from '@/features/landing/components/HeroRedesign';

import { useRevealAnimations } from '@/hooks/useRevealAnimations';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  useRevealAnimations();

  return (
    <>
      <Helmet>
        <title>El8 Tech | {t('home.title_part1')} {t('home.title_part2')}</title>
        <meta name="description" content={t('home.subtitle')} />
        <meta property="og:title" content={`El8 Tech | ${t('home.title_part1')} ${t('home.title_part2')}`} />
        <meta property="og:description" content={t('home.subtitle')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://el8.dev" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "El8 Tech",
            "url": "https://el8.dev",
            "logo": "https://el8.dev/favicon.png",
            "email": "el8dev@gmail.com",
            "sameAs": [
              "https://t.me/el8dev",
              "https://instagram.com/el8dev",
              "https://github.com/el8dev",
              "https://tiktok.com/@el8.dev"
            ],
            "description": "An elite Iraqi development team building rapid, state-of-the-art tech solutions for everyone. We specialize in AI Infrastructure, Web Apps, Desktop (EXE), Mobile (APK), Data Systems, and Hardware solutions."
          })}
        </script>
      </Helmet>

      <SplashIntro />
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
          <CustomerReviewsSection />

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
