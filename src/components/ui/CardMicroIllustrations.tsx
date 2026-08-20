import React from 'react';
import { useTranslation } from 'react-i18next';

interface MicroUIProps {
  color?: string;
  type: 'terminal' | 'analytics' | 'design' | 'app' | 'data' | 'hardware' | 'ai';
}

export const CardMicroIllustration: React.FC<MicroUIProps> = ({ color = '#a855f7', type }) => {
  const { t } = useTranslation();

  return (
    <div 
      className="w-full h-full relative overflow-hidden flex items-center justify-center p-3 select-none group cursor-pointer"
      style={{
        background: `radial-gradient(circle at 50% 30%, ${color}28 0%, rgba(6, 6, 12, 0.98) 85%)`,
      }}
    >
      {/* Subtle Ambient Grid Background */}
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

      {/* ── TYPE 1: VOICE AI & CONVERSATIONAL (2D SVG Studio Microphone + Audio Waves) ── */}
      {type === 'terminal' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-36 h-32 drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]" viewBox="0 0 100 100" fill="none">
            {/* Outer Sound Waves */}
            <path d="M20 50 C20 30 35 15 50 15 C65 15 80 30 80 50" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.5" className="animate-pulse" />
            <path d="M10 50 C10 20 28 5 50 5 C72 5 90 20 90 50" stroke={color} strokeWidth="2" strokeDasharray="4 4" opacity="0.35" />
            
            {/* Microphone Body */}
            <rect x="38" y="22" width="24" height="38" rx="12" fill="url(#mic-grad)" stroke="#ffffff" strokeWidth="2" />
            <line x1="38" y1="34" x2="62" y2="34" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
            <line x1="38" y1="44" x2="62" y2="44" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
            
            {/* Stand Base */}
            <path d="M30 48 C30 62 40 70 50 70 C60 70 70 62 70 48" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            <line x1="50" y1="70" x2="50" y2="85" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="36" y1="85" x2="64" y2="85" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />

            {/* Glowing Accent Indicator */}
            <circle cx="50" cy="30" r="3" fill="#38bdf8" className="animate-ping" />

            <defs>
              <linearGradient id="mic-grad" x1="38" y1="22" x2="62" y2="60">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="mt-2 text-center">
            <span className="text-[12px] font-bold text-white tracking-wider block font-sans">
              {t('vision.card_badges.voice_ai', 'الذكاء الاصطناعي الصوتي')}
            </span>
            <span className="text-[10px] text-purple-200 font-sans bg-purple-500/25 px-2.5 py-0.5 rounded-full border border-purple-400/40 inline-block mt-0.5">
              {t('vision.card_badges.voice_sub', 'استجابة فورية < 1.3 ثانية')}
            </span>
          </div>
        </div>
      )}

      {/* ── TYPE 2: ENTERPRISE ERP (2D SVG Financial Bar Chart & Growth Arrow) ── */}
      {type === 'analytics' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-40 h-32 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" viewBox="0 0 120 90" fill="none">
            {/* Chart Grid Lines */}
            <line x1="15" y1="75" x2="110" y2="75" stroke="#ffffff25" strokeWidth="1.5" />
            <line x1="15" y1="50" x2="110" y2="50" stroke="#ffffff15" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="15" y1="25" x2="110" y2="25" stroke="#ffffff15" strokeWidth="1" strokeDasharray="3 3" />

            {/* 2D Bar Columns */}
            <rect x="25" y="45" width="14" height="30" rx="3" fill="url(#bar-1)" />
            <rect x="47" y="30" width="14" height="45" rx="3" fill="url(#bar-2)" />
            <rect x="69" y="55" width="14" height="20" rx="3" fill="url(#bar-1)" />
            <rect x="91" y="15" width="14" height="60" rx="3" fill="url(#bar-3)" />

            {/* Growth Arrow Trend */}
            <path d="M22 52 L45 35 L68 58 L98 12" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="98,8 106,18 92,16" fill="#34d399" />

            <defs>
              <linearGradient id="bar-1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="bar-2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>
              <linearGradient id="bar-3" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="mt-2 text-center">
            <span className="text-[12px] font-bold text-white tracking-wider block font-sans">
              {t('vision.card_badges.erp', 'الأنظمة الإدارية والتجارية')}
            </span>
            <span className="text-[10px] text-emerald-200 font-sans bg-emerald-500/25 px-2.5 py-0.5 rounded-full border border-emerald-400/40 inline-block mt-0.5">
              {t('vision.card_badges.erp_sub', 'إدارة الموارد ERP')}
            </span>
          </div>
        </div>
      )}

      {/* ── TYPE 3: UI/UX & SIMULATION LAB (2D SVG Wireframe Canvas & Cursor) ── */}
      {type === 'design' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-40 h-32 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]" viewBox="0 0 120 90" fill="none">
            {/* Canvas Window Frame */}
            <rect x="15" y="10" width="90" height="68" rx="6" fill="#090a10" stroke="#f43f5e" strokeWidth="2" />
            <path d="M15 24 L105 24" stroke="#f43f5e" strokeWidth="1.5" opacity="0.4" />
            <circle cx="23" cy="17" r="2" fill="#f43f5e" />
            <circle cx="29" cy="17" r="2" fill="#f59e0b" />
            <circle cx="35" cy="17" r="2" fill="#10b981" />

            {/* Wireframe Layout Elements */}
            <rect x="23" y="32" width="30" height="38" rx="4" fill="#f43f5e20" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" />
            <rect x="59" y="32" width="38" height="12" rx="3" fill="#fb718530" stroke="#fb7185" strokeWidth="1.5" />
            <rect x="59" y="48" width="24" height="6" rx="2" fill="#ffffff50" />
            <rect x="59" y="58" width="38" height="12" rx="3" fill="#f43f5e40" stroke="#f43f5e" strokeWidth="1.5" />

            {/* 2D Vector Cursor */}
            <path d="M75 52 L88 70 L82 72 L77 62 L71 65 Z" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
          </svg>
          <div className="mt-2 text-center">
            <span className="text-[12px] font-bold text-white tracking-wider block font-sans">
              {t('vision.card_badges.design', 'تصميم الواجهات والمحاكاة')}
            </span>
            <span className="text-[10px] text-rose-200 font-sans bg-rose-500/25 px-2.5 py-0.5 rounded-full border border-rose-400/40 inline-block mt-0.5">
              {t('vision.card_badges.design_sub', 'مختبرات افتراضية 60 FPS')}
            </span>
          </div>
        </div>
      )}

      {/* ── TYPE 4: UNIFIED MULTI-PLATFORM (2D SVG Monitor + Smartphone) ── */}
      {type === 'app' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-44 h-32 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" viewBox="0 0 130 90" fill="none">
            {/* Desktop Monitor */}
            <rect x="10" y="10" width="70" height="48" rx="4" fill="#090a10" stroke="#f59e0b" strokeWidth="2" />
            <line x1="45" y1="58" x2="45" y2="68" stroke="#f59e0b" strokeWidth="2.5" />
            <line x1="30" y1="68" x2="60" y2="68" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
            <rect x="16" y="18" width="58" height="32" rx="2" fill="#f59e0b20" />

            {/* Smartphone */}
            <rect x="85" y="20" width="32" height="52" rx="5" fill="#090a10" stroke="#fbbf24" strokeWidth="2" />
            <rect x="89" y="26" width="24" height="40" rx="2" fill="#fbbf2420" />
            <circle cx="101" cy="23" r="1" fill="#ffffff" />

            {/* Connection Sync Lines */}
            <path d="M76 34 L89 34" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" className="animate-pulse" />
          </svg>
          <div className="mt-2 text-center">
            <span className="text-[12px] font-bold text-white tracking-wider block font-sans">
              {t('vision.card_badges.multiplatform', 'ويب · أندرويد · ويندوز')}
            </span>
            <span className="text-[10px] text-amber-200 font-sans bg-amber-500/25 px-2.5 py-0.5 rounded-full border border-amber-400/40 inline-block mt-0.5">
              {t('vision.card_badges.multiplatform_sub', 'كود واحد ➔ 3 منصات')}
            </span>
          </div>
        </div>
      )}

      {/* ── TYPE 5: DATABASE & HARDENED SECURITY (2D SVG Database Stack & Shield) ── */}
      {type === 'data' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-40 h-32 drop-shadow-[0_0_20px_rgba(14,165,233,0.5)]" viewBox="0 0 120 90" fill="none">
            {/* Database Cylinders */}
            <g transform="translate(15, 10)">
              {/* Cylinder 3 (Bottom) */}
              <path d="M10 42 C10 34 70 34 70 42 L70 54 C70 62 10 62 10 54 Z" fill="url(#db-grad-1)" stroke="#0ea5e9" strokeWidth="1.5" />
              <ellipse cx="40" cy="42" rx="30" ry="8" fill="#0ea5e940" stroke="#0ea5e9" strokeWidth="1.5" />

              {/* Cylinder 2 (Middle) */}
              <path d="M10 24 C10 16 70 16 70 24 L70 36 C70 44 10 44 10 36 Z" fill="url(#db-grad-1)" stroke="#0ea5e9" strokeWidth="1.5" />
              <ellipse cx="40" cy="24" rx="30" ry="8" fill="#0ea5e940" stroke="#0ea5e9" strokeWidth="1.5" />

              {/* Cylinder 1 (Top) */}
              <path d="M10 6 C10 -2 70 -2 70 6 L70 18 C70 26 10 26 10 18 Z" fill="url(#db-grad-1)" stroke="#0ea5e9" strokeWidth="1.5" />
              <ellipse cx="40" cy="6" rx="30" ry="8" fill="#0ea5e960" stroke="#0ea5e9" strokeWidth="1.5" />
            </g>

            {/* Security Shield Overlay */}
            <g transform="translate(68, 30)">
              <path d="M20 0 L38 8 V24 C38 36 20 44 20 44 C20 44 2 36 2 24 V8 Z" fill="#090a10" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="20" cy="18" r="4" fill="#38bdf8" />
              <path d="M20 22 V28" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            </g>

            <defs>
              <linearGradient id="db-grad-1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="mt-2 text-center">
            <span className="text-[12px] font-bold text-white tracking-wider block font-sans">
              {t('vision.card_badges.security', 'أنظمة البيانات والأمان')}
            </span>
            <span className="text-[10px] text-cyan-200 font-sans bg-cyan-500/25 px-2.5 py-0.5 rounded-full border border-cyan-400/40 inline-block mt-0.5">
              {t('vision.card_badges.security_sub', 'PostgreSQL · حماية RLS')}
            </span>
          </div>
        </div>
      )}

      {/* ── TYPE 6: EMBEDDED & HARDWARE IOT (2D SVG Microchip CPU & Traces) ── */}
      {type === 'hardware' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-40 h-32 drop-shadow-[0_0_20px_rgba(132,204,22,0.5)]" viewBox="0 0 120 90" fill="none">
            {/* PCB Traces */}
            <path d="M10 20 L35 20 M10 45 L35 45 M10 70 L35 70" stroke="#84cc16" strokeWidth="2" strokeOpacity="0.6" />
            <path d="M85 20 L110 20 M85 45 L110 45 M85 70 L110 70" stroke="#84cc16" strokeWidth="2" strokeOpacity="0.6" />
            <path d="M40 5 L40 25 M60 5 L60 25 M80 5 L80 25" stroke="#84cc16" strokeWidth="2" strokeOpacity="0.6" />
            <path d="M40 65 L40 85 M60 65 L60 85 M80 65 L80 85" stroke="#84cc16" strokeWidth="2" strokeOpacity="0.6" />

            {/* Microchip Package */}
            <rect x="35" y="22" width="50" height="46" rx="6" fill="#090a10" stroke="#84cc16" strokeWidth="2.5" />
            <rect x="43" y="30" width="34" height="30" rx="3" fill="#84cc1625" stroke="#84cc16" strokeWidth="1.5" />
            <text x="60" y="48" fill="#ffffff" fontStyle="mono" fontSize="10" fontWeight="bold" textAnchor="middle">MCU</text>
          </svg>
          <div className="mt-2 text-center">
            <span className="text-[12px] font-bold text-white tracking-wider block font-sans">
              {t('vision.card_badges.hardware', 'الأنظمة المدمجة والهاردوير')}
            </span>
            <span className="text-[10px] text-lime-200 font-sans bg-lime-500/25 px-2.5 py-0.5 rounded-full border border-lime-400/40 inline-block mt-0.5">
              {t('vision.card_badges.hardware_sub', 'معالجات 32-Bit')}
            </span>
          </div>
        </div>
      )}

      {/* ── TYPE 7: AI INFRASTRUCTURE & GPU CLUSTER (2D SVG Neural Network Matrix) ── */}
      {type === 'ai' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-40 h-32 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]" viewBox="0 0 120 90" fill="none">
            {/* Neural Synapse Connections */}
            <line x1="25" y1="25" x2="60" y2="15" stroke="#6366f1" strokeWidth="1.5" opacity="0.6" />
            <line x1="25" y1="25" x2="60" y2="45" stroke="#6366f1" strokeWidth="1.5" opacity="0.6" />
            <line x1="25" y1="65" x2="60" y2="45" stroke="#6366f1" strokeWidth="1.5" opacity="0.6" />
            <line x1="25" y1="65" x2="60" y2="75" stroke="#6366f1" strokeWidth="1.5" opacity="0.6" />

            <line x1="60" y1="15" x2="95" y2="30" stroke="#818cf8" strokeWidth="1.5" opacity="0.6" />
            <line x1="60" y1="45" x2="95" y2="30" stroke="#818cf8" strokeWidth="1.5" opacity="0.6" />
            <line x1="60" y1="45" x2="95" y2="60" stroke="#818cf8" strokeWidth="1.5" opacity="0.6" />
            <line x1="60" y1="75" x2="95" y2="60" stroke="#818cf8" strokeWidth="1.5" opacity="0.6" />

            {/* Neural Nodes */}
            <circle cx="25" cy="25" r="7" fill="#090a10" stroke="#6366f1" strokeWidth="2" />
            <circle cx="25" cy="65" r="7" fill="#090a10" stroke="#6366f1" strokeWidth="2" />

            <circle cx="60" cy="15" r="7" fill="#090a10" stroke="#818cf8" strokeWidth="2" />
            <circle cx="60" cy="45" r="9" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
            <circle cx="60" cy="75" r="7" fill="#090a10" stroke="#818cf8" strokeWidth="2" />

            <circle cx="95" cy="30" r="7" fill="#090a10" stroke="#a855f7" strokeWidth="2" />
            <circle cx="95" cy="60" r="7" fill="#090a10" stroke="#a855f7" strokeWidth="2" />

            {/* Pulse Signal Node */}
            <circle cx="60" cy="45" r="3" fill="#ffffff" className="animate-ping" />
          </svg>
          <div className="mt-2 text-center">
            <span className="text-[12px] font-bold text-white tracking-wider block font-sans">
              {t('vision.card_badges.ai_infra', 'البنية التحتية للذكاء الاصطناعي')}
            </span>
            <span className="text-[10px] text-indigo-200 font-sans bg-indigo-500/25 px-2.5 py-0.5 rounded-full border border-indigo-400/40 inline-block mt-0.5">
              {t('vision.card_badges.ai_infra_sub', 'استدلال عالي السرعة')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
