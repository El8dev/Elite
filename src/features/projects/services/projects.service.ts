import { getSupabase } from '@/lib/supabase';

export const PROJECTS_PAGE_SIZE = 12;

/**
 * Fetches a page of public projects (newest first). Pass `offset` to load the
 * next page; a result shorter than `limit` means there is nothing more.
 */
export const fetchPublicProjects = async (offset = 0, limit = PROJECTS_PAGE_SIZE): Promise<any[]> => {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:owner_id (*),
      project_contributors (
        profiles (*)
      )
    `)
    .eq('personal_profile_only', false)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to fetch public projects: ${error.message}`);
  }

  return data || [];
};

/**
 * Fetches projects owned by a specific developer
 * @param ownerId The developer's profile ID
 */
export const fetchProjectsByOwner = async (ownerId: string): Promise<any[]> => {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_contributors (
        profiles (*)
      )
    `)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch projects for owner ${ownerId}: ${error.message}`);
  }

  return data || [];
};

/**
 * Fetches a single project by its ID
 * @param projectId The project ID
 */
export const fetchProjectById = async (projectId: string): Promise<any> => {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:owner_id (*),
      project_contributors (
        profiles (*)
      )
    `)
    .eq('id', projectId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch project ${projectId}: ${error.message}`);
  }

  return data;
};
