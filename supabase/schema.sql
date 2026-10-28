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
    status TEXT NOT NULL DEFAULT 'APPLIED' CHECK (status IN ('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED')),
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
    type TEXT NOT NULL DEFAULT 'GENERAL' CHECK (type IN ('WELCOME', 'APPLICATION_SUBMITTED', 'STATUS_CHANGE', 'INTERVIEW_SCHEDULED', 'GENERAL')),
    related_application_id BIGINT REFERENCES public.applications(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    event_key TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id) WHERE is_read = FALSE;

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
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users, Admins, and Recruiters can insert notifications"
    ON public.notifications FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid() OR public.is_admin() OR public.is_recruiter());

CREATE POLICY "Users can delete their own notifications"
    ON public.notifications FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- Trigger: Automatically generate notifications on application status changes
CREATE OR REPLACE FUNCTION public.handle_application_status_update()
RETURNS TRIGGER AS $$
DECLARE
    target_title TEXT;
    app_target_name TEXT;
    notif_msg TEXT;
    e_key TEXT;
BEGIN
    -- Fire only when status actually changes
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Find job or internship title
        IF NEW.job_id IS NOT NULL THEN
            SELECT title INTO app_target_name FROM public.jobs WHERE id = NEW.job_id;
        ELSEIF NEW.internship_id IS NOT NULL THEN
            SELECT title INTO app_target_name FROM public.internships WHERE id = NEW.internship_id;
        END IF;

        IF app_target_name IS NULL THEN
            app_target_name := 'your application';
        END IF;

        CASE NEW.status
            WHEN 'UNDER_REVIEW' THEN
                target_title := 'Application Under Review';
                notif_msg := 'Your application for ' || app_target_name || ' is now Under Review.';
            WHEN 'SHORTLISTED' THEN
                target_title := 'Application Shortlisted';
                notif_msg := 'Congratulations! You have been shortlisted for ' || app_target_name || '.';
            WHEN 'INTERVIEW_SCHEDULED' THEN
                target_title := 'Interview Scheduled';
                notif_msg := 'An interview has been scheduled for ' || app_target_name || '. Please check your application details.';
            WHEN 'SELECTED' THEN
                target_title := 'Selected for Position!';
                notif_msg := 'Congratulations! You have been selected for ' || app_target_name || '!';
            WHEN 'REJECTED' THEN
                target_title := 'Application Status Updated';
                notif_msg := 'Your application status for ' || app_target_name || ' has been updated to Rejected.';
            ELSE
                target_title := 'Application Status Updated';
                notif_msg := 'Your application status for ' || app_target_name || ' is now ' || REPLACE(NEW.status, '_', ' ') || '.';
        END CASE;

        e_key := 'status-update-' || NEW.id || '-' || NEW.status || '-' || EXTRACT(EPOCH FROM NOW())::BIGINT;

        INSERT INTO public.notifications (user_id, title, message, type, related_application_id, event_key)
        VALUES (NEW.student_id, target_title, notif_msg, 'STATUS_CHANGE', NEW.id, e_key)
        ON CONFLICT (event_key) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_app_status_update ON public.applications;
CREATE TRIGGER trg_app_status_update
    AFTER UPDATE OF status ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_application_status_update();

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
