import React from 'react';
import { motion, useInView, useSpring, useTransform } from 'motion/react';
import { useTranslation } from 'react-i18next';

// Counter component for animated numbers
const AnimatedCounter: React.FC<{ value: number; duration?: number; suffix?: string; label: string }> = ({ value, duration = 2, suffix = '', label }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const springValue = useSpring(0, {
    bounce: 0,
    duration: duration * 1000,
  });
  
  React.useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  const displayValue = useTransform(springValue, (current) => Math.floor(current));

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="flex items-baseline gap-1" dir="ltr">
        <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-jetbrains">
          <motion.span>{displayValue}</motion.span>
        </span>
        <span className="text-2xl font-bold text-cyan-400">{suffix}</span>
      </div>
      <span className="mt-3 text-sm md:text-base text-white/60 text-center font-inherit">{label}</span>
    </div>
  );
};

// Tech Partners Array
const technologies = [
  'REACT', 'NEXT.JS', 'TYPESCRIPT', 'NODE.JS', 'PYTHON', 
  'AWS', 'GOOGLE CLOUD', 'DOCKER', 'POSTGRESQL', 'TAILWIND CSS', 'FIGMA'
];

export const LiveStats: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <section className="relative w-full py-16 z-10 border-y border-white/5 bg-black/40" id="stats">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Number Counters */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 ${isRTL ? 'font-alexandria' : 'font-outfit'}`} dir={i18n.dir()}>
          <AnimatedCounter value={20} suffix="+" label={t('stats.completed_project')} />
          <AnimatedCounter value={10} suffix="+" label={t('stats.elite_developer')} />
          <AnimatedCounter value={99} suffix="%" label={t('stats.customer_satisfaction')} />
          <AnimatedCounter value={100} suffix="K+" label={t('stats.lines_of_code')} />
        </div>

      </div>

      {/* Endless Tech Marquee */}
      <div className="w-full overflow-hidden flex flex-col items-center border-t border-white/5 pt-12 pb-4">
        <p className={`text-xs text-white/40 uppercase tracking-[0.3em] mb-8 text-center ${isRTL ? 'font-alexandria' : 'font-outfit'}`}>
          {t('stats.tech_stack')}
        </p>
        
        <div className="relative flex overflow-x-hidden w-full group">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none" />
          
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16 group-hover:[animation-play-state:paused]">
            {[...technologies, ...technologies].map((tech, idx) => (
              <span 
                key={idx} 
                className="text-xl md:text-3xl font-bold text-white/10 hover:text-white/40 transition-colors duration-300 font-jetbrains tracking-widest select-none"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};
