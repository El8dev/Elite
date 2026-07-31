-- Create the storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('project_images', 'project_images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up access controls for storage.
-- See https://supabase.com/docs/guides/storage/security/access-control
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public access to read any file
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id IN ('avatars', 'project_images') );

-- Allow authenticated users to upload files to these buckets
CREATE POLICY "Auth Upload Access" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id IN ('avatars', 'project_images') );

-- Allow authenticated users to update their own files
CREATE POLICY "Auth Update Access" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( auth.uid() = owner )
WITH CHECK ( bucket_id IN ('avatars', 'project_images') );

-- Allow authenticated users to delete their own files
CREATE POLICY "Auth Delete Access" 
ON storage.objects FOR DELETE
TO authenticated 
USING ( auth.uid() = owner );
