-- ==============================================================================
-- Student Placement and Internship Management System
-- Supabase PostgreSQL Production Schema & Row Level Security (RLS)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('STUDENT', 'ADMIN', 'RECRUITER')),
    full_name TEXT NOT NULL,
    phone TEXT,
    college TEXT,
    degree TEXT,
    branch TEXT,
    cgpa NUMERIC(4, 2),
    graduation_year INTEGER,
    skills TEXT,
    resume_url TEXT,
    certifications TEXT,
    projects TEXT,
    company_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id BIGSERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    job_type TEXT NOT NULL DEFAULT 'FULL_TIME',
    salary_package NUMERIC(12, 2) NOT NULL,
    min_cgpa NUMERIC(4, 2) NOT NULL DEFAULT 6.0,
    description TEXT,
    requirements TEXT,
    deadline DATE,
    active BOOLEAN DEFAULT TRUE,
    posted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Internships Table
CREATE TABLE IF NOT EXISTS public.internships (
    id BIGSERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    duration_months INTEGER NOT NULL,
    stipend_monthly NUMERIC(10, 2) NOT NULL,
    min_cgpa NUMERIC(4, 2) NOT NULL DEFAULT 6.0,
    description TEXT,
    requirements TEXT,
    deadline DATE,
    active BOOLEAN DEFAULT TRUE,
    posted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id BIGINT REFERENCES public.jobs(id) ON DELETE CASCADE,
    internship_id BIGINT REFERENCES public.internships(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'APPLIED' CHECK (status IN ('APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED')),
    notes TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_application_target CHECK (
        (job_id IS NOT NULL AND internship_id IS NULL) OR 
        (job_id IS NULL AND internship_id IS NOT NULL)
    ),
    CONSTRAINT uq_student_job UNIQUE (student_id, job_id),
    CONSTRAINT uq_student_internship UNIQUE (student_id, internship_id)
);

-- 6. Placement Drives Table
CREATE TABLE IF NOT EXISTS public.placement_drives (
    id BIGSERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    title TEXT NOT NULL,
    drive_date DATE NOT NULL,
    location TEXT NOT NULL,
    eligible_branches TEXT NOT NULL,
    min_cgpa NUMERIC(4, 2) NOT NULL DEFAULT 6.0,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Interviews Table
CREATE TABLE IF NOT EXISTS public.interviews (
    id BIGSERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    application_id BIGINT REFERENCES public.applications(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    round_name TEXT NOT NULL,
    interview_date DATE NOT NULL,
    interview_time TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'ONLINE',
    meet_link TEXT,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Row-Level Security (RLS) Configuration
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'ADMIN'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if current user is a Recruiter
CREATE OR REPLACE FUNCTION public.is_recruiter()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'RECRUITER'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles can be viewed by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid() OR public.is_admin());

-- Jobs Policies
CREATE POLICY "Anyone can view active jobs"
    ON public.jobs FOR SELECT
    USING (active = true OR public.is_admin() OR posted_by = auth.uid());

CREATE POLICY "Admins and Recruiters can insert jobs"
    ON public.jobs FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin() OR public.is_recruiter());

CREATE POLICY "Admins and Job owners can update jobs"
    ON public.jobs FOR UPDATE
    TO authenticated
    USING (public.is_admin() OR posted_by = auth.uid());

-- Internships Policies
CREATE POLICY "Anyone can view active internships"
    ON public.internships FOR SELECT
    USING (active = true OR public.is_admin() OR posted_by = auth.uid());

CREATE POLICY "Admins and Recruiters can insert internships"
    ON public.internships FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin() OR public.is_recruiter());

CREATE POLICY "Admins and Internship owners can update internships"
    ON public.internships FOR UPDATE
    TO authenticated
    USING (public.is_admin() OR posted_by = auth.uid());

-- Applications Policies
CREATE POLICY "Students can view their own applications"
    ON public.applications FOR SELECT
    TO authenticated
    USING (student_id = auth.uid() OR public.is_admin() OR public.is_recruiter());

CREATE POLICY "Students can submit applications"
    ON public.applications FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins and Recruiters can update application statuses"
    ON public.applications FOR UPDATE
    TO authenticated
    USING (public.is_admin() OR public.is_recruiter());

-- Placement Drives Policies
CREATE POLICY "Authenticated users can view placement drives"
    ON public.placement_drives FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage placement drives"
    ON public.placement_drives FOR ALL
    TO authenticated
    USING (public.is_admin());

-- Interviews Policies
CREATE POLICY "Students view their interviews, Admins/Recruiters view all"
    ON public.interviews FOR SELECT
    TO authenticated
    USING (student_id = auth.uid() OR public.is_admin() OR public.is_recruiter());

CREATE POLICY "Admins and Recruiters can manage interviews"
    ON public.interviews FOR ALL
    TO authenticated
    USING (public.is_admin() OR public.is_recruiter());

-- Notifications Policies
CREATE POLICY "Users can view and manage their own notifications"
    ON public.notifications FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- ==============================================================================
-- Storage Setup for Resumes
-- ==============================================================================
-- Run in Supabase SQL editor:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated students can upload their resumes"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Anyone authenticated can download/view resumes"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'resumes');
