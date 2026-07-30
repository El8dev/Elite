// ============================================================================
// ELITE Platform — Supabase Client Configuration
// ============================================================================
//
// This module initialises and exports a singleton Supabase client instance
// used globally across the ELITE platform for:
//   • Database queries (profiles, projects, admin actions)
//   • Authentication (future OAuth / magic-link flows)
//   • Storage uploads (avatar images, project screenshots)
//
// Environment variables are read via Vite's `import.meta.env` syntax.
// A missing URL or key will log a clear warning rather than crash the
// development server, ensuring a smooth DX during early setup.
// ============================================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ----------------------------------------------------------------------------
// Environment Variables
// ----------------------------------------------------------------------------

/**
 * Supabase project URL — found in Project Settings → API.
 * Must be set as `VITE_SUPABASE_URL` in `.env` or `.env.local`.
 */
const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL ?? '';

/**
 * Supabase anonymous (public) key — safe to expose in the browser.
 * Must be set as `VITE_SUPABASE_ANON_KEY` in `.env` or `.env.local`.
 */
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

// ----------------------------------------------------------------------------
// Development Safety Check
// ----------------------------------------------------------------------------

const isMissingConfig = !supabaseUrl || !supabaseAnonKey;

if (isMissingConfig) {
  console.error(
    '\n%c🚨 ELITE — Supabase Configuration Missing!\n',
    'color: #EF4444; font-weight: bold; font-size: 14px;',
    'One or both Supabase environment variables are NOT set.\n\n',
    '  VITE_SUPABASE_URL      →',
    supabaseUrl || '❌ NOT SET',
    '\n',
    '  VITE_SUPABASE_ANON_KEY →',
    supabaseAnonKey ? '✅ SET' : '❌ NOT SET',
    '\n\n',
    'Fix: Ensure your .env file is in the PROJECT ROOT (same folder as vite.config.ts)\n',
    'and contains:\n\n',
    '  VITE_SUPABASE_URL=https://<your-project>.supabase.co\n',
    '  VITE_SUPABASE_ANON_KEY=<your-anon-key>\n\n',
    'Then RESTART the Vite dev server (Ctrl+C → npx vite).\n',
  );
}

// ----------------------------------------------------------------------------
// Client Singleton
// ----------------------------------------------------------------------------

/**
 * Global Supabase client instance.
 *
 * If environment variables are missing, the client is created with
 * placeholder values — all queries will fail gracefully and be caught
 * by the try/catch blocks in the UI components.
 *
 * @example
 * ```ts
 * import { supabase } from '@/lib/supabase';
 *
 * const { data, error } = await supabase
 *   .from('developers')
 *   .select('*')
 *   .eq('status', 'approved');
 * ```
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
);
