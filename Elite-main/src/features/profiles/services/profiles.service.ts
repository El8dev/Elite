import { supabase } from '@/lib/supabase';

/**
 * Fetches all approved profiles with their associated projects
 */
export const fetchApprovedProfiles = async (): Promise<any[]> => {
  // Mock Data for Developers
  return [
    {
      id: 'dev-1',
      username: 'ahmed_dev',
      full_name: 'Ahmed Developer',
      job_title: 'Frontend Engineer',
      role: 'Member',
      bio: 'Passionate about crafting pixel-perfect UIs with React and TailwindCSS.',
      avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      skills: ['React', 'TypeScript', 'TailwindCSS'],
      availability: 'available',
      hourly_rate: 45,
      github_url: 'https://github.com',
      linkedin_url: 'https://linkedin.com',
      website_url: 'https://example.com',
      account_status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      projects: [{ id: 'proj-1' }]
    },
    {
      id: 'dev-2',
      username: 'sara_ux',
      full_name: 'Sara Designer',
      job_title: 'UI/UX Designer',
      role: 'Member',
      bio: 'Creating intuitive and beautiful user experiences for modern web applications.',
      avatar_url: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
      skills: ['Figma', 'UI/UX', 'CSS'],
      availability: 'busy',
      hourly_rate: 55,
      github_url: 'https://github.com',
      linkedin_url: 'https://linkedin.com',
      website_url: 'https://example.com',
      account_status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      projects: []
    }
  ];
};

/**
 * Fetches a single profile by ID
 * @param id The developer's profile ID
 */
export const fetchProfileById = async (id: string): Promise<any> => {
  const profiles = await fetchApprovedProfiles();
  const profile = profiles.find(p => p.id === id) || profiles[0];
  return profile;
};

/**
 * Fetches a single profile by username (if exists) or fallback to ID
 * @param identifier The username or profile ID
 */
export const fetchProfileByUsernameOrId = async (identifier: string): Promise<any> => {
  const profiles = await fetchApprovedProfiles();
  const profile = profiles.find(p => p.id === identifier || p.username === identifier) || profiles[0];
  return profile;
};
