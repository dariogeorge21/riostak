-- Migration: 20261019163500_create_contact_submissions.sql
-- Description: Create contact_submissions table for storing institutional inquiries from /contact and managing them in /manage.

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

-- Indexes for fast filtering, sorting, and reference lookup in Secretariat Console
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status_created_at
    ON public.contact_submissions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_topic_id
    ON public.contact_submissions(topic_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_reference_id
    ON public.contact_submissions(reference_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_reviewed_by
    ON public.contact_submissions(reviewed_by);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Table grants for Supabase Data API roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO anon, authenticated, service_role;

-- Public visitors can submit new contact inquiries
CREATE POLICY "Public can insert contact submissions"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Server actions (guarded by HMAC admin session on the server) can read, update, and delete submissions
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

-- Seed initial realistic institutional inquiries
INSERT INTO public.contact_submissions (
    reference_id,
    topic_id,
    topic_label,
    full_name,
    email,
    affiliation,
    role,
    message,
    status,
    admin_notes,
    created_at
)
VALUES
(
    'RIO-2026-4812',
    'fellowships',
    'Academic Fellowship',
    'Dr. Eleanor Vance',
    'e.vance@cambridge-cognition.edu',
    'Department of Cognitive Sciences, Cambridge',
    'Principal Investigator',
    'We are interested in nominating two postdoctoral fellows for the Autumn 2026 visiting cohort on neuro-phenomenology and longitudinal autonomic regulation.',
    'new',
    '',
    now() - interval '3 days'
),
(
    'RIO-2026-7390',
    'curricula',
    'Curricula & Licensing',
    'Prof. Marcus Thorne',
    'm.thorne@eth-zurich.ch',
    'ETH Zurich — Human Factors Lab',
    'Faculty Director',
    'Requesting open scholarly licensing documentation to adopt the 12-week Somatic Regulation & Metacognition module across our graduate seminar series.',
    'reviewed',
    'Forwarded syllabus package and licensing rubric via HUB 02.',
    now() - interval '6 days'
)
ON CONFLICT (reference_id) DO NOTHING;
