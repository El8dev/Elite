import { supabase } from '@/lib/supabase';

export interface ProjectLayoutConfig {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  is_masterpiece: boolean;
  personal_profile_only: boolean;
  created_at: string;
  live_url?: string;
  github_url?: string;
  image_urls?: string[];
  owner_id: string;
  layout_config?: ProjectLayoutConfig;
  profiles?: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

export const fetchPublicProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:owner_id (id, full_name, username, avatar_url)
    `)
    .eq('personal_profile_only', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public projects:', error);
    return [];
  }
  return data as Project[];
};

export const fetchProjectsByOwner = async (ownerId: string): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:owner_id (id, full_name, username, avatar_url)
    `)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching owner projects:', error);
    return [];
  }
  return data as Project[];
};

export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:owner_id (id, full_name, username, avatar_url)
    `)
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Error fetching project by id:', error);
    return null;
  }
  return data as Project;
};

export const updateProjectLayouts = async (layouts: { id: string, layout_config: ProjectLayoutConfig }[]): Promise<void> => {
  for (const layout of layouts) {
    const { error } = await supabase
      .from('projects')
      .update({ layout_config: layout.layout_config })
      .eq('id', layout.id);
      
    if (error) {
      console.error(`Error updating layout for project ${layout.id}:`, error);
    }
  }
};
