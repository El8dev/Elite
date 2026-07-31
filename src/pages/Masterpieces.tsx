import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useCinematicSound } from '@/hooks/useCinematicSound';
import { Project } from '@/types';
import { useTranslation } from 'react-i18next';

import { SiteHeader } from '@/components/common/SiteHeader';
import { EliteLogo } from '@/components/common/EliteLogo';
import { Helmet } from 'react-helmet-async';

const AnimatedEliteLogo: React.FC = () => {
  const pathD_top =
    'M 65 15 L 130 15 C 135 15 138 18 138 23 L 138 33 C 138 38 135 41 130 41 L 65 41 C 60 41 57 38 57 33 L 57 23 C 57 18 60 15 65 15 Z';
  const pathD_body =
    'M 25 55 L 90 55 C 95 55 98 58 100 63 L 115 88 C 117 93 114 98 109 98 L 68 98 C 63 98 60 101 62 106 L 77 131 C 79 136 82 139 87 139 L 145 139 C 150 139 153 136 153 131 L 153 123 C 153 118 150 115 145 115 L 98 115 C 93 115 90 112 88 107 L 73 82 C 71 77 74 72 79 72 L 120 72 C 125 72 128 69 128 64 L 128 56 C 128 51 125 48 120 48 L 60 48 C 55 48 52 51 50 56 L 35 81 C 33 86 30 89 25 89 L 20 89 C 15 89 12 86 12 81 L 12 63 C 12 58 15 55 20 55 L 25 55 Z';

  return (
    <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, rgba(139,92,246,0.12) 40%, transparent 70%)',
          filter: 'blur(18px)',
          transform: 'translate(-50%, -50%) scale(0)',
          top: '50%',
          left: '50%',
        }}
        animate={{
          scale: [0, 1.6, 1.2],
          opacity: [0, 0.9, 0.4],
        }}
        transition={{
          duration: 1.6,
          delay: 0.2,
          ease: 'easeOut',
        }}
      />

      <svg
        viewBox="0 0 170 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]"
        aria-hidden="true"
      >
        <motion.path
          d={pathD_top}
          stroke="hsl(189,94%,53%)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="transparent"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 1.0, ease: 'easeInOut', delay: 0.2 },
            opacity: { duration: 0.1, delay: 0.2 },
          }}
        />
        <motion.path
          d={pathD_body}
          stroke="hsl(189,94%,53%)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="transparent"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 1.06, ease: 'easeInOut', delay: 0.2 },
            opacity: { duration: 0.1, delay: 0.2 },
          }}
        />
        <motion.path
          d={pathD_top}
          fill="hsl(263,90%,66%)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
        />
        <motion.path
          d={pathD_body}
          fill="hsl(263,90%,66%)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
};

// ------------------------------------------------------------------
// Section Intro Animation
// ------------------------------------------------------------------
const SectionIntro: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { playSubBassDrop } = useCinematicSound();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  useEffect(() => {
    const timer = setTimeout(() => {
      playSubBassDrop?.();
      onComplete();
    }, 2850);
    return () => clearTimeout(timer);
  }, [onComplete, playSubBassDrop]);

  return (
    <motion.div
      onClick={onComplete}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0A0A0F] cursor-pointer"
      initial={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ clipPath: 'circle(0% at 50% 50%)' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      <div dir="ltr" className="relative flex items-center gap-4 md:gap-5">
        {/* Phase 1+2: Cinematic line-drawing E logo */}
        <AnimatedEliteLogo />

        {/* Phase 3: "ELITE" text */}
        <div className="relative flex flex-col items-start">
          <div className="flex items-center gap-1">
            {['E', 'L', 'I', 'T', 'E'].map((char, i) => (
              <motion.span
                key={i}
                className="text-4xl md:text-6xl font-bold tracking-[0.15em] text-white select-none font-outfit"
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + i * 0.045,
                  ease: [0.25, 1, 0.5, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Phase 4: Divider line */}
          <motion.div
            className="h-[2px] w-[180px] md:w-[260px] bg-gradient-to-r from-purple-500 via-purple-400 to-transparent origin-left mt-3 rounded-full"
            style={{
              boxShadow: '0 0 10px rgba(139,92,246,0.6)',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1], delay: 0.7 }}
          />

          {/* Phase 5: "MASTERPIECES" text */}
          <motion.span
            className={`text-xs md:text-sm font-semibold tracking-[0.35em] text-purple-400 uppercase mt-2 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1], delay: 0.9 }}
          >
            {t('masterpieces.title')}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

// ------------------------------------------------------------------
// 2.5D Parallax Card
// ------------------------------------------------------------------
interface MasterpieceCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    image_url: string | string[];
    tech_stack: string | string[];
    live_link?: string;
    github_link?: string;
    profiles?: {
      full_name?: string;
      username?: string;
      avatar_url?: string;
      job_title?: string;
    };
    project_contributors?: any[];
    created_at?: string;
  };
  index: number;
  onClick?: () => void;
}

const MasterpieceCard: React.FC<MasterpieceCardProps> = ({ item, index, onClick }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 200, damping: 25 });
  const imgX = useSpring(useTransform(mouseX, [0, 1], [6, -6]), { stiffness: 200, damping: 25 });
  const imgY = useSpring(useTransform(mouseY, [0, 1], [6, -6]), { stiffness: 200, damping: 25 });
  const glowX = useTransform(mouseX, [0, 1], [0, 100]);
  const glowY = useTransform(mouseY, [0, 1], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const devName = item.profiles?.full_name || item.profiles?.username || 'Elite Developer';
  const techStackRaw = item.tech_stack;
  const techStack = Array.isArray(techStackRaw)
    ? techStackRaw
    : typeof techStackRaw === 'string'
      ? techStackRaw.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group relative cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.25, 1, 0.5, 1] }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#09090b]/80 backdrop-blur-xl shadow-2xl transition-all duration-500 group-hover:border-amber-500/40 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-gradient(circle at ${x}% ${y}%, rgba(245,158,11,0.25), transparent 60%)`
            ),
          }}
        />

        <motion.div
          className="relative aspect-[16/10] w-full overflow-hidden"
          style={{ x: imgX, y: imgY, translateZ: 30 }}
        >
          <img
            src={Array.isArray(item.image_url) ? item.image_url[0] : item.image_url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
        </motion.div>

        <motion.div
          className="absolute top-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1.5 shadow-lg shadow-amber-950/40"
          style={{ translateZ: 50 }}
        >
          <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className={`text-xs md:text-sm font-bold tracking-wider text-black uppercase ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
            {t('masterpieces.badge')}
          </span>
        </motion.div>

        <div className="relative z-20 px-4 pb-4 md:px-6 md:pb-6 -mt-4">
          {item.profiles && (
            <div className="flex items-center gap-2.5 mb-4">
              {item.profiles.avatar_url && (
                <img
                  src={item.profiles.avatar_url}
                  alt={devName}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-purple-500/20"
                  loading="lazy"
                />
              )}
              <div>
                <p className="text-sm font-semibold text-foreground font-outfit">{devName}</p>
                <p className="text-sm text-amber-400 font-outfit font-medium uppercase tracking-wider">{item.profiles.job_title || 'Developer'}</p>
              </div>
            </div>
          )}
          <h3 className="text-lg font-bold text-foreground tracking-tight font-outfit">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-outfit line-clamp-2">
            {item.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {techStack.slice(0, 5).map((tech: string) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-md bg-white/5 border border-white/10 px-1.5 py-0.5 text-xs md:text-sm font-semibold text-purple-300 tracking-wide font-outfit"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ------------------------------------------------------------------
// Masterpieces Page
// ------------------------------------------------------------------
const MasterpiecesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const navigate = useNavigate();
  const location = useLocation();
  const [showIntro, setShowIntro] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bgMouseX = useMotionValue(0);
  const bgMouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      bgMouseX.set(e.clientX);
      bgMouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [bgMouseX, bgMouseY]);

  const bgTemplate = useMotionTemplate`radial-gradient(700px at ${bgMouseX}px ${bgMouseY}px, rgba(245, 158, 11, 0.03), rgba(139, 92, 246, 0.03), transparent 85%)`;

  useEffect(() => {
    let isMounted = true;
    const fetchMasterpieces = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            profiles:owner_id (*),
            project_contributors (
              profiles (*)
            )
          `)
          .eq('is_masterpiece', true)
          .eq('personal_profile_only', false)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length === 0) {
          const fallback = await supabase
            .from('projects')
            .select(`
              *,
              profiles:owner_id (*),
              project_contributors (
                profiles (*)
              )
            `)
            .eq('personal_profile_only', false)
            .order('created_at', { ascending: false })
            .limit(10);
          
          if (isMounted) setItems(fallback.data || []);
        } else {
          if (isMounted) setItems(data || []);
        }
      } catch (err: any) {
        console.error('Supabase fetch error (Masterpieces):', err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchMasterpieces();
    return () => { isMounted = false; };
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-foreground selection:bg-[#8B5CF6]/30 selection:text-foreground font-sans overflow-x-hidden flex flex-col">
      <Helmet>
        <title>Masterpieces | Elite Code</title>
        <meta name="description" content="A carefully curated gallery of our finest programming and engineering achievements." />
      </Helmet>
      {/* Premium Ambient Shifting Glow */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-0 mix-blend-screen"
        style={{ background: bgTemplate }}
      />

      {/* Section Intro */}
      <AnimatePresence>
        {showIntro && <SectionIntro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <SiteHeader />

      {/* Page Content */}
      <div className="pt-20 relative z-10">
        {/* Header Section */}
        <motion.div
          className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showIntro ? 0 : 1, y: showIntro ? 20 : 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-purple-400 to-cyan-400" />
            <span className={`text-lg md:text-2xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-200 to-cyan-300 ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
              {t('masterpieces.elite_collection')}
            </span>
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-purple-400 to-cyan-400" />
          </div>
          <h1 className={`text-3xl md:text-5xl font-bold tracking-tight text-foreground ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
            {t('masterpieces.title')}
          </h1>
          <p className={`mt-6 text-sm md:text-base text-muted-foreground max-w-md mx-auto ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
            {t('masterpieces.subtitle')}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
          {loading ? (
            <div className="text-center py-20 font-outfit">
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-muted-foreground text-lg"
              >
                Loading masterpieces...
              </motion.div>
            </div>
          ) : error ? (
            <div className="text-center py-20 font-outfit">
              <p className="text-red-400 text-lg font-outfit">Failed to load: {error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-outfit"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 mb-5">
                  <svg className="w-7 h-7 text-purple-400/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <p className="text-muted-foreground text-lg font-medium">
                  {t('masterpieces.no_masterpieces_yet', 'No masterpieces uncovered yet.')}
                </p>
                <p className="text-muted-foreground/70 text-sm mt-1">
                  {t('masterpieces.premium_projects_will_appear', 'Premium projects will appear here once curated.')}
                </p>
              </motion.div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-2 lg:gap-12">
              {items.map((item, index) => {
                const techStackRaw = item.tech_stack || item.techStack;
                const techStack = Array.isArray(techStackRaw) 
                  ? techStackRaw 
                  : typeof techStackRaw === 'string' 
                    ? techStackRaw.split(',').map((s: string) => s.trim()).filter(Boolean)
                    : [];

                const proj: Project = {
                  id: item.id,
                  developerId: item.owner_id || item.profile_id,
                  title: item.title,
                  description: item.description,
                  imageUrl: Array.isArray(item.image_url) ? item.image_url : [item.image_url].filter(Boolean),
                  imageUrls: Array.isArray(item.image_url) ? item.image_url : [item.image_url].filter(Boolean),
                  techStack: techStack,
                  contributors: item.project_contributors?.map((c: any) => c.profiles) || [],
                  liveUrl: item.live_link,
                  repoUrl: item.github_link,
                  createdAt: item.created_at,
                  updatedAt: item.created_at,
                  isMasterpiece: true,
                };

                return (
                  <MasterpieceCard
                    key={item.id}
                    item={item}
                    index={index}
                    onClick={() => navigate(`/project/${item.id}`, { state: { backgroundLocation: location } })}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterpiecesPage;
