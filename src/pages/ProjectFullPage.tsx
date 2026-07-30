import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ProjectDetailsModal } from '@/features/projects/components/ProjectDetailsModal';
import { fetchProjectById } from '@/features/projects/services/projects.service';
import { Helmet } from 'react-helmet-async';

const ProjectFullPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      try {
        const data = await fetchProjectById(projectId);
        
        // Map to Project type expected by ProjectDetailsModal
        const mappedProject = {
          id: data.id,
          title: data.title,
          description: data.description,
          imageUrls: data.image_urls || [data.image_url || 'https://via.placeholder.com/800x600'],
          technologies: data.technologies || [],
          liveUrl: data.live_url,
          githubUrl: data.github_url,
          likes: data.likes || 0,
          views: data.views || 0,
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
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white">
        <p className="text-red-400 mb-4 bg-red-500/10 p-4 rounded-xl">Project not found</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20">Go Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <Helmet>
        <title>{`${project.title} - Elite Code`}</title>
        <meta name="description" content={project.description.substring(0, 155)} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.description.substring(0, 155)} />
        <meta property="og:image" content={project.imageUrls[0]} />
        <link rel="canonical" href={`https://elite-code.com/project/${project.id}`} />
      </Helmet>
      {/* We reuse the modal component but it will render over the ambient background */}
      <ProjectDetailsModal project={project} onClose={handleClose} />
    </div>
  );
};

export default ProjectFullPage;
