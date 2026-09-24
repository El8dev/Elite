import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, CalendarDays, Sparkles } from 'lucide-react';
import { getFeaturedWork } from '@/data/featuredWork';
import { HIGHLIGHT_ICONS, PLATFORM_ICONS, ROADMAP_ICONS, stackIcon } from '@/features/projects/workIcons';
import { SiteHeader } from '@/components/common/SiteHeader';
import { PremiumFooter } from '@/components/common/PremiumFooter';

const SITE = 'https://el8.dev';
const FALLBACK_COVER = '/images/placeholder-project.svg';

/**
 * A case study for one of the studio's own shipped platforms.
 *
 * Every word comes from the bundle rather than a request, so the page is fully
 * present in the prerendered HTML: this is the page that has to rank for what
 * the product actually does.
 */
const CaseStudyPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { t, i18n } = useTranslation();
  const work = projectId ? getFeaturedWork(projectId) : undefined;

  // ProjectRoute only mounts this for a known slug; guard so the types hold.
  if (!work) return null;

  const url = `${SITE}/project/${work.slug}`;
  const title = t(`work.${work.slug}.title`);
  const metaTitle = t(`work.${work.slug}.meta_title`);
  const metaDesc = t(`work.${work.slug}.meta_desc`);

  return (
    <div className="relative min-h-screen bg-transparent text-foreground font-sans overflow-x-hidden">
      <Helmet>
        <html lang={i18n.language.startsWith('ar') ? 'ar' : 'en'} />
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${SITE}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: title,
            url: work.liveUrl,
            applicationCategory: 'EducationalApplication',
            operatingSystem: work.platforms.map((p) => t(`work.platforms.${p}`)).join(', '),
            inLanguage: 'ar',
            description: metaDesc,
            author: { '@type': 'Organization', name: 'EL8 Tech', url: SITE },
          })}
        </script>
      </Helmet>

      <SiteHeader />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pt-24 pb-24 sm:px-6 md:px-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 font-outfit text-sm font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          <span aria-hidden="true">←</span> {t('work.back')}
        </Link>

        {/* ---------------------------------------------------------- hero */}
        <header className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="min-w-0">
            <p className="font-outfit text-sm font-semibold tracking-wide text-primary">
              {t(`work.${work.slug}.short`)}
            </p>
            <h1 className="mt-3 font-outfit text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-xl font-outfit text-base leading-[1.9] text-muted-foreground sm:text-lg">
              {t(`work.${work.slug}.intro`)}
            </p>

            <a
              href={work.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-outfit text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {t('work.visit')}
              <span className="opacity-80">{work.displayUrl}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <figure className="relative min-w-0">
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/20 via-transparent to-transparent blur-2xl"
            />
            <img
              src={work.image}
              alt={t('work.cover_alt', { name: title })}
              width={1280}
              height={800}
              loading="eager"
              decoding="async"
              className="relative w-full rounded-2xl border border-border bg-card object-cover shadow-2xl"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (!img.src.endsWith(FALLBACK_COVER)) img.src = FALLBACK_COVER;
              }}
            />
          </figure>
        </header>

        {/* --------------------------------------------------------- facts */}
        <section className="mt-14 grid gap-4 sm:grid-cols-3" aria-label={t('work.what_we_built')}>
          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <h2 className="flex items-center gap-2 font-outfit text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
              {t('work.year_label')}
            </h2>
            <p className="mt-3 font-outfit text-2xl font-bold text-foreground">{work.year}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <h2 className="font-outfit text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('work.platforms_label')}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {work.platforms.map((key) => {
                const Icon = PLATFORM_ICONS[key];
                return (
                  <li
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 font-outfit text-xs font-semibold text-foreground/90"
                  >
                    {Icon && <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}
                    {t(`work.platforms.${key}`)}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <h2 className="font-outfit text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('work.stack_label')}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {work.stack.map((tech) => {
                const Icon = stackIcon(tech);
                return (
                  <li
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 font-outfit text-xs font-semibold text-foreground/90"
                  >
                    <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    {tech}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------ what we built */}
        <section className="mt-16" aria-labelledby="what-we-built">
          <h2
            id="what-we-built"
            className="font-outfit text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {t('work.what_we_built')}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {work.highlights.map((key) => {
              const Icon = HIGHLIGHT_ICONS[key];
              return (
                <article
                  key={key}
                  className="group rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:border-primary/50"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                  </span>
                  <h3 className="mt-4 font-outfit text-base font-bold text-foreground">
                    {t(`work.${work.slug}.highlights.${key}.title`)}
                  </h3>
                  <p className="mt-2 font-outfit text-sm leading-[1.85] text-muted-foreground">
                    {t(`work.${work.slug}.highlights.${key}.desc`)}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ------------------------------------------------- coming soon */}
        {work.roadmap && work.roadmap.length > 0 && (
          <section className="mt-16" aria-labelledby="roadmap">
            <div className="flex flex-wrap items-center gap-3">
              <h2
                id="roadmap"
                className="font-outfit text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                {t('work.roadmap_title')}
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-outfit text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {t('work.roadmap_badge')}
              </span>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {work.roadmap.map((key) => {
                const Icon = ROADMAP_ICONS[key];
                return (
                  <article
                    key={key}
                    className="rounded-2xl border border-dashed border-primary/30 bg-primary/[0.04] p-6"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                    </span>
                    <h3 className="mt-4 font-outfit text-base font-bold text-foreground">
                      {t(`work.${work.slug}.roadmap.${key}.title`)}
                    </h3>
                    <p className="mt-2 font-outfit text-sm leading-[1.85] text-muted-foreground">
                      {t(`work.${work.slug}.roadmap.${key}.desc`)}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ---------------------------------------------------- gallery */}
        {work.gallery && work.gallery.length > 0 && (
          <section className="mt-16" aria-labelledby="gallery">
            <h2
              id="gallery"
              className="font-outfit text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              {t('work.gallery_title')}
            </h2>
            <div className="mt-8 space-y-10">
              {work.gallery.map((shot) => (
                <figure key={shot.src} className={shot.phone ? 'mx-auto max-w-[280px]' : ''}>
                  <img
                    src={shot.src}
                    alt={t(`work.${work.slug}.gallery.${shot.key}`)}
                    loading="lazy"
                    decoding="async"
                    className="w-full rounded-2xl border border-border bg-card shadow-xl"
                  />
                  <figcaption className="mt-3 text-center font-outfit text-sm leading-relaxed text-muted-foreground">
                    {shot.preview && (
                      <span className="me-2 inline-block rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                        {t('work.preview_badge')}
                      </span>
                    )}
                    {t(`work.${work.slug}.gallery.${shot.key}`)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* ----------------------------------------------------------- cta */}
        <section className="mt-20 overflow-hidden rounded-3xl border border-border bg-card/60 p-8 text-center sm:p-12">
          <h2 className="font-outfit text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t('work.cta_title')}
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-outfit text-sm leading-[1.9] text-muted-foreground sm:text-base">
            {t('work.cta_sub')}
          </p>
          <Link
            to="/#contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-outfit text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.03]"
          >
            {t('work.cta_button')}
          </Link>
        </section>
      </main>

      <PremiumFooter />
    </div>
  );
};

export default CaseStudyPage;
