-- Add layout_config to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS layout_config jsonb DEFAULT '{"w": 1, "h": 1, "x": 0, "y": 0}'::jsonb;
