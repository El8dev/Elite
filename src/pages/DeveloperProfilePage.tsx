import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProfileByUsernameOrId } from '@/features/profiles/services/profiles.service';
import { fetchProjectsByOwner } from '@/features/projects/services/projects.service';
import { PremiumFooter } from '@/components/common/PremiumFooter';
import { ArrowLeft, ExternalLink, Github, Heart, Eye } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';

// --- Local Components ---
const ProfileHeader: React.FC<{ developer: any }> = ({ developer }) => {
  return (
    <div className="flex flex-col items-center text-center mt-8">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 blur-md opacity-40 animate-pulse" />
        <img
          src={developer.avatarUrl}
          alt={developer.name}
          className="relative h-32 w-32 rounded-full border-2 border-purple-500/20 object-cover shadow-2xl z-10"
        />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-foreground font-outfit md:text-4xl">{developer.name}</h1>
      <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-purple-400 font-outfit">{developer.role}</p>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground font-outfit">{developer.bio}</p>
    </div>
  );
};

const SkillsSection: React.FC<{ skills: string[] }> = ({ skills }) => {
  if (!skills || !skills.length) return null;
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-outfit">Skills</h3>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {skills.map((skill) => (
          <span key={skill} className="inline-flex items-center rounded-md bg-secondary border border-border px-3 py-1.5 text-xs font-semibold text-primary font-outfit">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

const ProjectGrid: React.FC<{ projects: any[], onProjectClick: (id: string) => void }> = ({ projects, onProjectClick }) => {
  if (!projects || !projects.length) return <p className="text-center text-muted-foreground">No projects yet.</p>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(proj => (
        <div 
          key={proj.id} 
          onClick={() => onProjectClick(proj.id)}
          className="group cursor-pointer rounded-2xl bg-card border border-border overflow-hidden hover:border-purple-500/30 transition-all shadow-sm"
        >
          <div className="aspect-video relative overflow-hidden">
            <img src={proj.imageUrls[0]} alt={proj.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-foreground font-outfit line-clamp-1">{proj.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{proj.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};


const DeveloperProfilePage: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();

  const [developer, setDeveloper] = useState<any>(null);
  const [devProjects, setDevProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    const loadDeveloperData = async () => {
      if (!identifier) return;
      setLoading(true);
      setError(null);
      try {
        const profile = await fetchProfileByUsernameOrId(identifier);
        
        const mappedProfile = {
          id: profile.id,
          username: profile.username || '',
          name: profile.full_name || '',
          role: profile.role || '',
          bio: profile.bio || '',
          avatarUrl: profile.avatar_url || 'https://via.placeholder.com/150',
          skills: profile.skills || [],
          whatsappNumber: profile.whatsapp_number,
          instagramUrl: profile.instagram_url,
          linkedinUrl: profile.linkedin_url,
          websiteUrl: profile.website_url,
        };

        setDeveloper(mappedProfile);

        // Fetch projects
        const projectsData = await fetchProjectsByOwner(profile.id);
        const mappedProjects = projectsData.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          imageUrls: p.image_urls || [p.image_url || 'https://via.placeholder.com/800x600'],
          technologies: p.technologies || [],
          liveUrl: p.live_url,
          githubUrl: p.github_url,
          likes: p.likes || 0,
          views: p.views || 0,
        }));
        
        setDevProjects(mappedProjects);
      } catch (err: any) {
        setError(err.message || 'Failed to load developer profile');
      } finally {
        setLoading(false);
      }
    };

    loadDeveloperData();
  }, [identifier]);

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`, { state: { backgroundLocation: location } });
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-foreground flex justify-center items-center">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !developer) {
    return (
      <div className="min-h-screen bg-transparent text-foreground flex flex-col justify-center items-center p-8">
        <p className="text-red-400 mb-4 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error || 'Developer not found'}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-secondary rounded-full hover:bg-secondary/80 transition-all">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground pt-24 pb-20">
      <Helmet>
        <title>{`${developer.name} | ${developer.role} - Elite Code`}</title>
        <meta name="description" content={developer.bio.substring(0, 155)} />
        <meta property="og:title" content={`${developer.name} | ${developer.role}`} />
        <meta property="og:description" content={developer.bio.substring(0, 155)} />
        <meta property="og:image" content={developer.avatarUrl} />
        <link rel="canonical" href={`https://elite-code.com/developer/${developer.username || developer.id}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 px-4 py-2 mb-8 bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-all shadow-sm backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium tracking-wide">Back</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <ProfileHeader developer={developer} />
          

          <div className="mt-8">
            <SkillsSection skills={developer.skills} />
          </div>


          <div className="mt-10">
            <ProjectGrid projects={devProjects} onProjectClick={handleProjectClick} />
          </div>
        </motion.div>
      </div>

      <PremiumFooter />
    </div>
  );
};

export default DeveloperProfilePage;
