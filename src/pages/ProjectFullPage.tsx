import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchProjectById } from '@/features/projects/services/projects.service';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ExternalLink, Github, Heart, Eye, Calendar, User, Code2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SiteHeader } from '@/components/common/SiteHeader';
import { PremiumFooter } from '@/components/common/PremiumFooter';

const ProjectFullPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      try {
        const data = await fetchProjectById(projectId);
        
        // Ensure image_url array exists and handle legacy data
        let imageUrls = [];
        if (Array.isArray(data.image_url)) {
          imageUrls = data.image_url;
        } else if (data.image_url) {
          imageUrls = [data.image_url];
        } else {
          imageUrls = ['https://via.placeholder.com/800x600'];
        }

        const mappedProject = {
          id: data.id,
          title: data.title,
          description: data.description,
          imageUrls: imageUrls,
          technologies: data.technologies || [],
          liveUrl: data.live_url,
          githubUrl: data.github_url,
          likes: data.likes || 0,
          views: data.views || 0,
          createdAt: data.created_at,
          owner: data.profiles ? {
            name: data.profiles.full_name || data.profiles.username,
            avatarUrl: data.profiles.avatar_url
          } : undefined
        };

        setProject(mappedProject);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const handleClose = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center text-white">
        <p className="text-red-400 mb-4 bg-red-500/10 px-6 py-4 rounded-xl border border-red-500/20 font-medium">Project not found</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-secondary/80 rounded-full hover:bg-secondary transition-colors">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-outfit selection:bg-primary/30 flex flex-col">
      <Helmet>
        <title>{`${project.title} - Elite Code`}</title>
        <meta name="description" content={project.description?.substring(0, 155)} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.description?.substring(0, 155)} />
        <meta property="og:image" content={project.imageUrls[0]} />
        <link rel="canonical" href={`https://el8.dev/project/${project.id}`} />
      </Helmet>

      <SiteHeader />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          
          {/* Back Button */}
          <button 
            onClick={handleClose}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          {/* Header Section */}
          <div className="mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
            >
              {project.title}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
            >
              {project.owner && (
                <div className="flex items-center space-x-2">
                  <img src={project.owner.avatarUrl || 'https://via.placeholder.com/40'} alt={project.owner.name} className="w-8 h-8 rounded-full object-cover border border-border" />
                  <span className="font-medium text-foreground">{project.owner.name}</span>
                </div>
              )}
              {project.createdAt && (
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1.5"><Heart size={16} className="text-pink-500" /><span>{project.likes}</span></span>
                <span className="flex items-center space-x-1.5"><Eye size={16} className="text-blue-500" /><span>{project.views}</span></span>
              </div>
            </motion.div>
          </div>

          {/* Main Gallery */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-muted border border-border/50 mb-4 shadow-xl">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  src={project.imageUrls[activeImage]}
                  alt={`${project.title} preview`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
            
            {project.imageUrls.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                {project.imageUrls.map((url: string, index: number) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-24 h-16 md:w-32 md:h-20 rounded-xl overflow-hidden flex-shrink-0 transition-all ${activeImage === index ? 'ring-2 ring-primary border-transparent' : 'border border-border opacity-70 hover:opacity-100'}`}
                  >
                    <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 prose prose-invert prose-lg max-w-none prose-headings:font-outfit prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center space-x-2 text-foreground">
                <Code2 size={24} className="text-primary" />
                <span>About the Project</span>
              </h2>
              <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {project.description}
                </ReactMarkdown>
              </div>
            </motion.div>

            {/* Right Column: Sidebar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-1 space-y-8"
            >
              {/* Links */}
              {(project.liveUrl || project.githubUrl) && (
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Links</h3>
                  <div className="space-y-3">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors group">
                        <div className="flex items-center space-x-3 text-foreground">
                          <ExternalLink size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="font-medium text-sm">Live Preview</span>
                        </div>
                        <ArrowLeft size={16} className="rotate-135 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-background border border-border hover:border-primary/50 transition-colors group">
                        <div className="flex items-center space-x-3 text-foreground">
                          <Github size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="font-medium text-sm">Source Code</span>
                        </div>
                        <ArrowLeft size={16} className="rotate-135 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech: string) => (
                      <span key={tech} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg border border-border/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </main>

      <PremiumFooter />
    </div>
  );
};

export default ProjectFullPage;
