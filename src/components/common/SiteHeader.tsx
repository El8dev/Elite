import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Magnetic } from '@/components/common/Magnetic';
import { useCinematicSound } from '@/hooks/useCinematicSound';
import { EliteLogo } from '@/components/common/EliteLogo';
import { ArrowLeft } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'الرئيسية', path: '/' },
  { name: 'المشاريع', path: '/projects' },
  { name: 'المطورين', path: '/developers' },
  { name: 'الروائع', path: '/masterpieces' },
  { name: 'المقالات', path: '/articles' },
];

export const SiteHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playHoverTick } = useCinematicSound();

  const handleLogoClick = () => {
    if (playHoverTick) playHoverTick();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 z-[60] flex w-full items-center justify-between px-4 py-4 md:px-8 md:py-5 flex-col md:flex-row-reverse gap-4 md:gap-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent pb-6 backdrop-blur-[4px]">
      {/* Left — Logo */}
      <Magnetic strength={0.2}>
        <button
          onClick={handleLogoClick}
          dir="ltr"
          className="group relative flex items-center gap-3 focus:outline-none transition-transform duration-300 hover:scale-[1.03]"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#6366F1]/20 shadow-[0_0_20px_rgba(139,92,246,0.15)] border border-purple-500/30">
             <EliteLogo fill="#8B5CF6" className="w-5 h-5 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
          </div>
          <span className="font-outfit text-lg font-bold tracking-widest text-white/90">
            ELITE<span className="text-[#8B5CF6]">.</span>
          </span>
        </button>
      </Magnetic>

      {/* Right — Nav Links & Actions */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <nav className="flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl shadow-black/40" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Magnetic key={item.path} strength={0.15}>
                <Link
                  to={item.path}
                  onMouseEnter={() => { if (playHoverTick) playHoverTick(); }}
                  className={`relative px-5 py-2 min-h-[40px] inline-flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-300 font-alexandria focus:outline-none group ${
                    isActive ? 'text-white font-bold' : 'text-white/70 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>{item.name}</span>
                    <ArrowLeft className="w-3.5 h-3.5 opacity-0 transition-all duration-300 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100" />
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 z-0 rounded-full bg-purple-600/30 border border-purple-500/60 shadow-[0_0_22px_rgba(168,85,247,0.7)] backdrop-blur-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                  {/* Violet glow hint on hover before selection */}
                  {!isActive && (
                    <div className="absolute inset-0 z-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-purple-600/20 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.55)]" />
                  )}
                </Link>
              </Magnetic>
            );
          })}
        </nav>

        <div className="h-6 w-px bg-white/10 hidden sm:block" />

        <Magnetic strength={0.2}>
          <Link
            to="/login"
            onMouseEnter={() => { if (playHoverTick) playHoverTick(); }}
            className="relative px-5 py-2 min-h-[40px] inline-flex items-center justify-center text-sm font-semibold rounded-full transition-all duration-300 font-outfit focus:outline-none group text-white border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 shadow-[0_0_20px_-4px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_-4px_rgba(139,92,246,0.6)]"
          >
            تسجيل الدخول
          </Link>
        </Magnetic>
      </div>
    </header>
  );
};
