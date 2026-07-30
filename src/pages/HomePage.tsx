import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Developer, Project } from '@/data/portfolioData';
import { supabase } from '@/lib/supabase';
import { Download } from 'lucide-react';
import OurVision from '@/features/landing/components/OurVision';
import { Magnetic } from '@/components/common/Magnetic';
import { ParticlesBackground } from '@/components/common/ParticlesBackground';
import { useCinematicSound } from '@/hooks/useCinematicSound';
import { PremiumFooter } from '@/components/common/PremiumFooter';
import { ServicesSection } from '@/features/landing/components/ServicesSection';
import { fetchPublicProjects } from '@/features/projects/services/projects.service';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import { Helmet } from 'react-helmet-async';



type ViewState = 'showcase' | 'developers';

import { SiteHeader } from '@/components/common/SiteHeader';

// ------------------------------------------------------------------
// FeedPost (Premium Masonry Card)
// ------------------------------------------------------------------
interface FeedPostProps {
  developer: Developer;
  project: Project;
  onDeveloperClick: (id: string, username?: string) => void;
  onProjectClick: (id: string) => void;
  reduceMotion: boolean;
}

const FeedPost: React.FC<FeedPostProps> = ({ developer, project, onDeveloperClick, onProjectClick, reduceMotion }) => {
  const { playHoverTick } = useCinematicSound();
  
  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className="group relative mb-8 overflow-hidden rounded-3xl bg-[#09090b] shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/5 transition-all hover:ring-white/10"
      style={{ isolation: 'isolate' }}
    >
      <div 
        className="relative cursor-pointer overflow-hidden aspect-[4/3] md:aspect-auto md:h-auto" 
        onClick={() => {
          playHoverTick();
          onProjectClick(project.id);
        }}
      >
        <motion.img
          src={project.imageUrls?.[0] || project.imageUrl}
          alt={project.title}
          className="w-full h-full md:h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />
      </div>

      <div className="relative p-5 sm:p-6 bg-gradient-to-b from-[#09090b] to-[#030303]">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => onDeveloperClick(developer.id, (developer as any).username)}
            className="flex items-center gap-3 group/dev focus:outline-none"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-sm transition-opacity group-hover/dev:opacity-100 opacity-0" />
              <img
                src={developer.avatarUrl}
                alt={developer.name}
                className="relative h-10 w-10 rounded-full object-cover ring-2 ring-white/10 transition-all group-hover/dev:ring-purple-500/50"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white/90 font-outfit group-hover/dev:text-white transition-colors line-clamp-1">{developer.name}</p>
              <p className="text-xs md:text-sm uppercase tracking-wider text-purple-400 font-outfit line-clamp-1">{developer.role}</p>
            </div>
          </button>
        </div>

        <h3 className="mb-2 text-xl sm:text-2xl font-bold text-white font-outfit leading-tight line-clamp-2">
          {project.title}
        </h3>
        <p className="mb-5 text-sm sm:text-base leading-relaxed text-white/60 font-outfit line-clamp-2">
          {project.description}
        </p>

        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
             {project.techStack.slice(0, 3).map((tech, i) => (
                <span key={i} className="px-1.5 py-0.5 text-xs md:text-sm font-semibold tracking-wider uppercase bg-white/5 border border-white/10 text-white/70 rounded-full font-outfit">
                  {tech}
                </span>
             ))}
             {project.techStack.length > 3 && (
                <span className="px-2 py-1 text-xs md:text-sm font-semibold text-white/40 font-outfit">+{project.techStack.length - 3}</span>
             )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ------------------------------------------------------------------
// ShowcaseFeed
// ------------------------------------------------------------------
const ShowcaseFeed: React.FC<{ 
  onDeveloperClick: (id: string, username?: string) => void; 
  reduceMotion: boolean;
}> = ({ onDeveloperClick, reduceMotion }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [feedItems, setFeedItems] = useState<Array<{ dev: Developer; proj: Project }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      try {
        const data = await fetchPublicProjects();
        if (isMounted) {
          const items = data.map((item: any) => {
            const owner = item.profiles;
            const dev: Developer = {
              id: owner?.id || item.owner_id,
              username: owner?.username,
              name: owner?.full_name || owner?.username || 'Unknown Developer',
              role: owner?.job_title || 'Developer',
              avatarUrl: owner?.avatar_url || 'https://via.placeholder.com/150',
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
              isMasterpiece: item.is_masterpiece || false,
              contributors: item.project_contributors?.map((c: any) => c.profiles) || [],
              liveUrl: item.live_link,
              repoUrl: item.github_link,
              createdAt: item.created_at,
              updatedAt: item.created_at
            };

            return { dev, proj };
          });
          setFeedItems(items);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'An error occurred while fetching projects');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProjects();
    return () => { isMounted = false; };
  }, []);

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`, { state: { backgroundLocation: location } });
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center font-outfit text-white/40">
        <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          Loading showcase...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center font-outfit text-red-400">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-white/5 rounded-md hover:bg-white/10">Try again</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-8">
      <motion.div
        initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        className="mb-16 mt-20 text-center"
      >
        <h1 className="mb-4 font-outfit text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-7xl">
          Where Code Meets{' '}
          <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#3B82F6] bg-clip-text text-transparent">
            Art
          </span>
        </h1>
        <p className="mx-auto max-w-2xl font-outfit text-lg text-white/60 sm:text-xl">
          Discover hand-crafted digital experiences built by the world's most elite developers.
        </p>
      </motion.div>

      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
        {feedItems.map((item, index) => (
          <FeedPost
            key={item.proj.id + index}
            developer={item.dev}
            project={item.proj}
            onDeveloperClick={onDeveloperClick}
            onProjectClick={handleProjectClick}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// HomePage
// ------------------------------------------------------------------
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotionPref();
  
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

  const handleNav = (nextView: ViewState) => {
    if (nextView === 'showcase') navigate('/');
    if (nextView === 'developers') navigate('/developers');
  };

  const handleDeveloperClick = (id: string, username?: string) => {
    navigate(`/developer/${username || id}`);
  };

  return (
    <div className="relative min-h-screen bg-[#030303] selection:bg-[#8B5CF6]/30 selection:text-white font-sans overflow-x-hidden">
      <Helmet>
        <title>Elite Code | Premium Developer Portfolios</title>
        <meta name="description" content="Discover hand-crafted digital experiences built by the world's most elite developers." />
      </Helmet>

      {!reduceMotion && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-0"
          style={{ background: bgTemplate }}
        />
      )}

      <SiteHeader />

      <main className="relative z-10 pt-24 pb-32">
        <ShowcaseFeed 
          onDeveloperClick={handleDeveloperClick} 
          reduceMotion={reduceMotion}
        />
      </main>

      <OurVision />
      


      <ServicesSection />
      <PremiumFooter />
    </div>
  );
};

export default HomePage;
