import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ProfileGrid } from '@/features/profiles/components/profile-grid';
import { fetchApprovedProfiles } from '@/features/profiles/services/profiles.service';
import type { DeveloperProfile as DeveloperProfileType } from '@/types';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { PremiumFooter } from '@/components/common/PremiumFooter';
import { SiteHeader } from '@/components/common/SiteHeader';
import { useTranslation } from 'react-i18next';

const DevelopersPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [profileGridData, setProfileGridData] = useState<DeveloperProfileType[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [profilesError, setProfilesError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfiles = async () => {
      setLoadingProfiles(true);
      setProfilesError(null);
      try {
        const data = await fetchApprovedProfiles();
        const formattedData: DeveloperProfileType[] = data.map((profile: any) => ({
          id: profile.id,
          username: profile.username || '',
          fullName: profile.full_name || '',
          title: profile.role || '',
          bio: profile.bio || '',
          avatarUrl: profile.avatar_url || 'https://via.placeholder.com/150',
          skills: profile.skills || [],
          location: '',
          availability: profile.availability || 'unavailable',
          hourlyRate: profile.hourly_rate ? `$${profile.hourly_rate}/hr` : undefined,
          socialLinks: {
            github: profile.github_url || '',
            linkedin: profile.linkedin_url || '',
            twitter: '',
            website: profile.website_url || ''
          },
          stats: {
            projectsCompleted: profile.projects?.length || 0,
            yearsExperience: profile.years_experience || 0,
            commitsLastMonth: 0,
            rating: 5.0
          },
          status: profile.account_status || 'approved',
          createdAt: profile.created_at || new Date().toISOString(),
          updatedAt: profile.updated_at || new Date().toISOString()
        }));
        setProfileGridData(formattedData);
      } catch (err: any) {
        setProfilesError(err.message || 'Failed to load profiles');
      } finally {
        setLoadingProfiles(false);
      }
    };

    loadProfiles();
  }, []);

  const handleDeveloperClick = (id: string, username?: string) => {
    navigate(`/developer/${username || id}`);
  };

  return (
    <div className="min-h-screen bg-transparent text-white pt-24 pb-20 px-4 md:px-8">
      <Helmet>
        <title>{t('developers_page.title', 'Elite Developers | Our Masterminds')}</title>
        <meta name="description" content={t('developers_page.subtitle', 'Discover the elite developers behind the masterpieces.')} />
      </Helmet>

      <SiteHeader />

      <div className="max-w-7xl mx-auto pt-10">


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-outfit mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400">
              {t('developers_page.title', 'Elite Developers')}
            </span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            {t('developers_page.subtitle', 'Meet the creative minds behind the masterpieces.')}
          </p>
        </motion.div>

        {loadingProfiles ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : profilesError ? (
          <div className="text-center text-red-400 py-10 bg-red-500/10 rounded-xl border border-red-500/20">
            <p>{profilesError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : profileGridData.length === 0 ? (
          <div className="text-center text-white/50 py-20">
            No developers found.
          </div>
        ) : (
          <ProfileGrid 
            profiles={profileGridData} 
            onDeveloperClick={(id) => {
               const p = profileGridData.find(d => d.id === id);
               handleDeveloperClick(id, p?.username);
            }} 
          />
        )}
      </div>
      <PremiumFooter />
    </div>
  );
};

export default DevelopersPage;
