// ============================================================================
// EL8 Platform — Lazy Supabase accessor
// ============================================================================
//
// `@supabase/supabase-js` is ~200 KB. Public pages (home, projects) must not
// pay for it on first load, so the client lives in ./supabase-client.ts and is
// only pulled in through a dynamic import the first time something needs it.
//
//   const supabase = await getSupabase();
//   const { data } = await supabase.from('projects').select('*');
//
// Code that is already behind a lazy, authenticated route (Dashboard, Admin)
// may import `supabase` statically from '@/lib/supabase-client'.
// ============================================================================

import type { SupabaseClient } from '@supabase/supabase-js';

let clientPromise: Promise<SupabaseClient> | null = null;

export function getSupabase(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = import('./supabase-client').then((m) => m.supabase);
  }
  return clientPromise;
}

/**
 * True when supabase-js has persisted a session in this browser, meaning it
 * is worth loading the client on startup to restore the user. Anonymous
 * visitors return false and skip the download entirely.
 */
export function hasPersistedSession(): boolean {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) ?? '';
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) return true;
    }
  } catch {
    /* storage unavailable */
  }
  return false;
}

export type { SupabaseClient };
