import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SiteHeader } from '@/components/common/SiteHeader';
import { TechBlogSection } from '@/features/landing/components/TechBlogSection';
import { PremiumFooter } from '@/components/common/PremiumFooter';

import { useTranslation } from 'react-i18next';

const ArticlesPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-[#030303] selection:bg-[#8B5CF6]/30 selection:text-white font-sans overflow-x-hidden flex flex-col">
      <Helmet>
        <title>Elite Code | {t('nav.articles')}</title>
        <meta name="description" content={t('tech_blog.subtitle')} />
      </Helmet>

      <SiteHeader />

      <main className="relative z-10 flex-grow pt-24 pb-16">
        <TechBlogSection />
      </main>

      <PremiumFooter />
    </div>
  );
};

export default ArticlesPage;
