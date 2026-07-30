import React from 'react';
import { motion } from 'motion/react';
import type { DeveloperProfile } from '@/types';
import { DeveloperCard } from './developer-card';

export interface ProfileGridProps {
  profiles: DeveloperProfile[];
  onDeveloperClick?: (id: string) => void;
  onContactClick?: (profile: DeveloperProfile) => void;
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({ profiles, onDeveloperClick, onContactClick }) => {
  return (
    <div className="min-h-screen w-full bg-transparent pt-20">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl font-outfit">
            Our Engineers
          </h2>
          <p className="mt-2 text-sm text-white/50 font-outfit">
            Meet the talent behind our products
          </p>
        </motion.div>

        {profiles.length === 0 ? (
          <div className="text-center text-white/30 py-20 text-lg font-outfit">
            No developers have joined ELITE yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <DeveloperCard
                key={profile.id}
                profile={profile}
                onClick={onDeveloperClick}
                onContactClick={onContactClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
