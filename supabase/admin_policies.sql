-- Enable System Admins to DELETE profiles
DROP POLICY IF EXISTS "System admins can delete all profiles" ON public.profiles;
CREATE POLICY "System admins can delete all profiles"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (public.is_system_admin(auth.uid()));

-- Enable System Admins to UPDATE any project
DROP POLICY IF EXISTS "System admins can update all projects" ON public.projects;
CREATE POLICY "System admins can update all projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (public.is_system_admin(auth.uid()))
  WITH CHECK (public.is_system_admin(auth.uid()));

-- Enable System Admins to DELETE any project
DROP POLICY IF EXISTS "System admins can delete all projects" ON public.projects;
CREATE POLICY "System admins can delete all projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (public.is_system_admin(auth.uid()));
