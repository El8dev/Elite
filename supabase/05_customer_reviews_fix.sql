-- Fix for the missing 'is_approved' column in the customer_reviews table

-- 1. Create the table if it doesn't exist at all
CREATE TABLE IF NOT EXISTS public.customer_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add the is_approved column if the table already exists but the column is missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'customer_reviews' 
                   AND column_name = 'is_approved') THEN
        ALTER TABLE public.customer_reviews ADD COLUMN is_approved BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 3. Set up Row Level Security (RLS) policies for the table
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to approved reviews
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.customer_reviews;
CREATE POLICY "Public can view approved reviews"
    ON public.customer_reviews
    FOR SELECT
    TO public
    USING (is_approved = true);

-- Allow authenticated users (System Admins) full access
DROP POLICY IF EXISTS "Authenticated users have full access to reviews" ON public.customer_reviews;
CREATE POLICY "Authenticated users have full access to reviews"
    ON public.customer_reviews
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
