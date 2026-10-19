-- Migration: 20261019145000_update_courses_youtube.sql
-- Description: Update courses table to support YouTube video embeds and links; remove course_code and duration.

-- Alter table columns
ALTER TABLE public.courses
    DROP COLUMN IF EXISTS course_code,
    DROP COLUMN IF EXISTS duration,
    ADD COLUMN IF NOT EXISTS youtube_url TEXT DEFAULT 'https://www.youtube.com/watch?v=inpok4MKVLM';

-- Update existing course seed entries with verified video URLs
UPDATE public.courses
SET youtube_url = 'https://www.youtube.com/watch?v=inpok4MKVLM'
WHERE slug = 'courses-and-learning-resources';

UPDATE public.courses
SET youtube_url = 'https://www.youtube.com/watch?v=O-6f5wQXSu8'
WHERE slug = 'research-and-insights';

UPDATE public.courses
SET youtube_url = 'https://www.youtube.com/watch?v=w6T02g5hnT4'
WHERE slug = 'educational-content-and-guidance';
