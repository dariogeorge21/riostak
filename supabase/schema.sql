-- Source of Truth: Riostak Database Schema
-- Maintained in sync with supabase/migrations/ per CLAUDE.md Section 11

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. ADMIN USERS TABLE (Table-based auth with bcrypt hashing)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users(username);

-- 2. ADMIN SESSIONS TABLE (Server-side session management)
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON public.admin_sessions(expires_at);

-- 3. BLOGS TABLE (Editorial Monographs & Despatches)
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    index_code VARCHAR(20) NOT NULL,
    label VARCHAR(100) NOT NULL DEFAULT 'Editorial Dispatch',
    title VARCHAR(255) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(100) NOT NULL DEFAULT 'RIOSTAK Fellowship',
    author_title VARCHAR(100) DEFAULT 'Academic Secretariat',
    reading_time VARCHAR(30) DEFAULT '6 min read',
    cover_image TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'published',
    published_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status_published_at ON public.blogs(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_index_code ON public.blogs(index_code);

-- 4. BLOG TAGS TABLE (Normalized tags for blogs)
CREATE TABLE IF NOT EXISTS public.blog_tags (
    blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (blog_id, tag_name)
);

CREATE INDEX IF NOT EXISTS idx_blog_tags_tag ON public.blog_tags(tag_name);

-- 5. COURSES TABLE (Normalized Course Offerings with YouTube Video Embeds)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    index_code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NOT NULL,
    tags VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    extended_body TEXT NOT NULL,
    format VARCHAR(100) NOT NULL,
    syllabus_highlights TEXT[] NOT NULL DEFAULT '{}',
    youtube_url TEXT NOT NULL,
    image_src TEXT NOT NULL DEFAULT '/images/offering-courses.jpg',
    image_alt TEXT NOT NULL DEFAULT 'RIOSTAK course offering',
    caption VARCHAR(100) NOT NULL DEFAULT 'Curriculum // Autumn 2026',
    frame_class_name VARCHAR(100) DEFAULT 'bg-primary-container',
    accent_class_name VARCHAR(100) DEFAULT '-bottom-3 -right-3 h-2/3 w-2/3 bg-secondary-container',
    image_class_name VARCHAR(100) DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT 'published',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_status_sort_order ON public.courses(status, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_courses_index_code ON public.courses(index_code);

-- 6. CONTACT SUBMISSIONS TABLE (Institutional Inquiries from /contact)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id VARCHAR(50) NOT NULL UNIQUE,
    topic_id VARCHAR(50) NOT NULL DEFAULT 'general',
    topic_label VARCHAR(100) NOT NULL DEFAULT 'General Inquiry',
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    affiliation VARCHAR(200) NOT NULL DEFAULT '',
    role VARCHAR(150) NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'new',
    admin_notes TEXT NOT NULL DEFAULT '',
    reviewed_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status_created_at
    ON public.contact_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_topic_id
    ON public.contact_submissions(topic_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_reference_id
    ON public.contact_submissions(reference_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_reviewed_by
    ON public.contact_submissions(reviewed_by);

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO anon, authenticated, service_role;

CREATE POLICY "Public can view published blogs"
ON public.blogs
FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Public can view tags of published blogs"
ON public.blog_tags
FOR SELECT
TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.blogs b
        WHERE b.id = blog_tags.blog_id AND b.status = 'published'
    )
);

CREATE POLICY "Public can view published courses"
ON public.courses
FOR SELECT
TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Public can insert contact submissions"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Secretariat console can view contact submissions"
ON public.contact_submissions
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Secretariat console can update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Secretariat console can delete contact submissions"
ON public.contact_submissions
FOR DELETE
TO anon, authenticated
USING (true);
