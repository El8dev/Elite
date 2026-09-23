import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { getSupabase, hasPersistedSession, type SupabaseClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { DeveloperProfile as Profile } from '@/types';
import { toast } from 'sonner';

async function getProfile(supabase: SupabaseClient, userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to load profile:', error);
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
  // Anonymous visitors (no persisted session) are resolved synchronously and
  // never download supabase-js. Returning users restore their session first.
  const [loading, setLoading] = useState<boolean>(() => hasPersistedSession());
  const subscribed = useRef(false);

  /** Loads the client once and attaches the auth listener a single time. */
  const ensureClient = async (): Promise<SupabaseClient> => {
    const supabase = await getSupabase();
    if (!subscribed.current) {
      subscribed.current = true;
      // Do NOT await inside this callback (supabase-js deadlocks); use .then().
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          getProfile(supabase, session.user.id).then(setProfile);
        } else {
          setProfile(null);
        }
      });
    }
    return supabase;
  };

  const refreshProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const supabase = await ensureClient();
    setProfile(await getProfile(supabase, user.id));
  };

  useEffect(() => {
    if (!hasPersistedSession()) return;

    let cancelled = false;
    const timeout = new Promise<{ data: { session: null } }>((resolve) => {
      setTimeout(() => {
        console.warn('Supabase auth timeout (Offline Mode)');
        resolve({ data: { session: null } });
      }, 3000);
    });

    ensureClient()
      .then((supabase) => Promise.race([supabase.auth.getSession(), timeout]).then((res) => ({ supabase, session: res.data.session })))
      .then(({ supabase, session }) => {
        if (cancelled) return;
        setUser(session?.user ?? null);
        if (session?.user) {
          getProfile(supabase, session.user.id).then((p) => { if (!cancelled) setProfile(p); });
        }
      })
      .catch((error: Error) => {
        toast.error(`Failed to restore session: ${error.message}`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const signInWithUsername = async (username: string, password: string) => {
    try {
      const supabase = await ensureClient();
      const email = `${username}@miaoda.com`;
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUpWithUsername = async (username: string, password: string) => {
    try {
      const supabase = await ensureClient();
      const email = `${username}@miaoda.com`;
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: email,
            username: username,
            role: 'Member',
            account_status: 'pending'
          }, { onConflict: 'id' });

        if (profileError) {
          console.error('Failed to create profile:', profileError);
        }
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    const supabase = await ensureClient();
    await supabase.auth.signOut();
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
