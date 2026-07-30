import { supabase } from '@/lib/supabase';

/**
 * Fetches all approved profiles with their associated projects
 */
export const fetchApprovedProfiles = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, projects(*)')
    .eq('account_status', 'approved')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(`Failed to fetch approved profiles: ${error.message}`);
  }

  return data || [];
};

/**
 * Fetches a single profile by ID
 * @param id The developer's profile ID
 */
export const fetchProfileById = async (id: string): Promise<any> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch profile ${id}: ${error.message}`);
  }

  return data;
};

/**
 * Fetches a single profile by username (if exists) or fallback to ID
 * @param identifier The username or profile ID
 */
export const fetchProfileByUsernameOrId = async (identifier: string): Promise<any> => {
  // Check if identifier is UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
  
  let query = supabase.from('profiles').select('*');
  if (isUuid) {
    query = query.eq('id', identifier);
  } else {
    query = query.eq('username', identifier);
  }

  const { data, error } = await query.single();

  if (error) {
    throw new Error(`Failed to fetch profile for identifier ${identifier}: ${error.message}`);
  }

  return data;
};
