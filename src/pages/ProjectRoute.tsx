import React, { lazy } from 'react';
import { useParams } from 'react-router-dom';
import { getFeaturedWork } from '@/data/featuredWork';

const CaseStudyPage = lazy(() => import('./CaseStudyPage'));
const ProjectFullPage = lazy(() => import('./ProjectFullPage'));

/**
 * /project/:projectId serves two different things.
 *
 * A handful of slugs ('raqeem', 'hawza') are the studio's own case studies and
 * render from the bundle. Everything else is a community project id and is
 * fetched from Supabase as before.
 */
const ProjectRoute: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  return projectId && getFeaturedWork(projectId) ? <CaseStudyPage /> : <ProjectFullPage />;
};

export default ProjectRoute;
