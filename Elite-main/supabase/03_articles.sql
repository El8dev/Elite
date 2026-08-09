-- =============================================================================
-- ELITE Tech Website — Articles / Blog Table & Security Setup
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT,
  excerpt TEXT,
  content TEXT,
  category TEXT DEFAULT 'الذكاء الاصطناعي',
  category_color TEXT DEFAULT 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  author_name TEXT,
  author_avatar TEXT,
  image_url TEXT,
  read_time TEXT DEFAULT '5 دقائق',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public Read Access
CREATE POLICY "Public articles are viewable by everyone" 
ON public.articles FOR SELECT 
USING (true);

-- Policy 2: Authenticated Users can create articles
CREATE POLICY "Authenticated users can create articles" 
ON public.articles FOR INSERT 
WITH CHECK (auth.uid() = author_id);

-- Policy 3: Authors can update their own articles
CREATE POLICY "Authors can update their own articles" 
ON public.articles FOR UPDATE 
USING (auth.uid() = author_id);

-- Policy 4: Authors can delete their own articles
CREATE POLICY "Authors can delete their own articles" 
ON public.articles FOR DELETE 
USING (auth.uid() = author_id);

-- Create index on author_id and created_at for fast querying
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
