export interface Developer {
  id: string;
  username?: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
  skills: string[];
  is_admin?: boolean;
  account_status?: 'pending' | 'approved' | 'rejected';
  whatsappNumber?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
}

export interface Project {
  id: string;
  developerId: string;
  ownerId?: string;
  imageUrl: string;
  imageUrls?: string[];
  description: string;
  techStack: string[];
  title: string;
  createdAt?: string;
  updatedAt?: string;
  isMasterpiece?: boolean;
  contributors?: any[];
  liveUrl?: string;
  repoUrl?: string;
}

export const developers: Developer[] = [];

export const projects: Project[] = [];

export function getDeveloperById(id: string): Developer | undefined {
  return developers.find((d) => d.id === id);
}

export function getProjectsByDeveloperId(developerId: string): Project[] {
  return projects.filter((p) => p.developerId === developerId);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
