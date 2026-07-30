-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    developer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_name text NOT NULL,
    sender_email text NOT NULL,
    message text NOT NULL,
    created_at timestamptz DEFAULT now(),
    is_read boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon and authenticated) to insert messages
CREATE POLICY "Allow public insert to contact_messages" 
ON public.contact_messages FOR INSERT 
TO public
WITH CHECK (true);

-- Allow authenticated users to view only their own messages
CREATE POLICY "Allow developers to view their own messages" 
ON public.contact_messages FOR SELECT 
TO authenticated 
USING (auth.uid() = developer_id);

-- (Optional) Allow developers to update is_read status for their messages
CREATE POLICY "Allow developers to update their own messages" 
ON public.contact_messages FOR UPDATE 
TO authenticated 
USING (auth.uid() = developer_id)
WITH CHECK (auth.uid() = developer_id);
