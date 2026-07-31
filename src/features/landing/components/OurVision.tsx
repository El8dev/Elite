import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Globe,
  Smartphone,
  Database,
  Layers,
  Cpu,
  Lightbulb,
  Layout,
} from 'lucide-react';
import TerminalText from '@/components/common/TerminalText';

import { SlitScanText } from '@/components/common/SlitScanText';
import { TypewriterText } from '@/components/common/TypewriterText';

import { useCinematicSound } from '@/hooks/useCinematicSound';
import { useTranslation } from 'react-i18next';

// ──────────────────────────────────────────────────────────────────────────────
// Service icon color mapping
// ──────────────────────────────────────────────────────────────────────────────
const SERVICE_COLORS = [
  'rgba(34,211,238,0.9)',   // cyan
  'rgba(139,92,246,0.9)',   // violet
  'rgba(52,211,153,0.9)',   // emerald
  'rgba(139,92,246,0.9)',   // violet
  'rgba(34,211,238,0.9)',   // cyan
  'rgba(245,158,11,0.9)',   // amber
  'rgba(52,211,153,0.9)',   // emerald
];

const SERVICE_GLOW = [
  'rgba(34,211,238,0.12)',
  'rgba(139,92,246,0.12)',
  'rgba(52,211,153,0.12)',
  'rgba(139,92,246,0.12)',
  'rgba(34,211,238,0.12)',
  'rgba(245,158,11,0.12)',
  'rgba(52,211,153,0.12)',
];

// ──────────────────────────────────────────────────────────────────────────────
// OurVision
// ──────────────────────────────────────────────────────────────────────────────
const OurVision: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { playHoverTick } = useCinematicSound();
  const servicesList = t('vision.services', { returnObjects: true }) as string[];

  const services = [
    { title: servicesList[0], icon: Globe      },
    { title: servicesList[1], icon: Smartphone },
    { title: servicesList[2], icon: Database   },
    { title: servicesList[3], icon: Layers     },
    { title: servicesList[4], icon: Cpu        },
    { title: servicesList[5], icon: Lightbulb  },
    { title: servicesList[6], icon: Layout     },
  ];

  return (
    <motion.div
      className="w-full bg-transparent py-16 px-4 md:px-6 relative z-10"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
    >
      <div className="mx-auto max-w-4xl space-y-8">

        {/* ── Main Flat Card ──────────────────────────────────────── */}
        <motion.div
          className="card-flat p-8 md:p-12 relative overflow-hidden rounded-3xl"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          {/* Ambient corner glows */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/[0.06] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/[0.05] rounded-full blur-[100px] pointer-events-none" />

          {/* Title */}
          <h2
            className={`mt-2 mb-6 text-center text-4xl md:text-5xl font-extrabold text-foreground leading-relaxed tracking-normal ${i18n.language === 'ar' ? 'font-alexandria' : 'font-outfit'}`}
            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          >
            <SlitScanText text={t('vision.title')} delay={0.2} />
          </h2>
          <motion.p 
            className={`mb-10 text-center text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 md:text-2xl tracking-wide ${i18n.language === 'ar' ? 'font-alexandria' : 'font-outfit'}`} 
            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {t('vision.subtitle')}
          </motion.p>

          {/* Body Text */}
          <div
            className={`mb-12 text-center text-base leading-loose text-muted-foreground md:text-lg max-w-3xl mx-auto ${i18n.language === 'ar' ? 'font-alexandria' : 'font-outfit'}`}
            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
          >
            <TypewriterText text={t('vision.desc')} delay={600} speed={25} />
          </div>

          <div className="mb-6" />

          {/* ── Services Grid ───────────────────────────────────────────── */}
          <motion.div
            className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              const color = SERVICE_COLORS[index % SERVICE_COLORS.length];
              const glow  = SERVICE_GLOW[index % SERVICE_GLOW.length];

              return (
                <motion.div
                  key={index}
                  onMouseEnter={() => { if (playHoverTick) playHoverTick(); }}
                  className="relative overflow-hidden flex items-center gap-4 rounded-2xl border border-border/50 bg-background/50 dark:bg-[#111113]/40 p-4.5 backdrop-blur-md transition-all duration-300 cursor-pointer group"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.2 + index * 0.03 }}
                  whileHover={{
                    scale: 1.02,
                    borderColor: color.replace('0.9', '0.5'),
                    boxShadow: `0 0 25px -4px ${color.replace('0.9', '0.35')}, inset 0 0 15px -2px ${color.replace('0.9', '0.15')}`,
                  }}
                >
                  {/* Subtle inner radial glow overlay */}
                  <div
                    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${color.replace('0.9', '0.18')}, transparent 70%)`,
                    }}
                  />

                  {/* Icon bubble */}
                  <div
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: glow,
                      border: `1px solid ${color.replace('0.9', '0.3')}`,
                      boxShadow: `0 0 10px 0 ${color.replace('0.9', '0.15')}`,
                    }}
                  >
                    <Icon
                      className="h-5.5 w-5.5 transition-colors duration-300"
                      style={{ color }}
                    />
                  </div>

                  <span
                    className={`relative z-10 text-sm font-semibold text-foreground sm:text-base leading-snug group-hover:text-primary transition-colors ${i18n.language === 'ar' ? 'font-alexandria' : 'font-outfit'}`}
                    dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {service.title}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OurVision;
