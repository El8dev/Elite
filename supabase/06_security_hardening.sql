-- 06_security_hardening.sql
-- Comprehensive Security Hardening for Supabase RLS and Storage Policies

-- 1. Secure customer_reviews Table
ALTER TABLE IF EXISTS public.customer_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Authenticated users have full access to reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "Authenticated users can submit reviews" ON public.customer_reviews;
DROP POLICY IF EXISTS "System Admins full access on reviews" ON public.customer_reviews;

-- Read policy: Public sees approved, Admins see all
CREATE POLICY "Public can view approved reviews"
    ON public.customer_reviews
    FOR SELECT
    TO public
    USING (is_approved = true OR (auth.uid() IS NOT NULL AND public.is_system_admin(auth.uid())));

-- Insert policy: Authenticated users can insert with is_approved = false
CREATE POLICY "Authenticated users can submit reviews"
    ON public.customer_reviews
    FOR INSERT
    TO authenticated
    WITH CHECK (is_approved = false);

-- Update/Delete Policy: System Admins only
CREATE POLICY "System Admins full access on reviews"
    ON public.customer_reviews
    FOR ALL
    TO authenticated
    USING (public.is_system_admin(auth.uid()))
    WITH CHECK (public.is_system_admin(auth.uid()));

-- 2. Storage Objects Policy Hardening (RLS is already enabled by Supabase)
DROP POLICY IF EXISTS "Auth Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update Access" ON storage.objects;

-- Allow users to update ONLY their own storage objects, OR system admins can update all
CREATE POLICY "Strict Auth Update Access" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( auth.uid() = owner OR public.is_system_admin(auth.uid()) )
WITH CHECK ( bucket_id IN ('avatars', 'project_images') );

-- Allow users to delete ONLY their own storage objects, OR system admins can delete all
CREATE POLICY "Strict Auth Delete Access" 
ON storage.objects FOR DELETE
TO authenticated 
USING ( auth.uid() = owner OR public.is_system_admin(auth.uid()) );
