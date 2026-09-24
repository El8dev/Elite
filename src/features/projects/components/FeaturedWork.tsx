import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { FEATURED_WORK } from '@/data/featuredWork';
import { PLATFORM_ICONS, stackIcon } from '@/features/projects/workIcons';

/**
 * The studio's own shipped platforms.
 *
 * Deliberately free of data fetching: it renders from the bundle, so it is
 * present in the prerendered HTML and survives the community feed below it
 * being empty or unreachable.
 */
export const FeaturedWork: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="mb-16 sm:mb-24" aria-labelledby="featured-work-title">
      <header className="mb-8 sm:mb-12 text-center">
        <span className="deck-kicker">{t('work.section_kicker')}</span>
        <h2
          id="featured-work-title"
          className="mt-3 font-outfit text-2xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {t('work.section_title')}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl font-outfit text-base text-muted-foreground sm:text-lg">
          {t('work.section_sub')}
        </p>
      </header>

      <div className="grid gap-5 sm:gap-8 md:grid-cols-2">
        {FEATURED_WORK.map((work) => (
          <article
            key={work.slug}
            className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-card ring-1 ring-border shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition-[box-shadow,ring-color] hover:ring-primary/50 min-w-0"
          >
            <Link
              to={`/project/${work.slug}`}
              className="proj-card__media relative block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              tabIndex={-1}
              aria-hidden="true"
            >
              <img
                src={work.image}
                alt=""
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (!img.src.endsWith('/images/placeholder-project.svg')) {
                    img.src = '/images/placeholder-project.svg';
                  }
                }}
              />
            </Link>

            <div className="flex flex-1 flex-col gap-3 p-4 sm:p-6 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary font-outfit">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {t('work.live_label')}
                </span>
                <span className="text-muted-foreground/60" aria-hidden="true">·</span>
                <span className="text-muted-foreground">{work.year}</span>
              </div>

              <h3 className="font-outfit text-lg font-bold leading-snug text-foreground sm:text-xl">
                <Link to={`/project/${work.slug}`} className="hover:text-primary focus:outline-none focus-visible:underline">
                  {t(`work.${work.slug}.title`)}
                </Link>
              </h3>

              <p className="font-outfit text-sm leading-relaxed text-muted-foreground">
                {t(`work.${work.slug}.desc`)}
              </p>

              <ul className="flex flex-wrap gap-1.5 min-w-0" aria-label={t('work.platforms_label')}>
                {work.platforms.map((key) => {
                  const Icon = PLATFORM_ICONS[key];
                  return (
                    <li
                      key={key}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 font-outfit text-[11px] font-semibold text-primary sm:text-xs"
                    >
                      {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
                      {t(`work.platforms.${key}`)}
                    </li>
                  );
                })}
              </ul>

              <ul className="flex flex-wrap gap-1.5 min-w-0" aria-label={t('work.stack_label')}>
                {work.stack.map((tech) => {
                  const Icon = stackIcon(tech);
                  return (
                    <li
                      key={tech}
                      className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-border/50 bg-secondary/80 px-2.5 py-0.5 font-outfit text-[11px] font-semibold tracking-wide text-foreground/80 sm:text-xs"
                    >
                      <Icon className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                      {tech}
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                <Link
                  to={`/project/${work.slug}`}
                  className="font-outfit text-sm font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  {t('work.case_study')}
                </Link>
                <a
                  href={work.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-outfit text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {work.displayUrl}
                  <ArrowUpRight className="inline h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturedWork;
