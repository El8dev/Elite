import React from 'react';
import { useTranslation } from 'react-i18next';

export type MicroType =
  | 'terminal'
  | 'analytics'
  | 'design'
  | 'app'
  | 'data'
  | 'hardware'
  | 'ai'
  | 'service_web'
  | 'service_erp'
  | 'service_uiux'
  | 'service_ai';

interface MicroUIProps {
  color?: string;
  type: MicroType;
}

interface IllustrationConfig {
  src: string;
  glow: string;
  badgeKey: string;
  badgeFallback: string;
  subKey: string;
  subFallback: string;
  tagColorClass: string;
}

const CONFIG: Record<MicroType, IllustrationConfig> = {
  terminal: {
    src: '/illustrations/voice_ai.svg',
    glow: 'rgba(139,92,246,0.55)',
    badgeKey: 'vision.card_badges.voice_ai',
    badgeFallback: 'الذكاء الاصطناعي الصوتي',
    subKey: 'vision.card_badges.voice_sub',
    subFallback: 'استجابة فورية < 1.3 ثانية',
    tagColorClass: 'text-purple-200 bg-purple-500/25 border-purple-400/40',
  },
  analytics: {
    src: '/illustrations/erp.svg',
    glow: 'rgba(16,185,129,0.55)',
    badgeKey: 'vision.card_badges.erp',
    badgeFallback: 'الأنظمة الإدارية والتجارية',
    subKey: 'vision.card_badges.erp_sub',
    subFallback: 'إدارة الموارد ERP',
    tagColorClass: 'text-emerald-200 bg-emerald-500/25 border-emerald-400/40',
  },
  design: {
    src: '/illustrations/design.svg',
    glow: 'rgba(244,63,94,0.55)',
    badgeKey: 'vision.card_badges.design',
    badgeFallback: 'تصميم الواجهات والمحاكاة',
    subKey: 'vision.card_badges.design_sub',
    subFallback: 'مختبرات افتراضية 60 FPS',
    tagColorClass: 'text-rose-200 bg-rose-500/25 border-rose-400/40',
  },
  app: {
    src: '/illustrations/app.svg',
    glow: 'rgba(245,158,11,0.55)',
    badgeKey: 'vision.card_badges.multiplatform',
    badgeFallback: 'ويب · أندرويد · ويندوز',
    subKey: 'vision.card_badges.multiplatform_sub',
    subFallback: 'كود واحد ➔ 3 منصات',
    tagColorClass: 'text-amber-200 bg-amber-500/25 border-amber-400/40',
  },
  data: {
    src: '/illustrations/data.svg',
    glow: 'rgba(14,165,233,0.55)',
    badgeKey: 'vision.card_badges.security',
    badgeFallback: 'أنظمة البيانات والأمان',
    subKey: 'vision.card_badges.security_sub',
    subFallback: 'PostgreSQL · حماية RLS',
    tagColorClass: 'text-cyan-200 bg-cyan-500/25 border-cyan-400/40',
  },
  hardware: {
    src: '/illustrations/hardware.svg',
    glow: 'rgba(132,204,22,0.55)',
    badgeKey: 'vision.card_badges.hardware',
    badgeFallback: 'الأنظمة المدمجة والهاردوير',
    subKey: 'vision.card_badges.hardware_sub',
    subFallback: 'معالجات 32-Bit',
    tagColorClass: 'text-lime-200 bg-lime-500/25 border-lime-400/40',
  },
  ai: {
    src: '/illustrations/ai.svg',
    glow: 'rgba(99,102,241,0.55)',
    badgeKey: 'vision.card_badges.ai_infra',
    badgeFallback: 'البنية التحتية للذكاء الاصطناعي',
    subKey: 'vision.card_badges.ai_infra_sub',
    subFallback: 'استدلال عالي السرعة',
    tagColorClass: 'text-indigo-200 bg-indigo-500/25 border-indigo-400/40',
  },
  service_web: {
    src: '/illustrations/service_web.svg',
    glow: 'rgba(245,158,11,0.55)',
    badgeKey: 'vision.card_badges.service_web',
    badgeFallback: 'بناء التطبيقات البرمجية',
    subKey: 'vision.card_badges.service_web_sub',
    subFallback: 'أداء فائق + تجربة سلسة',
    tagColorClass: 'text-amber-200 bg-amber-500/25 border-amber-400/40',
  },
  service_erp: {
    src: '/illustrations/service_erp.svg',
    glow: 'rgba(16,185,129,0.55)',
    badgeKey: 'vision.card_badges.service_erp',
    badgeFallback: 'أتمتة العمليات الإدارية',
    subKey: 'vision.card_badges.service_erp_sub',
    subFallback: 'لوحات تحكم متكاملة ERP',
    tagColorClass: 'text-emerald-200 bg-emerald-500/25 border-emerald-400/40',
  },
  service_uiux: {
    src: '/illustrations/service_uiux.svg',
    glow: 'rgba(236,72,153,0.55)',
    badgeKey: 'vision.card_badges.service_uiux',
    badgeFallback: 'هندسة واجهات المستقبل',
    subKey: 'vision.card_badges.service_uiux_sub',
    subFallback: 'أنظمة تصميم متطورة',
    tagColorClass: 'text-pink-200 bg-pink-500/25 border-pink-400/40',
  },
  service_ai: {
    src: '/illustrations/service_ai.svg',
    glow: 'rgba(139,92,246,0.55)',
    badgeKey: 'vision.card_badges.service_ai',
    badgeFallback: 'حلول الأنظمة الذكية',
    subKey: 'vision.card_badges.service_ai_sub',
    subFallback: 'معالجة واستدلال فوري',
    tagColorClass: 'text-purple-200 bg-purple-500/25 border-purple-400/40',
  },
};

export const CardMicroIllustration: React.FC<MicroUIProps> = ({ color = '#a855f7', type }) => {
  const { t } = useTranslation();
  const cfg = CONFIG[type] || CONFIG.terminal;

  return (
    <div 
      className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center p-3 select-none group cursor-pointer"
      style={{
        background: `radial-gradient(circle at 50% 30%, ${color}28 0%, rgba(6, 6, 12, 0.98) 85%)`,
      }}
    >
      {/* Ambient Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(to right, ${color}30 1px, transparent 1px), linear-gradient(to bottom, ${color}30 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Radial Aura Glow */}
      <div 
        className="absolute w-44 h-44 rounded-full blur-3xl opacity-25 pointer-events-none group-hover:scale-125 transition-transform duration-700"
        style={{ background: color }}
      />

      {/* Pre-built Static SVG Asset + Localized Badge */}
      <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
        <img
          src={cfg.src}
          alt=""
          width={90}
          height={68}
          loading="lazy"
          decoding="async"
          className="card-micro-illustration-img object-contain pointer-events-none select-none transition-transform duration-500"
          style={{
            maxWidth: '90px',
            maxHeight: '68px',
            width: 'auto',
            height: 'auto',
            filter: `drop-shadow(0 0 14px ${cfg.glow})`,
          }}
        />
        <div className="mt-2 text-center">
          <span className="text-[12px] font-bold text-white tracking-wider block font-sans">
            {t(cfg.badgeKey, cfg.badgeFallback)}
          </span>
          <span className={`text-[10px] font-sans px-2.5 py-0.5 rounded-full border inline-block mt-0.5 ${cfg.tagColorClass}`}>
            {t(cfg.subKey, cfg.subFallback)}
          </span>
        </div>
      </div>
    </div>
  );
};
