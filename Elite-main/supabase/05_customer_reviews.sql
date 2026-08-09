-- Create customer_reviews table
CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    avatar_url text,
    social_links jsonb DEFAULT '[]'::jsonb,
    review_text text NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert reviews
CREATE POLICY "Allow public insert to customer_reviews" 
ON public.customer_reviews FOR INSERT 
TO public
WITH CHECK (true);

-- Allow anyone to view approved reviews
CREATE POLICY "Allow public to view approved reviews" 
ON public.customer_reviews FOR SELECT 
TO public 
USING (status = 'approved');

-- Allow admins to view all reviews
CREATE POLICY "Allow admins to view all reviews" 
ON public.customer_reviews FOR SELECT 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SystemAdmin');

-- Allow admins to update reviews
CREATE POLICY "Allow admins to update reviews" 
ON public.customer_reviews FOR UPDATE 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SystemAdmin');

-- Allow admins to delete reviews
CREATE POLICY "Allow admins to delete reviews" 
ON public.customer_reviews FOR DELETE 
TO authenticated 
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin' OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'SystemAdmin');

-- Create bucket for review images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('review_images', 'review_images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public upload to review_images" 
ON storage.objects FOR INSERT 
TO public 
WITH CHECK ( bucket_id = 'review_images' );

CREATE POLICY "Allow public read review_images" 
ON storage.objects FOR SELECT 
TO public 
USING ( bucket_id = 'review_images' );
