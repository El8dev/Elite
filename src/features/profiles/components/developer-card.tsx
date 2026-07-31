import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { DeveloperProfile } from '@/types';

// ──────────────────────────────────────────────────────────────────────────────
// Tech-stack color mapping (by keyword match)
// ──────────────────────────────────────────────────────────────────────────────
function getTechColor(skill: string): { bg: string; text: string; border: string } {
  const s = skill.toLowerCase();
  if (['react', 'next', 'vue', 'svelte', 'angular'].some((k) => s.includes(k)))
    return { bg: 'rgba(34,211,238,0.08)', text: '#22D3EE', border: 'rgba(34,211,238,0.2)' };
  if (['python', 'django', 'fastapi', 'flask'].some((k) => s.includes(k)))
    return { bg: 'rgba(52,211,153,0.08)', text: '#34D399', border: 'rgba(52,211,153,0.2)' };
  if (['node', 'express', 'bun', 'deno'].some((k) => s.includes(k)))
    return { bg: 'rgba(52,211,153,0.08)', text: '#34D399', border: 'rgba(52,211,153,0.2)' };
  if (['ts', 'typescript', 'javascript', 'js'].some((k) => s.includes(k)))
    return { bg: 'rgba(245,158,11,0.08)', text: '#F59E0B', border: 'rgba(245,158,11,0.2)' };
  if (['figma', 'ui', 'ux', 'design'].some((k) => s.includes(k)))
    return { bg: 'rgba(236,72,153,0.08)', text: '#EC4899', border: 'rgba(236,72,153,0.2)' };
  // Default — violet
  return { bg: 'rgba(139,92,246,0.08)', text: '#A78BFA', border: 'rgba(139,92,246,0.2)' };
}

// ──────────────────────────────────────────────────────────────────────────────
// DeveloperCard
// ──────────────────────────────────────────────────────────────────────────────
export interface DeveloperCardProps {
  profile: DeveloperProfile;
  onClick?: (id: string) => void;
}

export const DeveloperCard: React.FC<DeveloperCardProps> = ({
  profile,
  onClick,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.button
      onClick={() => onClick?.(profile.id)}
      onMouseMove={handleMouseMove}
      className="flex w-full flex-col items-center rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0e0e10]/60 backdrop-blur-xl p-2 md:p-6 text-left transition-all duration-300 hover:-translate-y-2 focus:outline-none relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{
        borderColor: 'rgba(139,92,246,0.35)',
        boxShadow: '0 20px 50px rgba(139,92,246,0.12), 0 0 30px rgba(139,92,246,0.08)',
      }}
      data-magnetic
    >
      {/* ── Radial spotlight ── */}
      <div
        className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139,92,246,0.07), transparent 55%)`,
        }}
      />

      {/* ── Top glow line ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-3/4 bg-gradient-to-r from-transparent via-purple-500/60 to-transparent transition-all duration-500 pointer-events-none" />

      {/* ── Avatar with rotating ring ── */}
      <div className="relative">
        {/* Spinning conic ring */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(139,92,246,0.7), rgba(34,211,238,0.5), rgba(52,211,153,0.5), rgba(139,92,246,0.7))',
            padding: '2px',
            borderRadius: '9999px',
            animation: 'spin-slow 4s linear infinite',
            margin: '-2px',
            zIndex: 0,
          }}
          aria-hidden="true"
        />
        {/* Static glow ring (always visible) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 blur-md opacity-25 group-hover:opacity-50 transition-opacity duration-300" />
        <img
          src={profile.avatarUrl}
          alt={profile.fullName}
          className="relative h-12 w-12 md:h-24 md:w-24 rounded-full object-cover ring-2 ring-purple-500/20 dark:ring-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105 z-10"
          loading="lazy"
        />
      </div>

      <h3 className="mt-4 text-sm md:text-lg font-bold text-foreground font-outfit">{profile.fullName}</h3>
      <p className="mt-0.5 text-[10px] md:text-sm font-semibold text-purple-600 dark:text-purple-400 font-jetbrains tracking-widest uppercase">
        {profile.title}
      </p>

      <p className="mt-2 md:mt-3 text-center text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-outfit line-clamp-2 min-h-[30px] md:min-h-[40px]">
        {profile.bio}
      </p>

      {/* ── Skill badges with tech-color coding ── */}
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {profile.skills.slice(0, 3).map((skill) => {
          const { bg, text, border } = getTechColor(skill);
          return (
            <span
              key={skill}
              className="inline-flex items-center rounded-md px-1 py-0.5 md:px-1.5 md:py-0.5 text-[10px] md:text-sm font-semibold font-jetbrains tracking-wide"
              style={{ background: bg, color: text, border: `1px solid ${border}` }}
            >
              {skill}
            </span>
          );
        })}
      </div>

      {/* ── Project thumbnails ── */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="mt-5 w-full pt-4 border-t border-border/50">
          <p className="text-xs md:text-sm font-bold text-muted-foreground/70 uppercase tracking-widest mb-2.5 font-jetbrains">
            Top Projects
          </p>
          <div className="grid grid-cols-3 gap-2">
            {profile.projects.slice(0, 3).map((proj) => {
              const imagesRaw = (proj as any).imageUrls || (proj as any).imageUrl || [];
              const imgUrl = Array.isArray(imagesRaw) ? imagesRaw[0] : imagesRaw;
              return (
                <div
                  key={(proj as any).id}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border/50 bg-secondary/30 group/thumb"
                  title={(proj as any).title}
                >
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={(proj as any).title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover/thumb:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <span className="text-xs text-muted-foreground/40 font-jetbrains">N/A</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className="mt-5 flex w-full items-center gap-3">
        {/* View Profile — outlined neon */}
        <button
          onClick={(e) => { e.stopPropagation(); onClick?.(profile.id); }}
          className="flex-1 py-2.5 text-center text-xs font-semibold text-foreground hover:text-primary bg-secondary/50 border border-border hover:border-primary/40 rounded-xl transition-all font-outfit touch-target"
          data-cursor-text="VIEW"
          aria-label={`View ${profile.fullName}'s profile`}
        >
          View Profile
        </button>
      </div>
    </motion.button>
  );
};
