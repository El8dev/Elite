import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectDetailsModal } from '@/features/projects/components/ProjectDetailsModal';
import { fetchProjectById } from '@/features/projects/services/projects.service';
import { Helmet } from 'react-helmet-async';

const ProjectModalRoute: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
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
    // Navigate back to the background page
    navigate(-1);
  };

  if (loading) {
    // Optional: Render a loading overlay
    return null;
  }

  if (!project) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{`${project.title} - Elite Code`}</title>
        <meta name="description" content={project.description.substring(0, 155)} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.description.substring(0, 155)} />
        <meta property="og:image" content={project.imageUrls[0]} />
        <link rel="canonical" href={`https://elite-code.com/project/${project.id}`} />
      </Helmet>
      <ProjectDetailsModal project={project} onClose={handleClose} />
    </>
  );
};

export default ProjectModalRoute;
