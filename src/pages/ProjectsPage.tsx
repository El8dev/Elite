import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Developer, Project } from '@/data/portfolioData';
import { fetchPublicProjects, PROJECTS_PAGE_SIZE } from '@/features/projects/services/projects.service';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import { useTranslation } from 'react-i18next';
import { useCinematicSound } from '@/hooks/useCinematicSound';
import { Helmet } from 'react-helmet-async';
import { SiteHeader } from '@/components/common/SiteHeader';
import { PremiumFooter } from '@/components/common/PremiumFooter';
import { FeaturedWork } from '@/features/projects/components/FeaturedWork';

// ------------------------------------------------------------------
// FeedPost (Premium Masonry Card)
// ------------------------------------------------------------------
interface FeedPostProps {
  developer: Developer;
  project: Project;
onProjectClick: (id: string) => void;
  reduceMotion: boolean;
}

const FeedPost: React.FC<FeedPostProps> = ({ developer, project, onProjectClick, reduceMotion }) => {
  const { playHoverTick } = useCinematicSound();
  const cover = project.imageUrls?.[0] || (Array.isArray(project.imageUrl) ? project.imageUrl[0] : project.imageUrl) || '/images/placeholder-project.svg';

  return (
    <motion.article
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-card ring-1 ring-border shadow-[0_8px_28px_rgba(0,0,0,0.08)] transition-[box-shadow,ring-color] hover:ring-primary/50 min-w-0"
    >
      <button
        type="button"
        className="proj-card__media relative block w-full text-start cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onClick={() => { playHoverTick(); onProjectClick(project.id); }}
        aria-label={project.title}
      >
        <img
          src={cover}
          alt=""
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
          className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder-project.svg'; }}
        />
      </button>

      <div className="flex flex-col gap-2 p-3 sm:p-5 min-w-0">
        <h3 className="text-sm sm:text-lg font-bold leading-snug text-foreground font-outfit line-clamp-2">
          {project.title}
        </h3>
        <p className="hidden sm:block text-sm leading-relaxed text-muted-foreground font-outfit line-clamp-2">
          {project.description}
        </p>

        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 min-w-0">
            {project.techStack.slice(0, 2).map((tech, i) => (
              <span key={i} className="max-w-full truncate px-2 py-0.5 text-[11px] sm:text-xs font-semibold tracking-wide bg-secondary/80 border border-border/50 text-foreground/80 rounded-full font-outfit">
                {tech}
              </span>
            ))}
            {project.techStack.length > 2 && (
              <span className="px-1.5 py-0.5 text-[11px] sm:text-xs font-semibold text-muted-foreground font-outfit">+{project.techStack.length - 2}</span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => onProjectClick(project.id)}
          className="mt-1 flex items-center gap-2 min-w-0 text-start group/dev focus:outline-none"
        >
          <img
            src={developer.avatarUrl}
            alt=""
            width={32}
            height={32}
            loading="lazy"
            className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover ring-1 ring-border shrink-0"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder-avatar.svg'; }}
          />
          <span className="min-w-0">
            <span className="block text-xs sm:text-sm font-semibold text-foreground/90 font-outfit truncate group-hover/dev:text-foreground">{developer.name}</span>
            <span className="block text-[11px] sm:text-xs text-primary font-outfit truncate">{developer.role}</span>
          </span>
        </button>
      </div>
    </motion.article>
  );
};

// ------------------------------------------------------------------
// ShowcaseFeed
// ------------------------------------------------------------------
const ShowcaseFeed: React.FC<{
reduceMotion: boolean;
}> = ({ reduceMotion }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [feedItems, setFeedItems] = useState<Array<{ dev: Developer; proj: Project }>>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const mapPage = (data: any[]) => {
    const items = data.map((item: any) => {
      const owner = item.profiles;
      const dev: Developer = {
        id: owner?.id || item.owner_id,
        username: owner?.username,
        name: owner?.full_name || owner?.username || 'Unknown Developer',
        role: owner?.job_title || 'Developer',
        avatarUrl: owner?.avatar_url || '/images/placeholder-avatar.svg',
        bio: owner?.bio || '',
        skills: owner?.skills || [],
      };

      const techStackRaw = item.tech_stack;
      const techStack = Array.isArray(techStackRaw)
        ? techStackRaw
        : typeof techStackRaw === 'string'
          ? techStackRaw.split(',').map((s: string) => s.trim()).filter(Boolean)
          : [];

      const proj: Project = {
        id: item.id,
        developerId: item.owner_id,
        ownerId: item.owner_id,
        title: item.title,
        description: item.description,
        imageUrl: Array.isArray(item.image_url) ? item.image_url : [item.image_url].filter(Boolean),
        imageUrls: Array.isArray(item.image_url) ? item.image_url : [item.image_url].filter(Boolean),
        techStack,

        contributors: item.project_contributors?.map((c: any) => c.profiles) || [],
        liveUrl: item.live_link,
        repoUrl: item.github_link,
        createdAt: item.created_at,
        updatedAt: item.created_at
      };

      return { dev, proj };
    });
    return items;
  };

  const loadPage = async (offset: number) => {
    const data = await fetchPublicProjects(offset, PROJECTS_PAGE_SIZE);
    setHasMore(data.length === PROJECTS_PAGE_SIZE);
    return mapPage(data);
  };

  useEffect(() => {
    let isMounted = true;
    loadPage(0)
      .then((items) => { if (isMounted) setFeedItems(items); })
      .catch((err: any) => { if (isMounted) setError(err.message || 'An error occurred while fetching projects'); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const items = await loadPage(feedItems.length);
      setFeedItems((prev) => [...prev, ...items]);
    } catch (err: any) {
      setError(err.message || 'Could not load more projects');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`, { state: { backgroundLocation: location } });
  };

  // The community feed is the only part that depends on the network. It fails
  // quietly into its own section so the studio's shipped work above it — and
  // everything a crawler needs — is on the page either way.
  if (loading) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center font-outfit text-muted-foreground">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          {t('projects.loading_more', 'Loading…')}
        </motion.div>
      </div>
    );
  }

  if (error || feedItems.length === 0) {
    return (
      <p className="py-10 text-center font-outfit text-sm text-muted-foreground">
        {t('projects.community_empty')}
      </p>
    );
  }

  return (
    <>
      <div className="proj-grid">
        {feedItems.map((item, index) => (
          <FeedPost
            key={item.proj.id + index}
            developer={item.dev}
            project={item.proj}
            onProjectClick={handleProjectClick}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8 sm:mt-12">
          <button type="button" onClick={loadMore} disabled={loadingMore} className="ghost-btn" aria-busy={loadingMore}>
            <span>{loadingMore ? t('projects.loading_more', 'Loading…') : t('projects.load_more', 'Load more projects')}</span>
          </button>
        </div>
      )}
    </>
  );
};

const ProjectsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotionPref();
  // A full-viewport gradient that follows the pointer is pure repaint cost on
  // phones (there is no pointer to follow), so treat coarse pointers like reduced motion.
  const staticBg = reduceMotion || (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (staticBg) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, staticBg]);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const xPercent = useTransform(springX, [0, window.innerWidth || 1000], [40, 60]);
  const yPercent = useTransform(springY, [0, window.innerHeight || 1000], [40, 60]);
  const bgTemplate = useMotionTemplate`radial-gradient(circle at ${xPercent}% ${yPercent}%, rgba(139,92,246,0.06) 0%, rgba(99,102,241,0.03) 40%, transparent 70%)`;


  return (
    <div className="relative min-h-screen bg-transparent text-foreground selection:bg-[#8B5CF6]/30 selection:text-foreground font-sans overflow-x-hidden">
      <Helmet>
        <html lang={i18n.language.startsWith('ar') ? 'ar' : 'en'} />
        <title>{t('projects.meta_title')}</title>
        <meta name="description" content={t('projects.meta_desc')} />
        <link rel="canonical" href="https://el8.dev/projects" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t('projects.meta_title')} />
        <meta property="og:description" content={t('projects.meta_desc')} />
        <meta property="og:url" content="https://el8.dev/projects" />
        <meta property="og:image" content="https://el8.dev/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('projects.meta_title')} />
        <meta name="twitter:description" content={t('projects.meta_desc')} />
      </Helmet>

      {!staticBg && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-0"
          style={{ background: bgTemplate }}
        />
      )}

      <SiteHeader />

      <main className="relative z-10 pt-24 pb-32 min-h-[80vh]">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-8">
          <header className="mb-10 sm:mb-16 mt-6 sm:mt-12 text-center">
            <h1 className="mb-4 font-outfit text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {t('projects.page_title')}{' '}
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#3B82F6] bg-clip-text text-transparent">
                {t('projects.page_title_accent')}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl font-outfit text-lg text-muted-foreground sm:text-xl">
              {t('projects.page_sub')}
            </p>
          </header>

          <FeaturedWork />

          <section aria-labelledby="community-projects-title">
            <header className="mb-8 sm:mb-12 text-center">
              <h2
                id="community-projects-title"
                className="font-outfit text-2xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                {t('projects.community_title')}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl font-outfit text-base text-muted-foreground sm:text-lg">
                {t('projects.community_sub')}
              </p>
            </header>
            <ShowcaseFeed reduceMotion={reduceMotion} />
          </section>
        </div>
      </main>

      <PremiumFooter />
    </div>
  );
};

export default ProjectsPage;
