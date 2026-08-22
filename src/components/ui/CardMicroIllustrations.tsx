import React from 'react';
import { useTranslation } from 'react-i18next';

interface MicroUIProps {
  color?: string;
  type: 'terminal' | 'analytics' | 'design' | 'app' | 'data' | 'hardware' | 'ai' | 'service_web' | 'service_erp' | 'service_uiux' | 'service_ai';
}

export const CardMicroIllustration: React.FC<MicroUIProps> = ({ color = '#a855f7', type }) => {
  const { t } = useTranslation();

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

      {/* ── TYPE 1: VOICE AI & CONVERSATIONAL (Detailed 2D Studio Mic + Equalizer + Waveform) ── */}
      {type === 'terminal' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-40 h-32 drop-shadow-[0_0_20px_rgba(139,92,246,0.55)]" viewBox="0 0 120 90" fill="none">
            <defs>
              <linearGradient id="mic-body-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#4c1d95" />
              </linearGradient>
              <linearGradient id="mic-grille-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="eq-bar-grad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
              </linearGradient>
              <filter id="glow-mic" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Audio Spectrum Equalizer Bars */}
            <g opacity="0.45">
              <rect x="18" y="42" width="4" height="24" rx="2" fill="url(#eq-bar-grad)" />
              <rect x="26" y="32" width="4" height="44" rx="2" fill="url(#eq-bar-grad)" />
              <rect x="34" y="24" width="4" height="56" rx="2" fill="url(#eq-bar-grad)" />
              <rect x="82" y="24" width="4" height="56" rx="2" fill="url(#eq-bar-grad)" />
              <rect x="90" y="32" width="4" height="44" rx="2" fill="url(#eq-bar-grad)" />
              <rect x="98" y="42" width="4" height="24" rx="2" fill="url(#eq-bar-grad)" />
            </g>

            {/* Outer Concentric Sound Waves */}
            <path d="M 28 46 C 28 28, 42 16, 60 16 C 78 16, 92 28, 92 46" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 4" opacity="0.6" />
            <path d="M 18 46 C 18 20, 36 6, 60 6 C 84 6, 102 20, 102 46" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />

            {/* Studio Microphone Capsule Body */}
            <rect x="46" y="16" width="28" height="42" rx="14" fill="url(#mic-body-grad)" stroke="#ffffff" strokeWidth="1.5" filter="url(#glow-mic)" />

            {/* Metallic Grille Mesh Lines */}
            <rect x="48" y="18" width="24" height="20" rx="10" fill="url(#mic-grille-grad)" opacity="0.35" />
            <line x1="46" y1="28" x2="74" y2="28" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
            <line x1="46" y1="36" x2="74" y2="36" stroke="#ffffff" strokeWidth="1.2" opacity="0.5" />
            <line x1="60" y1="18" x2="60" y2="40" stroke="#ffffff" strokeWidth="1.2" opacity="0.4" />

            {/* Gold Accent Ring */}
            <rect x="46" y="38" width="28" height="3" fill="#fbbf24" opacity="0.9" />

            {/* U-Mount Bracket & Screws */}
            <path d="M 38 42 C 38 62, 50 68, 60 68 C 70 68, 82 62, 82 42" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="38" cy="42" r="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
            <circle cx="82" cy="42" r="3" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />

            {/* Stand Post & Solid Base */}
            <line x1="60" y1="68" x2="60" y2="82" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="60" cy="83" rx="22" ry="4" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" />

            {/* Status Beacon LED Dot */}
            <circle cx="60" cy="48" r="2.5" fill="#38bdf8" />
            <circle cx="60" cy="48" r="5" fill="#38bdf8" opacity="0.4" />
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

      {/* ── TYPE 2: ENTERPRISE ERP (High-Detail 2D Financial Chart + Trend Line + Data Nodes) ── */}
      {type === 'analytics' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-40 h-32 drop-shadow-[0_0_20px_rgba(16,185,129,0.55)]" viewBox="0 0 120 90" fill="none">
            <defs>
              <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="bar-col-1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="bar-col-2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#065f46" />
              </linearGradient>
              <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background Axis & Dotted Grid */}
            <line x1="15" y1="76" x2="112" y2="76" stroke="#ffffff30" strokeWidth="1.5" />
            <line x1="15" y1="12" x2="15" y2="76" stroke="#ffffff30" strokeWidth="1.5" />
            <line x1="15" y1="54" x2="112" y2="54" stroke="#ffffff15" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="15" y1="32" x2="112" y2="32" stroke="#ffffff15" strokeWidth="1" strokeDasharray="3 3" />

            {/* Shaded Area Under Trend Curve */}
            <path d="M 22 56 L 42 38 L 64 50 L 86 24 L 106 14 L 106 76 L 22 76 Z" fill="url(#chart-area-grad)" />

            {/* 3D-Effect Bar Columns */}
            <rect x="23" y="46" width="12" height="30" rx="3" fill="url(#bar-col-1)" stroke="#6ee7b7" strokeWidth="0.8" opacity="0.8" />
            <rect x="43" y="32" width="12" height="44" rx="3" fill="url(#bar-col-2)" stroke="#6ee7b7" strokeWidth="0.8" />
            <rect x="63" y="44" width="12" height="32" rx="3" fill="url(#bar-col-1)" stroke="#6ee7b7" strokeWidth="0.8" opacity="0.8" />
            <rect x="83" y="20" width="12" height="56" rx="3" fill="url(#bar-col-2)" stroke="#6ee7b7" strokeWidth="0.8" />

            {/* Smooth Spline Growth Trend Line */}
            <path d="M 20 58 Q 32 44 43 36 T 64 50 T 85 24 T 108 12" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-emerald)" />

            {/* Data Point Glowing Ring Nodes */}
            <circle cx="43" cy="36" r="3.5" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
            <circle cx="64" cy="50" r="3.5" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
            <circle cx="85" cy="24" r="3.5" fill="#064e3b" stroke="#6ee7b7" strokeWidth="2" />

            {/* Peak Target Arrow Pin + Callout Tag */}
            <g transform="translate(100, 4)">
              <circle cx="8" cy="8" r="6" fill="#10b981" filter="url(#glow-emerald)" />
              <path d="M 5 8 L 8 5 L 11 8 M 8 5 L 8 11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
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

      {/* ── TYPE 3: UI/UX & SIMULATION LAB (Wireframe Canvas + Bezier Handles + Precision Cursor) ── */}
      {type === 'design' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-40 h-32 drop-shadow-[0_0_20px_rgba(244,63,94,0.55)]" viewBox="0 0 120 90" fill="none">
            <defs>
              <linearGradient id="window-bg-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#181825" />
                <stop offset="100%" stopColor="#090a10" />
              </linearGradient>
              <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Design Window Frame */}
            <rect x="12" y="8" width="96" height="74" rx="7" fill="url(#window-bg-grad)" stroke="#f43f5e" strokeWidth="1.8" />
            <path d="M 12 24 L 108 24" stroke="#f43f5e" strokeWidth="1.2" opacity="0.4" />
            <circle cx="21" cy="16" r="2.5" fill="#f43f5e" />
            <circle cx="28" cy="16" r="2.5" fill="#fbbf24" />
            <circle cx="35" cy="16" r="2.5" fill="#34d399" />
            <rect x="46" y="13" width="34" height="6" rx="3" fill="#ffffff20" />

            {/* Canvas Grid Dots */}
            <circle cx="30" cy="38" r="1" fill="#ffffff25" />
            <circle cx="50" cy="38" r="1" fill="#ffffff25" />
            <circle cx="70" cy="38" r="1" fill="#ffffff25" />
            <circle cx="90" cy="38" r="1" fill="#ffffff25" />
            <circle cx="30" cy="56" r="1" fill="#ffffff25" />
            <circle cx="50" cy="56" r="1" fill="#ffffff25" />
            <circle cx="70" cy="56" r="1" fill="#ffffff25" />
            <circle cx="90" cy="56" r="1" fill="#ffffff25" />

            {/* Wireframe Layout Cards */}
            <rect x="20" y="32" width="28" height="42" rx="4" fill="#f43f5e18" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3 2" />
            <rect x="54" y="32" width="46" height="14" rx="3" fill="#fb718525" stroke="#fb7185" strokeWidth="1.2" />
            <rect x="54" y="52" width="46" height="22" rx="4" fill="#f43f5e30" stroke="#f43f5e" strokeWidth="1.2" />

            {/* Bezier Vector Curve with Handle Controls */}
            <path d="M 24 64 Q 38 40 58 54 T 94 40" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" fill="none" />
            <line x1="38" y1="40" x2="58" y2="54" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />
            <circle cx="38" cy="40" r="3" fill="#ffffff" stroke="#f43f5e" strokeWidth="1.5" />
            <circle cx="58" cy="54" r="3" fill="#ffffff" stroke="#f43f5e" strokeWidth="1.5" />

            {/* Vector Tool Cursor */}
            <g transform="translate(74, 46)">
              <path d="M 0 0 L 14 18 L 9 19 L 5 28 L 0 25 Z" fill="#ffffff" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" filter="url(#glow-rose)" />
              <circle cx="0" cy="0" r="8" stroke="#f43f5e" strokeWidth="1.5" fill="none" opacity="0.5" />
            </g>
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

      {/* ── TYPE 4: UNIFIED MULTI-PLATFORM (Desktop Monitor + Tablet + Smartphone + Sync Waves) ── */}
      {type === 'app' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-44 h-32 drop-shadow-[0_0_20px_rgba(245,158,11,0.55)]" viewBox="0 0 130 90" fill="none">
            <defs>
              <linearGradient id="screen-desktop-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#090a10" />
              </linearGradient>
              <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Desktop Monitor Screen */}
            <rect x="8" y="8" width="76" height="50" rx="5" fill="url(#screen-desktop-grad)" stroke="#f59e0b" strokeWidth="1.8" />
            <rect x="14" y="14" width="64" height="34" rx="3" fill="#f59e0b12" />

            {/* Code / UI Lines in Desktop */}
            <rect x="18" y="18" width="24" height="4" rx="2" fill="#fbbf24" opacity="0.9" />
            <rect x="46" y="18" width="26" height="4" rx="2" fill="#38bdf8" opacity="0.7" />
            <rect x="18" y="26" width="38" height="4" rx="2" fill="#a855f7" opacity="0.8" />
            <rect x="18" y="34" width="20" height="4" rx="2" fill="#34d399" opacity="0.8" />
            <rect x="42" y="34" width="30" height="4" rx="2" fill="#f43f5e" opacity="0.7" />

            {/* Desktop Stand */}
            <path d="M 46 58 L 46 68 M 32 68 L 60 68" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

            {/* Smartphone Overlay (Foreground Right) */}
            <g transform="translate(82, 18)">
              <rect x="0" y="0" width="36" height="58" rx="6" fill="#090a10" stroke="#fbbf24" strokeWidth="2" filter="url(#glow-amber)" />
              <rect x="4" y="6" width="28" height="44" rx="3" fill="#fbbf2418" />
              {/* Phone Notch & Home Dot */}
              <rect x="13" y="2" width="10" height="2" rx="1" fill="#ffffff50" />
              <circle cx="18" cy="53" r="1.5" fill="#ffffff" opacity="0.7" />
              {/* Mobile App Grid Icons */}
              <rect x="8" y="10" width="9" height="9" rx="2" fill="#f59e0b" />
              <rect x="21" y="10" width="9" height="9" rx="2" fill="#38bdf8" />
              <rect x="8" y="23" width="9" height="9" rx="2" fill="#a855f7" />
              <rect x="21" y="23" width="9" height="9" rx="2" fill="#34d399" />
              <rect x="8" y="36" width="22" height="8" rx="2" fill="#fbbf2460" />
            </g>

            {/* Wireless Sync Waves */}
            <path d="M 74 32 C 78 28, 80 28, 84 32" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M 72 38 C 78 32, 80 32, 86 38" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" fill="none" opacity="0.6" />
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

      {/* ── TYPE 5: DATABASE & HARDENED SECURITY (3D Database Cylinders + Glowing Shield + Keyhole) ── */}
      {type === 'data' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-40 h-32 drop-shadow-[0_0_20px_rgba(14,165,233,0.55)]" viewBox="0 0 120 90" fill="none">
            <defs>
              <linearGradient id="db-body-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="shield-face-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
              </linearGradient>
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 3 Tiered Database Cylinders */}
            <g transform="translate(10, 6)">
              {/* Cylinder 3 (Bottom) */}
              <path d="M 8 46 C 8 38, 64 38, 64 46 L 64 58 C 64 66, 8 66, 8 58 Z" fill="url(#db-body-grad)" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
              <ellipse cx="36" cy="46" rx="28" ry="8" fill="#38bdf840" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="20" cy="54" r="2" fill="#34d399" />
              <circle cx="27" cy="54" r="2" fill="#38bdf8" />

              {/* Cylinder 2 (Middle) */}
              <path d="M 8 26 C 8 18, 64 18, 64 26 L 64 38 C 64 46, 8 46, 8 38 Z" fill="url(#db-body-grad)" stroke="#38bdf8" strokeWidth="1.5" opacity="0.9" />
              <ellipse cx="36" cy="26" rx="28" ry="8" fill="#38bdf850" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="20" cy="34" r="2" fill="#34d399" />
              <circle cx="27" cy="34" r="2" fill="#38bdf8" />

              {/* Cylinder 1 (Top) */}
              <path d="M 8 6 C 8 -2, 64 -2, 64 6 L 64 18 C 64 26, 8 26, 8 18 Z" fill="url(#db-body-grad)" stroke="#38bdf8" strokeWidth="1.5" />
              <ellipse cx="36" cy="6" rx="28" ry="8" fill="#38bdf870" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="20" cy="14" r="2" fill="#34d399" />
              <circle cx="27" cy="14" r="2" fill="#38bdf8" />
            </g>

            {/* Hardened Security Shield Overlay (Foreground Right) */}
            <g transform="translate(64, 20)">
              <path d="M 24 0 L 44 9 V 28 C 44 42, 24 52, 24 52 C 24 52, 4 42, 4 28 V 9 Z" fill="url(#shield-face-grad)" stroke="#38bdf8" strokeWidth="2.5" filter="url(#glow-cyan)" />
              {/* Inner Shield Grid Rim */}
              <path d="M 24 5 L 39 12 V 27 C 39 38, 24 46, 24 46 C 24 46, 9 38, 9 27 V 12 Z" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" fill="none" opacity="0.6" />
              {/* Encrypted Keyhole Core */}
              <circle cx="24" cy="22" r="4.5" fill="#38bdf8" />
              <path d="M 22 24 L 26 24 L 27 32 L 21 32 Z" fill="#38bdf8" />
            </g>
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

      {/* ── TYPE 6: EMBEDDED HARDWARE IOT (Detailed MCU Chip + Gold Pins + Circuit Traces) ── */}
      {type === 'hardware' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-40 h-32 drop-shadow-[0_0_20px_rgba(132,204,22,0.55)]" viewBox="0 0 120 90" fill="none">
            <defs>
              <linearGradient id="chip-body-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#090a10" />
              </linearGradient>
              <linearGradient id="gold-pin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
              <filter id="glow-lime" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* PCB Board Circuit Traces */}
            <g stroke="#84cc16" strokeWidth="1.8" opacity="0.6" strokeLinecap="round">
              <path d="M 8 18 L 34 18 M 8 45 L 34 45 M 8 72 L 34 72" />
              <path d="M 86 18 L 112 18 M 86 45 L 112 45 M 86 72 L 112 72" />
              <path d="M 42 6 L 42 22 M 60 6 L 60 22 M 78 6 L 78 22" />
              <path d="M 42 68 L 42 84 M 60 68 L 60 84 M 78 68 L 78 84" />
            </g>

            {/* PCB Trace Vias */}
            <circle cx="8" cy="18" r="2.5" fill="#090a10" stroke="#84cc16" strokeWidth="1.5" />
            <circle cx="8" cy="45" r="2.5" fill="#090a10" stroke="#84cc16" strokeWidth="1.5" />
            <circle cx="8" cy="72" r="2.5" fill="#090a10" stroke="#84cc16" strokeWidth="1.5" />
            <circle cx="112" cy="18" r="2.5" fill="#090a10" stroke="#84cc16" strokeWidth="1.5" />
            <circle cx="112" cy="45" r="2.5" fill="#090a10" stroke="#84cc16" strokeWidth="1.5" />
            <circle cx="112" cy="72" r="2.5" fill="#090a10" stroke="#84cc16" strokeWidth="1.5" />

            {/* Microchip Gold Pins (16 Pins Header) */}
            <g fill="url(#gold-pin)">
              {/* Left Pins */}
              <rect x="28" y="26" width="8" height="4" rx="1" />
              <rect x="28" y="36" width="8" height="4" rx="1" />
              <rect x="28" y="46" width="8" height="4" rx="1" />
              <rect x="28" y="56" width="8" height="4" rx="1" />
              {/* Right Pins */}
              <rect x="84" y="26" width="8" height="4" rx="1" />
              <rect x="84" y="36" width="8" height="4" rx="1" />
              <rect x="84" y="46" width="8" height="4" rx="1" />
              <rect x="84" y="56" width="8" height="4" rx="1" />
              {/* Top Pins */}
              <rect x="40" y="16" width="4" height="8" rx="1" />
              <rect x="50" y="16" width="4" height="8" rx="1" />
              <rect x="66" y="16" width="4" height="8" rx="1" />
              <rect x="76" y="16" width="4" height="8" rx="1" />
              {/* Bottom Pins */}
              <rect x="40" y="66" width="4" height="8" rx="1" />
              <rect x="50" y="66" width="4" height="8" rx="1" />
              <rect x="66" y="66" width="4" height="8" rx="1" />
              <rect x="76" y="66" width="4" height="8" rx="1" />
            </g>

            {/* MCU Chip Package Body */}
            <rect x="34" y="22" width="52" height="46" rx="5" fill="url(#chip-body-grad)" stroke="#84cc16" strokeWidth="2" filter="url(#glow-lime)" />
            {/* Silicon Heat Spreader Die Ring */}
            <rect x="42" y="28" width="36" height="34" rx="3" fill="#84cc1618" stroke="#84cc16" strokeWidth="1.2" />

            {/* Pin 1 Index Dot */}
            <circle cx="39" cy="27" r="2" fill="#84cc16" />

            {/* Engraved Chip Markings */}
            <text x="60" y="44" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="monospace" textAnchor="middle">EL8 MCU</text>
            <text x="60" y="54" fill="#a3e635" fontSize="7" fontFamily="monospace" textAnchor="middle">32-BIT RISC</text>
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

      {/* ── TYPE 7: AI INFRASTRUCTURE (Neural Network Matrix + Glowing Synapse Connectors + Core Tensor Node) ── */}
      {type === 'ai' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-40 h-32 drop-shadow-[0_0_20px_rgba(99,102,241,0.55)]" viewBox="0 0 120 90" fill="none">
            <defs>
              <linearGradient id="core-tensor-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
              <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Neural Matrix Synapse Cables */}
            <g stroke="#6366f1" strokeWidth="1.5" opacity="0.6">
              <line x1="22" y1="22" x2="60" y2="14" />
              <line x1="22" y1="22" x2="60" y2="45" />
              <line x1="22" y1="68" x2="60" y2="45" />
              <line x1="22" y1="68" x2="60" y2="76" />
              <line x1="60" y1="14" x2="98" y2="28" stroke="#818cf8" />
              <line x1="60" y1="45" x2="98" y2="28" stroke="#818cf8" />
              <line x1="60" y1="45" x2="98" y2="62" stroke="#818cf8" />
              <line x1="60" y1="76" x2="98" y2="62" stroke="#818cf8" />
            </g>

            {/* Active Data Signal Pulse Nodes Along Lines */}
            <circle cx="41" cy="18" r="2.5" fill="#38bdf8" />
            <circle cx="41" cy="56" r="2.5" fill="#a855f7" />
            <circle cx="79" cy="21" r="2.5" fill="#38bdf8" />

            {/* Neural Layer 1 (Input Nodes Left) */}
            <circle cx="22" cy="22" r="7" fill="#090a10" stroke="#6366f1" strokeWidth="2" />
            <circle cx="22" cy="22" r="3" fill="#6366f1" />
            <circle cx="22" cy="68" r="7" fill="#090a10" stroke="#6366f1" strokeWidth="2" />
            <circle cx="22" cy="68" r="3" fill="#6366f1" />

            {/* Neural Layer 2 (Hidden Layer Nodes Middle) */}
            <circle cx="60" cy="14" r="7" fill="#090a10" stroke="#818cf8" strokeWidth="2" />
            <circle cx="60" cy="14" r="3" fill="#818cf8" />
            <circle cx="60" cy="76" r="7" fill="#090a10" stroke="#818cf8" strokeWidth="2" />
            <circle cx="60" cy="76" r="3" fill="#818cf8" />

            {/* Oversized Core Processing Tensor Hub (Center) */}
            <circle cx="60" cy="45" r="13" fill="#090a10" stroke="#818cf8" strokeWidth="1.5" />
            <circle cx="60" cy="45" r="9" fill="url(#core-tensor-grad)" stroke="#ffffff" strokeWidth="1.8" filter="url(#glow-indigo)" />
            <circle cx="60" cy="45" r="3" fill="#ffffff" />

            {/* Neural Layer 3 (Output Nodes Right) */}
            <circle cx="98" cy="28" r="7" fill="#090a10" stroke="#c084fc" strokeWidth="2" />
            <circle cx="98" cy="28" r="3" fill="#c084fc" />
            <circle cx="98" cy="62" r="7" fill="#090a10" stroke="#c084fc" strokeWidth="2" />
            <circle cx="98" cy="62" r="3" fill="#c084fc" />
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

      {/* ── TYPE 8: SERVICE - WEB & APP ARCHITECTURE (Detailed Code IDE Window + Live Deployment Badge) ── */}
      {type === 'service_web' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-44 h-32 drop-shadow-[0_0_20px_rgba(245,158,11,0.55)]" viewBox="0 0 130 90" fill="none">
            <defs>
              <linearGradient id="ide-bg-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#090a10" />
              </linearGradient>
              <filter id="glow-amber-serv" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Code Window Frame */}
            <rect x="12" y="10" width="106" height="70" rx="7" fill="url(#ide-bg-grad)" stroke="#f59e0b" strokeWidth="1.8" />
            <path d="M 12 26 L 118 26" stroke="#f59e0b" strokeWidth="1.2" opacity="0.3" />
            <circle cx="21" cy="18" r="2.5" fill="#ef4444" />
            <circle cx="28" cy="18" r="2.5" fill="#f59e0b" />
            <circle cx="35" cy="18" r="2.5" fill="#10b981" />
            <rect x="46" y="15" width="40" height="6" rx="3" fill="#ffffff20" />

            {/* Line Numbers Column */}
            <line x1="26" y1="26" x2="26" y2="80" stroke="#ffffff15" strokeWidth="1" />
            <circle cx="20" cy="36" r="1" fill="#ffffff40" />
            <circle cx="20" cy="48" r="1" fill="#ffffff40" />
            <circle cx="20" cy="60" r="1" fill="#ffffff40" />
            <circle cx="20" cy="72" r="1" fill="#ffffff40" />

            {/* Syntax Highlighted Code Lines */}
            <rect x="32" y="34" width="28" height="5" rx="2" fill="#f59e0b" opacity="0.9" />
            <rect x="64" y="34" width="38" height="5" rx="2" fill="#38bdf8" opacity="0.75" />
            <rect x="32" y="46" width="52" height="5" rx="2" fill="#a855f7" opacity="0.85" />
            <rect x="32" y="58" width="34" height="5" rx="2" fill="#34d399" opacity="0.9" />
            <rect x="70" y="58" width="24" height="5" rx="2" fill="#fb7185" opacity="0.75" />
            <rect x="32" y="70" width="42" height="5" rx="2" fill="#fbbf24" opacity="0.8" />

            {/* Floating Live Deployment Success Badge */}
            <g transform="translate(78, 44)">
              <rect x="0" y="0" width="36" height="28" rx="6" fill="#090a10" stroke="#10b981" strokeWidth="1.8" filter="url(#glow-amber-serv)" />
              <circle cx="18" cy="11" r="6" fill="#10b98125" stroke="#34d399" strokeWidth="1.2" />
              <path d="M 15 11 L 17 13 L 21 9" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="8" y="20" width="20" height="3" rx="1.5" fill="#34d399" />
            </g>
          </svg>
          <div className="mt-2 text-center">
            <span className="text-[12px] font-bold text-white tracking-wider block font-sans">
              {t('vision.card_badges.service_web', 'بناء التطبيقات البرمجية')}
            </span>
            <span className="text-[10px] text-amber-200 font-sans bg-amber-500/25 px-2.5 py-0.5 rounded-full border border-amber-400/40 inline-block mt-0.5">
              {t('vision.card_badges.service_web_sub', 'أداء فائق + تجربة سلسة')}
            </span>
          </div>
        </div>
      )}

      {/* ── TYPE 9: SERVICE - ENTERPRISE ERP (Central Command Hub + Interconnected Satellite Nodes) ── */}
      {type === 'service_erp' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-44 h-32 drop-shadow-[0_0_20px_rgba(16,185,129,0.55)]" viewBox="0 0 130 90" fill="none">
            <defs>
              <linearGradient id="hub-center-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <filter id="glow-emerald-serv" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Dotted Radial Network Conduits */}
            <g stroke="#10b981" strokeWidth="1.8" strokeDasharray="3 3">
              <line x1="65" y1="45" x2="65" y2="12" />
              <line x1="65" y1="45" x2="110" y2="45" />
              <line x1="65" y1="45" x2="65" y2="78" />
              <line x1="65" y1="45" x2="20" y2="45" />
            </g>

            {/* Central Command Hub Core Ring */}
            <circle cx="65" cy="45" r="22" fill="#090a10" stroke="#10b981" strokeWidth="2" filter="url(#glow-emerald-serv)" />
            <circle cx="65" cy="45" r="14" fill="url(#hub-center-grad)" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="65" cy="45" r="4" fill="#ffffff" />

            {/* Satellite Module 1 (Top: Finance/Chart) */}
            <g transform="translate(65, 12)">
              <circle cx="0" cy="0" r="9" fill="#090a10" stroke="#34d399" strokeWidth="1.8" />
              <path d="M -4 2 L -1 -2 L 2 0 L 5 -4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Satellite Module 2 (Right: Operations/Gear) */}
            <g transform="translate(110, 45)">
              <circle cx="0" cy="0" r="9" fill="#090a10" stroke="#34d399" strokeWidth="1.8" />
              <circle cx="0" cy="0" r="4" fill="none" stroke="#34d399" strokeWidth="1.5" />
            </g>

            {/* Satellite Module 3 (Bottom: Database/Server) */}
            <g transform="translate(65, 78)">
              <circle cx="0" cy="0" r="9" fill="#090a10" stroke="#34d399" strokeWidth="1.8" />
              <rect x="-4" y="-4" width="8" height="3" rx="1" fill="#34d399" />
              <rect x="-4" y="1" width="8" height="3" rx="1" fill="#34d399" />
            </g>

            {/* Satellite Module 4 (Left: Users/HR) */}
            <g transform="translate(20, 45)">
              <circle cx="0" cy="0" r="9" fill="#090a10" stroke="#34d399" strokeWidth="1.8" />
              <circle cx="0" cy="-2" r="2.5" fill="#34d399" />
              <path d="M -4 4 C -4 2, -2 2, 0 2 C 2 2, 4 2, 4 4" stroke="#34d399" strokeWidth="1.2" fill="none" />
            </g>
          </svg>
          <div className="mt-2 text-center">
            <span className="text-[12px] font-bold text-white tracking-wider block font-sans">
              {t('vision.card_badges.service_erp', 'أتمتة العمليات الإدارية')}
            </span>
            <span className="text-[10px] text-emerald-200 font-sans bg-emerald-500/25 px-2.5 py-0.5 rounded-full border border-emerald-400/40 inline-block mt-0.5">
              {t('vision.card_badges.service_erp_sub', 'لوحات تحكم متكاملة ERP')}
            </span>
          </div>
        </div>
      )}

      {/* ── TYPE 10: SERVICE - UI/UX & PROTOTYPING (Interactive UI Widgets + Slider + Toggle) ── */}
      {type === 'service_uiux' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-44 h-32 drop-shadow-[0_0_20px_rgba(236,72,153,0.55)]" viewBox="0 0 130 90" fill="none">
            <defs>
              <linearGradient id="uiux-card-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#090a10" />
              </linearGradient>
              <filter id="glow-pink-serv" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Left Card: Screen Wireframe */}
            <rect x="12" y="12" width="48" height="66" rx="7" fill="url(#uiux-card-grad)" stroke="#ec4899" strokeWidth="1.8" />
            <rect x="20" y="20" width="32" height="8" rx="3" fill="#ec489940" />
            <rect x="20" y="34" width="22" height="5" rx="2.5" fill="#ffffff60" />
            <rect x="20" y="45" width="32" height="24" rx="4" fill="#f43f5e25" stroke="#f43f5e" strokeWidth="1.2" />

            {/* Right Widget 1: Interactive Toggle Switch */}
            <g transform="translate(68, 14)">
              <rect x="0" y="0" width="50" height="28" rx="7" fill="url(#uiux-card-grad)" stroke="#f472b6" strokeWidth="1.5" />
              <rect x="6" y="6" width="38" height="16" rx="8" fill="#ec4899" />
              <circle cx="34" cy="14" r="6" fill="#ffffff" filter="url(#glow-pink-serv)" />
            </g>

            {/* Right Widget 2: Custom Range Slider */}
            <g transform="translate(68, 48)">
              <rect x="0" y="0" width="50" height="30" rx="7" fill="url(#uiux-card-grad)" stroke="#ec4899" strokeWidth="1.5" />
              <line x1="8" y1="15" x2="42" y2="15" stroke="#ffffff30" strokeWidth="4" strokeLinecap="round" />
              <line x1="8" y1="15" x2="28" y2="15" stroke="#ec4899" strokeWidth="4" strokeLinecap="round" />
              <circle cx="28" cy="15" r="6" fill="#ffffff" stroke="#ec4899" strokeWidth="2" filter="url(#glow-pink-serv)" />
            </g>
          </svg>
          <div className="mt-2 text-center">
            <span className="text-[12px] font-bold text-white tracking-wider block font-sans">
              {t('vision.card_badges.service_uiux', 'هندسة واجهات المستقبل')}
            </span>
            <span className="text-[10px] text-pink-200 font-sans bg-pink-500/25 px-2.5 py-0.5 rounded-full border border-pink-400/40 inline-block mt-0.5">
              {t('vision.card_badges.service_uiux_sub', 'أنظمة تصميم متطورة')}
            </span>
          </div>
        </div>
      )}

      {/* ── TYPE 11: SERVICE - AI & INTELLIGENT SYSTEMS (AI Processor Ring + Core Nucleus + Data Channels) ── */}
      {type === 'service_ai' && (
        <div className="w-full h-full flex flex-col items-center justify-center relative z-10 p-2 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-44 h-32 drop-shadow-[0_0_20px_rgba(139,92,246,0.55)]" viewBox="0 0 130 90" fill="none">
            <defs>
              <linearGradient id="ai-serv-core" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <filter id="glow-purple-serv" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer Orbital Grid Rings */}
            <circle cx="65" cy="45" r="32" stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.5" />
            <circle cx="65" cy="45" r="24" stroke="#38bdf8" strokeWidth="1.5" opacity="0.7" />

            {/* Glowing Core Sphere */}
            <circle cx="65" cy="45" r="16" fill="url(#ai-serv-core)" filter="url(#glow-purple-serv)" />
            <circle cx="65" cy="45" r="6" fill="#ffffff" />

            {/* Directional Data Channels (4 Cardinal Axis Pins) */}
            <line x1="22" y1="45" x2="38" y2="45" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="92" y1="45" x2="108" y2="45" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="65" y1="5" x2="65" y2="20" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
            <line x1="65" y1="70" x2="65" y2="85" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />

            {/* Endpoint Data Nodes */}
            <circle cx="18" cy="45" r="3.5" fill="#38bdf8" />
            <circle cx="112" cy="45" r="3.5" fill="#38bdf8" />
            <circle cx="65" cy="4" r="3.5" fill="#8b5cf6" />
            <circle cx="65" cy="86" r="3.5" fill="#8b5cf6" />
          </svg>
          <div className="mt-2 text-center">
            <span className="text-[12px] font-bold text-white tracking-wider block font-sans">
              {t('vision.card_badges.service_ai', 'حلول الأنظمة الذكية')}
            </span>
            <span className="text-[10px] text-purple-200 font-sans bg-purple-500/25 px-2.5 py-0.5 rounded-full border border-purple-400/40 inline-block mt-0.5">
              {t('vision.card_badges.service_ai_sub', 'معالجة واستدلال فوري')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
