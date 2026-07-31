import React from 'react';
import { motion } from 'motion/react';
import { Globe, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const InteractiveGlobe: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  return (
    <section className="relative w-full py-24 bg-background/40 border-y border-border/50 overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background stars/dots */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: 'radial-gradient(rgba(139,92,246,0.12) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-4xl mx-auto px-6 relative z-10 w-full flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mb-12 ${i18n.language === 'ar' ? 'font-alexandria' : 'font-outfit'}`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-6 text-sm">
            <Globe className="w-4 h-4" /> {t('globe.badge')}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{t('globe.title')}</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            {t('globe.desc')}
          </p>
        </motion.div>

        {/* 3D CSS Stylized Globe */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 my-8 perspective-[1000px]">
          
          {/* Ambient Glow behind globe */}
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-[60px]" />
          
          {/* The Globe Sphere */}
          <motion.div 
            className="relative w-full h-full rounded-full border border-cyan-500/30 overflow-hidden bg-card/50 backdrop-blur-sm"
            style={{
              boxShadow: 'inset -20px -20px 50px rgba(0,0,0,0.4), inset 10px 10px 30px rgba(34, 211, 238, 0.2), 0 0 40px rgba(34, 211, 238, 0.2)'
            }}
            animate={{ rotateZ: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          >
            {/* Longitude Lines (Vertical) */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 left-1/2 -translate-x-1/2 w-[80%]" />
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 left-1/2 -translate-x-1/2 w-[40%]" />
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 left-1/2 -translate-x-1/2 w-[10%]" />
            
            {/* Latitude Lines (Horizontal) */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 top-1/2 -translate-y-1/2 h-[80%]" />
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 top-1/2 -translate-y-1/2 h-[40%]" />
            
            {/* Animated Data Points / Nodes */}
            <motion.div 
              className="absolute top-[30%] left-[20%] w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_#c084fc]"
              animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div 
              className="absolute top-[60%] right-[30%] w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee]"
              animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-[20%] left-[40%] w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"
              animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
            />
            
            {/* Moving Scanner Line */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>

          {/* Connection Arc Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            <motion.path 
              d="M 20 30 Q 50 10 70 60"
              fill="transparent"
              stroke="rgba(192, 132, 252, 0.5)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>

        </div>
        
        {/* Footer info for globe */}
        <div className={`flex items-center gap-6 mt-8 ${i18n.language === 'ar' ? 'font-alexandria' : 'font-outfit'}`}>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-foreground font-jetbrains">{t('globe.stats_value_1')}</span>
            <span className="text-xs text-muted-foreground">{t('globe.stats_label_1')}</span>
          </div>
          <div className="w-px h-8 bg-border/40" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-foreground font-jetbrains">{t('globe.stats_value_2')}</span>
            <span className="text-xs text-muted-foreground">{t('globe.stats_label_2')}</span>
          </div>
          <div className="w-px h-8 bg-border/40" />
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-foreground font-jetbrains">{t('globe.stats_value_3')}</span>
            <span className="text-xs text-muted-foreground">{t('globe.stats_label_3')}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
