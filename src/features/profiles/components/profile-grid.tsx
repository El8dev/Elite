import React from 'react';
import { motion } from 'motion/react';
import type { DeveloperProfile } from '@/types';
import { DeveloperCard } from './developer-card';
import { useTranslation } from 'react-i18next';

export interface ProfileGridProps {
  profiles: DeveloperProfile[];
  onDeveloperClick?: (id: string) => void;
  onContactClick?: (profile: DeveloperProfile) => void;
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({ profiles, onDeveloperClick, onContactClick }) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen w-full bg-transparent pt-20">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl font-outfit">
            {t('developers_page.our_engineers', 'Our Engineers')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-outfit">
            {t('developers_page.our_engineers_desc', 'Meet the talent behind our products')}
          </p>
        </motion.div>

        {profiles.length === 0 ? (
          <div className="text-center text-muted-foreground py-20 text-lg font-outfit">
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
