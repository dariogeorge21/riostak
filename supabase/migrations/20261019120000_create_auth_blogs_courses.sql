-- Migration: 20261019120000_create_auth_blogs_courses.sql
-- Description: Normalized schema for table-based bcrypt auth, blogs, and courses with seeds for user 'sdc' and existing courses.

-- Enable pgcrypto extension for bcrypt generation and verification in Postgres
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

-- Index on username for authentication lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users(username);

-- 2. ADMIN SESSIONS TABLE (Server-side session management)
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index on session token and expiration for fast validation and cleanup
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

-- Indexes for blogs: slug lookup, public status filter, ordering by index/date
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

-- 5. COURSES TABLE (Normalized Course Offerings matching Riostak curricula)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    index_code VARCHAR(10) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NOT NULL,
    tags VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    extended_body TEXT NOT NULL,
    duration VARCHAR(100) NOT NULL,
    format VARCHAR(100) NOT NULL,
    syllabus_highlights TEXT[] NOT NULL DEFAULT '{}',
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

-- Indexes for courses
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_status_sort_order ON public.courses(status, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_courses_index_code ON public.courses(index_code);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content
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

-- 7. SEED DATA

-- 7.1 Seed user 'sdc' with bcrypt password 'sdc.123'
INSERT INTO public.admin_users (username, password_hash, full_name, role)
VALUES (
    'sdc',
    crypt('sdc.123', gen_salt('bf', 10)),
    'SDC Admin',
    'admin'
)
ON CONFLICT (username) DO UPDATE
SET password_hash = crypt('sdc.123', gen_salt('bf', 10)),
    updated_at = now();

-- 7.2 Seed Existing Courses from app/courses/page.tsx
INSERT INTO public.courses (
    slug,
    index_code,
    course_code,
    title,
    subtitle,
    tags,
    body,
    extended_body,
    duration,
    format,
    syllabus_highlights,
    image_src,
    image_alt,
    caption,
    frame_class_name,
    accent_class_name,
    image_class_name,
    status,
    sort_order
)
VALUES
(
    'courses-and-learning-resources',
    '01',
    'SYL // RIO-101',
    'Courses and Learning Resources',
    'Autonomous digital modules paired with rigorous weekly faculty dialogues for enduring cognitive and somatic competency.',
    'Online • Immersive Academics • Cohorts',
    'Structured curricula combining autonomous digital modules with rigorous weekly faculty dialogues. From foundational neuroscience to advanced contemplative practice, participants cultivate verifiable internal competencies through sustained, evidence-based inquiry.',
    'Designed for universities, leadership fellowships, and dedicated learning cohorts, this curriculum bridges empirical cognitive science with structured contemplative praxis across a twelve-week semester.',
    '12-Week Cohort',
    'Digital Modules + Live Seminars',
    ARRAY[
        'Foundational Neuroscience & Metacognition',
        'Weekly Faculty Dialogues & Socratic Labs',
        'Somatic Regulation & Autonomic Resilience',
        'Audited Competency & Cohort Certification'
    ],
    '/images/offering-courses.jpg',
    'RIOSTAK immersive cohort in session',
    'Curriculum // Autumn 2026',
    'bg-primary-container',
    '-bottom-3 -right-3 h-2/3 w-2/3 bg-secondary-container',
    '',
    'published',
    1
),
(
    'research-and-insights',
    '02',
    'SYL // RIO-204',
    'Research & Insights',
    'Multidisciplinary empirical inquiry, longitudinal flourishing indices, and validated diagnostic instruments.',
    'Multidisciplinary Empirical Inquiry • Field Trials',
    'Our independent lab produces peer-reviewed working papers, longitudinal flourishing indices, and validated diagnostic tools. We collaborate globally with university departments to interrogate what conditions genuinely sustain human vitality across lifespan stages.',
    'Institutions and research departments can license our longitudinal measurement frameworks, commission collaborative field trials, or integrate our empirical methodology workshops into graduate seminars.',
    'Multi-Quarter / Custom',
    'Research Seminars & Field Kits',
    ARRAY[
        'Longitudinal Flourishing Index Licensing',
        'Validated Psychometric & Somatic Diagnostics',
        'Collaborative University Field Trial Protocols',
        'Peer-Reviewed Working Paper Seminars'
    ],
    '/images/offering-research.jpg',
    'RIOSTAK empirical white papers and monographs',
    'Open Access // Monographs',
    'bg-secondary-container',
    '-bottom-3 -left-3 h-2/3 w-2/3 bg-primary',
    'grayscale-[15%]',
    'published',
    2
),
(
    'educational-content-and-guidance',
    '03',
    'SYL // RIO-309',
    'Educational Content & Guidance',
    'Daily contemplative praxis, micro-learning field notes, and actionable clinical toolkits for organizations and communities.',
    'Daily Praxis • Micro-Learning • Open Toolkits',
    'Accessible audio contemplation, daily field notes, and interactive toolkits formulated for immediate practical application. We demystify ancient wisdom and modern clinical practices into actionable, unpretentious five-minute daily practices.',
    'Ideal for community organizations, educators, and civic institutions seeking turnkey audio libraries, printed field manuals, and structured daily micro-learning tracks without multi-month scheduling overhead.',
    'Self-Paced / Modular',
    'Audio Library & Field Manuals',
    ARRAY[
        'Guided Five-Minute Somatic & Audio Praxis',
        'Printable Educator & Community Field Notes',
        'Relational Safety & Conflict Repair Toolkits',
        'Turnkey Institutional Library Integration'
    ],
    '/images/offering-guidance.jpg',
    'Everyday contemplative praxis in action',
    'Digital Repository // Free Access',
    'bg-primary-container',
    '-right-3 -top-3 h-1/2 w-1/2 bg-secondary-container',
    '',
    'published',
    3
)
ON CONFLICT (slug) DO UPDATE
SET
    index_code = EXCLUDED.index_code,
    course_code = EXCLUDED.course_code,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    tags = EXCLUDED.tags,
    body = EXCLUDED.body,
    extended_body = EXCLUDED.extended_body,
    duration = EXCLUDED.duration,
    format = EXCLUDED.format,
    syllabus_highlights = EXCLUDED.syllabus_highlights,
    image_src = EXCLUDED.image_src,
    image_alt = EXCLUDED.image_alt,
    caption = EXCLUDED.caption,
    frame_class_name = EXCLUDED.frame_class_name,
    accent_class_name = EXCLUDED.accent_class_name,
    image_class_name = EXCLUDED.image_class_name,
    status = EXCLUDED.status,
    sort_order = EXCLUDED.sort_order,
    updated_at = now();

-- 7.3 Seed Editorial Blogs from app/blogs/page.tsx
INSERT INTO public.blogs (
    slug,
    index_code,
    label,
    title,
    excerpt,
    content,
    author_name,
    author_title,
    reading_time,
    status,
    published_at
)
VALUES
(
    'neurobiology-and-contemplation',
    '01.01',
    'Editorial Dispatches',
    'Neurobiology & Contemplation',
    'Monthly peer-reviewed inquiries bridging somatic neuroscience, cognitive architecture, and ethical praxis.',
    '## Abstract

The intersection of contemplative traditions and modern neuroscience offers profound insights into human cognitive adaptability. Through empirical fMRI and autonomic biomarkers, our research examines how focused attention practices alter neuroplasticity and emotional regulation across adult developmental stages.

### Longitudinal Findings

Our preliminary five-year longitudinal cohort indicates a measurable stabilization in heart rate variability (HRV) and sustained attentional control among subjects engaging in daily structured contemplation.

1. **Attentional Stability:** 32% reduction in cognitive distraction metrics during continuous performance tests.
2. **Somatic Resilience:** Rapid parasympathetic rebound following acute stress exposure.
3. **Relational Flourishing:** Enhanced self-reported relational safety and empathetic accuracy.',
    'Dr. Clara Lin',
    'Senior Fellow in Cognitive Neuroscience',
    '7 min read',
    'published',
    now() - interval '5 days'
),
(
    'global-laboratory-field-notes',
    '01.02',
    'Fellowship Essays',
    'Global Laboratory Field Notes',
    'Direct reflections and trial notes from visiting scholars across our Cambridge, Zurich, and Singapore desks.',
    '## Field Notes from the Desks

Scholarly inquiry cannot remain confined to secluded libraries. Over the past academic quarter, our visiting fellows in Cambridge, Zurich, and Singapore carried diagnostic flourishing instruments into applied institutional contexts.

### Institutional Integration Observations

- **Zurich Lab:** Testing somatic reset protocols within tertiary educational faculty teams.
- **Singapore Desk:** Assessing the scalability of micro-learning toolkits across multilingual civic organizations.
- **Cambridge Center:** Establishing standardized psychometric baselines for organizational flourishing.',
    'RIOSTAK Global Secretariat',
    'Visiting Fellowship Board',
    '5 min read',
    'published',
    now() - interval '2 days'
),
(
    'post-industrial-pedagogy',
    '01.03',
    'Monograph Series',
    'Post-Industrial Pedagogy',
    'Extended treatises on empirical educational reform, public flourishing indices, and longitudinal ethics.',
    '## Monograph Overview

As industrial models of schooling face widespread exhaustion, higher education and professional academies demand a new pedagogical orientation—one rooted in contemplative depth, epistemological humility, and somatic regulation.

### Core Architectural Axioms

1. **Pedagogy as Formation, Not Information:** Learning architectures must prioritize cognitive discernment over rote assimilation.
2. **Embodied Epistemology:** Intellectual rigor flourishes when physiological state regulation is integrated into pedagogical pacing.
3. **Ethical Teleology:** Education must orient the learner toward collective flourishing rather than atomized productivity.',
    'Prof. Alistair Vance',
    'Chair of Human Development Studies',
    '10 min read',
    'published',
    now()
)
ON CONFLICT (slug) DO UPDATE
SET
    index_code = EXCLUDED.index_code,
    label = EXCLUDED.label,
    title = EXCLUDED.title,
    excerpt = EXCLUDED.excerpt,
    content = EXCLUDED.content,
    author_name = EXCLUDED.author_name,
    author_title = EXCLUDED.author_title,
    reading_time = EXCLUDED.reading_time,
    status = EXCLUDED.status,
    published_at = EXCLUDED.published_at,
    updated_at = now();

-- 7.4 Seed Blog Tags
INSERT INTO public.blog_tags (blog_id, tag_name)
SELECT b.id, t.tag_name
FROM public.blogs b
CROSS JOIN (
    VALUES
        ('neurobiology-and-contemplation', 'Cognitive Science'),
        ('neurobiology-and-contemplation', 'Neuroplasticity'),
        ('global-laboratory-field-notes', 'Field Trials'),
        ('global-laboratory-field-notes', 'Global Fellowship'),
        ('post-industrial-pedagogy', 'Educational Philosophy'),
        ('post-industrial-pedagogy', 'Ethics')
) AS t(slug, tag_name)
WHERE b.slug = t.slug
ON CONFLICT DO NOTHING;
