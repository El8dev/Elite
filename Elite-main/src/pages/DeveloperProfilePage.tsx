import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProfileByUsernameOrId } from '@/features/profiles/services/profiles.service';
import { fetchProjectsByOwner, updateProjectLayouts } from '@/features/projects/services/projects.service';
import { PremiumFooter } from '@/components/common/PremiumFooter';
import { ArrowLeft, Edit3, Save, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

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

const ProjectGrid: React.FC<{ 
  projects: any[], 
  onProjectClick: (id: string) => void,
  isEditMode: boolean,
  onLayoutChange: (layout: Layout[]) => void 
}> = ({ projects, onProjectClick, isEditMode, onLayoutChange }) => {
  if (!projects || !projects.length) return <p className="text-center text-muted-foreground">No projects yet.</p>;

  const initialLayout = projects.map((proj, index) => {
    const config = proj.layout_config || { x: (index % 3) * 4, y: Math.floor(index % 3) * 4, w: 4, h: 5 };
    return {
      i: proj.id,
      x: config.x || (index % 3) * 4,
      y: config.y || Math.floor(index / 3) * 5,
      w: config.w || 4,
      h: config.h || 5
    };
  });

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: initialLayout, md: initialLayout, sm: initialLayout, xs: initialLayout, xxs: initialLayout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={60}
      isDraggable={isEditMode}
      isResizable={isEditMode}
      onLayoutChange={onLayoutChange}
      draggableHandle=".drag-handle"
      containerPadding={[0, 0]}
      margin={[24, 24]}
    >
      {projects.map(proj => (
        <div 
          key={proj.id} 
          className={`group rounded-2xl bg-card border overflow-hidden transition-all shadow-sm flex flex-col bg-white ${isEditMode ? 'border-purple-500 shadow-md ring-2 ring-purple-500/20' : 'border-border hover:border-purple-500/30 cursor-pointer'}`}
          onClick={(e) => {
             if (!isEditMode) onProjectClick(proj.id);
          }}
        >
          {isEditMode && (
             <div className="drag-handle bg-slate-100 hover:bg-slate-200 cursor-move p-2 text-center text-xs text-slate-500 font-bold border-b border-slate-200 transition-colors shrink-0">
               ::: DRAG TO MOVE :::
             </div>
          )}
          <div className="flex-1 flex flex-col min-h-0">
             <div className="relative flex-1 bg-slate-100 min-h-0">
               <img src={proj.imageUrls[0]} alt={proj.title} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
             </div>
             <div className="p-4 shrink-0 bg-white">
               <h3 className="text-lg font-bold text-foreground font-outfit line-clamp-1">{proj.title}</h3>
               <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{proj.description}</p>
             </div>
          </div>
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};


const DeveloperProfilePage: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const navigate = useNavigate();

  const [developer, setDeveloper] = useState<any>(null);
  const [devProjects, setDevProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Admin Space Edit States
  const [isSystemAdmin, setIsSystemAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<Layout[]>([]);
  const [savingLayout, setSavingLayout] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (data?.role === 'System Administrator') {
        setIsSystemAdmin(true);
      }
    };
    checkAdmin();
  }, []);

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
        };
        setDeveloper(mappedProfile);

        const projectsData = await fetchProjectsByOwner(profile.id);
        const mappedProjects = projectsData.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          imageUrls: p.image_urls || [p.image_url || 'https://via.placeholder.com/800x600'],
          layout_config: p.layout_config,
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
    navigate(`/project/${projectId}`);
  };

  const handleSaveLayout = async () => {
    setSavingLayout(true);
    try {
      const updates = currentLayout.map(item => ({
        id: item.i,
        layout_config: { x: item.x, y: item.y, w: item.w, h: item.h }
      }));
      await updateProjectLayouts(updates);
      toast.success('Space layout saved successfully!');
      setIsEditMode(false);
    } catch (err: any) {
      toast.error('Failed to save space layout');
    } finally {
      setSavingLayout(false);
    }
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
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-all shadow-sm backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium tracking-wide">Back</span>
          </button>

          {isSystemAdmin && (
            <div className="flex items-center gap-3">
              {isEditMode ? (
                <>
                  <button
                    onClick={() => setIsEditMode(false)}
                    disabled={savingLayout}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveLayout}
                    disabled={savingLayout}
                    className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg disabled:opacity-50"
                  >
                    {savingLayout ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Layout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium bg-white text-purple-600 border border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all shadow-sm"
                >
                  <Edit3 size={16} />
                  تعديل المساحة (Edit Space)
                </button>
              )}
            </div>
          )}
        </div>

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
            <ProjectGrid 
              projects={devProjects} 
              onProjectClick={handleProjectClick}
              isEditMode={isEditMode}
              onLayoutChange={(layout) => setCurrentLayout(layout)}
            />
          </div>
        </motion.div>
      </div>

      <PremiumFooter />
    </div>
  );
};

export default DeveloperProfilePage;
