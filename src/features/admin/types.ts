export interface DashboardProject {
  id: string;
  title: string;
  description: string;
  personal_profile_only: boolean;
  image_url?: string[];
  live_link?: string;
  github_link?: string;
  created_at?: string;
}

export interface AdminProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  account_status: string | null;
  role: string | null;
  job_title: string | null;
}

export interface PendingUser {
  id: string;
  full_name: string | null;
  username: string | null;
  role: string | null;
  job_title: string | null;
  bio: string | null;
  avatar_url: string | null;
  skills: string[] | null;
  account_status: string | null;
  created_at: string | null;
}
