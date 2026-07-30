-- Fix missing columns in profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT;

-- Fix column name in project_contributors table to match frontend
ALTER TABLE public.project_contributors
RENAME COLUMN profile_id TO user_id;

-- Create policy for users to update their own profiles
DROP POLICY IF EXISTS "Users can update their own profiles." ON public.profiles;
CREATE POLICY "Users can update their own profiles."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
