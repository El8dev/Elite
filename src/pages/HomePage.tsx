import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import OurVision from '@/features/landing/components/OurVision';
import { PremiumFooter } from '@/components/common/PremiumFooter';
import { ServicesSection } from '@/features/landing/components/ServicesSection';
import { InteractiveGlobe } from '@/features/landing/components/InteractiveGlobe';
import { CustomerReviewsSection } from '@/features/landing/components/CustomerReviewsSection';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import { Helmet } from 'react-helmet-async';
import { SiteHeader } from '@/components/common/SiteHeader';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const reduceMotion = useReducedMotionPref();
  const { t } = useTranslation();
  
  // Dynamic Shifting Background Coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, reduceMotion]);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const xPercent = useTransform(springX, [0, window.innerWidth || 1000], [40, 60]);
  const yPercent = useTransform(springY, [0, window.innerHeight || 1000], [40, 60]);
  const bgTemplate = useMotionTemplate`radial-gradient(circle at ${xPercent}% ${yPercent}%, rgba(139,92,246,0.06) 0%, rgba(99,102,241,0.03) 40%, transparent 70%)`;

  return (
    <div className="relative min-h-screen bg-transparent text-foreground selection:bg-primary/30 selection:text-foreground font-sans overflow-x-hidden">
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

      {!reduceMotion && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-0"
          style={{ background: bgTemplate }}
        />
      )}

      <SiteHeader />

      <main className="relative z-10 pt-24 pb-10">
        <InteractiveGlobe />
      </main>

      <OurVision />
      
      <ServicesSection />
      <CustomerReviewsSection />
      <PremiumFooter />
    </div>
  );
};

export default HomePage;
