import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { DeveloperProfile as Profile } from '@/types';
import { toast } from 'sonner';

async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
  return data;
}
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMockUser = () => {
    const savedUsername = localStorage.getItem('mock_user');
    if (savedUsername) {
      const mockUser = { id: 'mock-user-123', email: `${savedUsername}@example.com` } as User;
      setUser(mockUser);
      setProfile({
        id: 'mock-user-123',
        username: savedUsername,
        full_name: savedUsername,
        avatar_url: '',
        role: 'System Administrator',
        account_status: 'active',
        created_at: new Date().toISOString()
      } as Profile);
    }
  };

  const refreshProfile = async () => {
    loadMockUser();
  };

  useEffect(() => {
    loadMockUser();
    setLoading(false);
  }, []);

  const signInWithUsername = async (username: string, password: string) => {
    try {
      localStorage.setItem('mock_user', username);
      loadMockUser();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUpWithUsername = async (username: string, password: string) => {
    try {
      localStorage.setItem('mock_user', username);
      loadMockUser();
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('mock_user');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithUsername, signUpWithUsername, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
