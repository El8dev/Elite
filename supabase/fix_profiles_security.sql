-- =============================================================================
-- ELITE Tech Website — Unified Security & Database Configuration
-- Run this entire script in the Supabase SQL Editor (Dashboard → SQL → New query)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- STEP 1: Fix default role and status on the profiles table
-- New rows must NEVER default to 'System Administrator'
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles
  ALTER COLUMN role SET DEFAULT 'Member';

ALTER TABLE public.profiles
  ALTER COLUMN account_status SET DEFAULT 'pending';


-- -----------------------------------------------------------------------------
-- STEP 2: Fix the signup trigger so new auth users get role = 'Member'
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, account_status)
  VALUES (
    NEW.id,
    NEW.email,
    'Member',
    'pending'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- -----------------------------------------------------------------------------
-- STEP 3: Helper functions for RLS & Rules (SECURITY DEFINER avoids recursion)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_profile_role(uid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = uid;
$$;

CREATE OR REPLACE FUNCTION public.is_system_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = uid) = 'System Administrator',
    false
  );
$$;

CREATE OR REPLACE FUNCTION public.is_approved_developer(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT account_status FROM public.profiles WHERE id = uid) = 'approved',
    false
  );
$$;


-- -----------------------------------------------------------------------------
-- STEP 4: Prevent Profile Self-Approval & Role Escalation via Trigger
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.enforce_profile_update_rules()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the action is performed by an authenticated user and they are NOT a System Administrator:
  IF auth.uid() IS NOT NULL AND NOT public.is_system_admin(auth.uid()) THEN
    -- 1. Prevent changing account_status
    IF NEW.account_status IS DISTINCT FROM OLD.account_status THEN
      RAISE EXCEPTION 'Only System Administrators can change account status.';
    END IF;

    -- 2. Prevent changing role
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Only System Administrators can change roles.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_enforce_profile_update_rules ON public.profiles;

CREATE TRIGGER tr_enforce_profile_update_rules
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_update_rules();


-- -----------------------------------------------------------------------------
-- STEP 5: Enable RLS and replace policies on profiles
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop legacy / conflicting policies (safe if they do not exist)
DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "System admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "System admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view approved profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- SELECT: users read their own row
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- SELECT: System Administrators read ALL profiles
CREATE POLICY "System admins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.is_system_admin(auth.uid()));

-- SELECT: public homepage can show approved members
CREATE POLICY "Public can view approved profiles"
  ON public.profiles
  FOR SELECT
  TO anon, authenticated
  USING (account_status = 'approved');

-- INSERT: allow profile row creation only for self, never as System Administrator
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND role IS DISTINCT FROM 'System Administrator'
  );

-- UPDATE: users edit own profile (trigger blocks status/role escalation)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- UPDATE: System Administrators can update any profile (approve/reject accounts)
CREATE POLICY "System admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (public.is_system_admin(auth.uid()))
  WITH CHECK (public.is_system_admin(auth.uid()));


-- -----------------------------------------------------------------------------
-- STEP 6: Enable RLS and configure policies on projects & contributors
-- -----------------------------------------------------------------------------
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_contributors ENABLE ROW LEVEL SECURITY;

-- Drop legacy / conflicting policies (safe if they do not exist)
DROP POLICY IF EXISTS "Public can view non-personal projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "System admins can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Approved developers can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Owners can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Owners can delete own projects" ON public.projects;

DROP POLICY IF EXISTS "Public can view contributors" ON public.project_contributors;
DROP POLICY IF EXISTS "Project owners can insert contributors" ON public.project_contributors;
DROP POLICY IF EXISTS "Project owners can update contributors" ON public.project_contributors;
DROP POLICY IF EXISTS "Project owners can delete contributors" ON public.project_contributors;

-- SELECT Projects
CREATE POLICY "Public can view non-personal projects"
  ON public.projects
  FOR SELECT
  TO anon, authenticated
  USING (personal_profile_only = false);

CREATE POLICY "Users can view own projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "System admins can view all projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (public.is_system_admin(auth.uid()));

-- INSERT Projects
CREATE POLICY "Approved developers can insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = owner_id
    AND (
      public.is_approved_developer(auth.uid())
      OR public.is_system_admin(auth.uid())
    )
  );

-- UPDATE Projects
CREATE POLICY "Owners can update own projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id OR public.is_system_admin(auth.uid()))
  WITH CHECK (auth.uid() = owner_id OR public.is_system_admin(auth.uid()));

-- DELETE Projects
CREATE POLICY "Owners can delete own projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id OR public.is_system_admin(auth.uid()));

-- SELECT Contributors
CREATE POLICY "Public can view contributors"
  ON public.project_contributors
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- INSERT Contributors
CREATE POLICY "Project owners can insert contributors"
  ON public.project_contributors
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
        AND (owner_id = auth.uid() OR public.is_system_admin(auth.uid()))
    )
  );

-- UPDATE Contributors
CREATE POLICY "Project owners can update contributors"
  ON public.project_contributors
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
        AND (owner_id = auth.uid() OR public.is_system_admin(auth.uid()))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
        AND (owner_id = auth.uid() OR public.is_system_admin(auth.uid()))
    )
  );

-- DELETE Contributors
CREATE POLICY "Project owners can delete contributors"
  ON public.project_contributors
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_id
        AND (owner_id = auth.uid() OR public.is_system_admin(auth.uid()))
    )
  );


-- -----------------------------------------------------------------------------
-- STEP 7: Security Definer RPC for Admin Panel User Deletion
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.delete_user_completely(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the calling user is a System Administrator
  IF NOT public.is_system_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only System Administrators can delete users.';
  END IF;

  -- Delete from public tables in order
  -- 1. project_contributors
  DELETE FROM public.project_contributors 
  WHERE user_id = target_user_id 
     OR project_id IN (SELECT id FROM public.projects WHERE owner_id = target_user_id);

  -- 2. projects owned by user
  DELETE FROM public.projects WHERE owner_id = target_user_id;

  -- 3. profile
  DELETE FROM public.profiles WHERE id = target_user_id;

  -- 4. auth.users (requires security definer)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;


-- -----------------------------------------------------------------------------
-- STEP 8 (ONE-TIME CLEANUP): Demote users wrongly assigned System Administrator
-- IMPORTANT: Replace 'your-admin@example.com' with YOUR real admin email
-- before running. This keeps your admin account and demotes everyone else.
-- -----------------------------------------------------------------------------
-- UPDATE public.profiles
-- SET role = 'Member'
-- WHERE role = 'System Administrator'
--   AND email IS DISTINCT FROM 'your-admin@example.com';
