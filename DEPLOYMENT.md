# 🚀 Production Deployment Guide: Student Placement & Internship Management System

This document outlines the end-to-end instructions for deploying the **Student Placement and Internship Management System** as a secure, publicly accessible cloud website using **Vercel**, **Supabase PostgreSQL**, **Supabase Auth**, and **GitHub**.

---

## 🏗️ 1. Architecture Overview

- **Frontend Application**: React 18 + TypeScript + Vite + Tailwind CSS (SPA)
- **Frontend Hosting**: Vercel Global Edge Network with SSL and SPA route rewrites
- **Cloud Database**: Supabase PostgreSQL with Row Level Security (RLS)
- **User Authentication**: Supabase Auth (Email & Password, Role-Based Access Control)
- **Document Storage**: Supabase Storage (`resumes` bucket for student PDF/Doc files)
- **Source Code Repository**: GitHub (`main` branch automated CI/CD)

---

## 📋 2. Prerequisites & Accounts

1. **GitHub Account**: To host the repository and trigger automated Vercel CI/CD builds.
2. **Vercel Account**: [vercel.com](https://vercel.com) (Log in with GitHub).
3. **Supabase Account**: [supabase.com](https://supabase.com) (Free-tier PostgreSQL & Auth).

---

## 🗄️ 3. Supabase Cloud Database & Storage Setup

### Step 3.1: Create a Project
1. Log in to [supabase.com](https://supabase.com/dashboard) and click **"New Project"**.
2. Set your **Project Name** (e.g. `student-placement-system`).
3. Set a strong database password and choose the region closest to your users (e.g. `South Asia (Mumbai)`).

### Step 3.2: Run Database Migration
1. In your Supabase project dashboard, navigate to the **SQL Editor** from the left navigation bar.
2. Click **"New Query"**.
3. Open [`supabase/schema.sql`](supabase/schema.sql) from this repository, copy its entire contents, and paste them into the SQL editor.
4. Click **Run** (or `Ctrl + Enter`).
5. This automatically generates:
   - `profiles`, `jobs`, `internships`, `applications`, `placement_drives`, `interviews`, `notifications`.
   - Comprehensive **Row-Level Security (RLS)** policies for Students, Recruiters, and Administrators.
   - The `resumes` storage bucket with upload and download policies.

### Step 3.3: Copy API Credentials
1. Go to **Project Settings** -> **API**.
2. Note down:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **Project API Keys** -> `anon` / `public` key

### Step 3.4: Configure Authentication Redirect URLs
1. Navigate to **Authentication** -> **URL Configuration**.
2. In **Site URL**, enter your production domain (or your Vercel URL once generated).
3. In **Redirect URLs**, add:
   - `https://<your-project-name>.vercel.app/**`
   - `http://localhost:3000/**`

---

## ☁️ 4. Deploying Frontend to Vercel

### Step 4.1: Push Project to GitHub
Open your terminal in the project root:
```bash
git add .
git commit -m "Deploy modern React, TypeScript, Tailwind, and Supabase Placement System"
git push origin main
```

### Step 4.2: Import Project in Vercel
1. Log in to [vercel.com/dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Select your repository: `Student-Placement-Internship-Management-System`.
4. In the configuration window:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 4.3: Configure Production Environment Variables
Under the **Environment Variables** section on Vercel, add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Your Supabase Publishable / Anon Key |

> [!NOTE]
> Even if environment variables are not immediately added, the application features an **In-Browser Fallback Engine** with complete demo profiles, jobs, applications, and interview data so visitors and evaluators never encounter a broken or blank screen.

### Step 4.4: Deploy
1. Click **"Deploy"**.
2. Vercel will run `npm install`, compile TypeScript, build optimized production assets via Vite, and issue an SSL certificate in ~30 seconds.
3. Your live URL will be displayed: `https://<your-project-name>.vercel.app`.

---

## 🌐 5. Configuring a Custom Domain (Optional)

If you own a custom domain (e.g. `placements.yourcollege.edu` or `mysystem.com`):

1. Go to your project on **Vercel** -> **Settings** -> **Domains**.
2. Enter your domain name and click **Add**.
3. Vercel will provide the exact DNS records:
   - For an **Apex Domain** (`example.com`): An **A Record** pointing to `76.76.21.21`.
   - For a **Subdomain** (`placements.example.com`): A **CNAME Record** pointing to `cname.vercel-dns.com`.
4. Add these records at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.).
5. Vercel will automatically verify the records and provision an SSL certificate within a few minutes.

---

## 🔑 6. Evaluation Credentials & Test Accounts

| Role | Login Identifier | Password | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Placement Officer (Sri Tanavi)** | `sri` or `sri@placement.com` | `admin123` | Placement rate analytics, post openings, review applicants, schedule multi-round interviews, manage student registry |
| **Student (Demo Account)** | `student@placement.com` | `student123` | Academic profile builder, upload PDF resume, filter eligible openings, 1-click apply, live status tracking |
| **Student 2 (Ananya Verma)** | `ananya.verma@placement.com` | `student123` | View shortlisted application records, view scheduled interview calls |
| **Recruiter (Google India)** | `recruiter@google.com` | `recruiter123` | Post campus roles, screen applicants, view resumes, update hiring status |

> [!TIP]
> The login page and navigation bar include **1-Click Demo Buttons** so evaluators can instantly switch between Admin, Student, and Recruiter perspectives with a single click.

---

## 🛡️ 7. Security & Production Checklist

- [x] **No Secrets in Client Bundle**: Only publishable `anon` keys prefixed with `VITE_` are used. No service-role or database master passwords exist in client code.
- [x] **Row-Level Security (RLS)**: PostgreSQL policies prevent unauthorized students from modifying others' records or viewing restricted recruiter data.
- [x] **Clean URL Routing**: [`vercel.json`](vercel.json) redirects all route requests to `/index.html`, eliminating 404 errors on browser page reloads.
- [x] **Zero Localhost Dependencies**: The application operates autonomously without depending on local machines or local ports.
- [x] **Resume Protection**: File uploads are secured with format restrictions and Supabase storage bucket permissions.

---

## 🔔 8. Notification System Configuration & Migration

If you already have a running Supabase project from an earlier deployment, run the following SQL migration script in your Supabase **SQL Editor** to upgrade your database with notification support, deduplication keys, RLS security policies, and automatic status triggers:

```sql
-- 1. Update application status check constraint to include UNDER_REVIEW
ALTER TABLE public.applications 
  DROP CONSTRAINT IF EXISTS applications_status_check;

ALTER TABLE public.applications 
  ADD CONSTRAINT applications_status_check 
  CHECK (status IN ('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'));

-- 2. Upgrade notifications table
ALTER TABLE public.notifications 
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'GENERAL',
  ADD COLUMN IF NOT EXISTS related_application_id BIGINT REFERENCES public.applications(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS event_key TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id) WHERE is_read = FALSE;

-- 3. Row-Level Security Policies for Notifications
DROP POLICY IF EXISTS "Users can view and manage their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users, Admins, and Recruiters can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

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

-- 4. Automatic Application Status Notification Trigger
CREATE OR REPLACE FUNCTION public.handle_application_status_update()
RETURNS TRIGGER AS $$
DECLARE
    target_title TEXT;
    app_target_name TEXT;
    notif_msg TEXT;
    e_key TEXT;
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
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
```

---

## 🧪 9. Verification & Multi-Account Test Guide

To verify notifications across multiple accounts:
1. **Student Registration Welcome Notification**:
   - Go to `/login` and select **Register** as a Student.
   - Enter a test email and password.
   - Upon registration, notice the Bell icon in the navigation bar showing **1 unread badge**.
   - Click the bell: verify the title *"Welcome to Student Placement Portal!"* and welcome message.
2. **Job Application Confirmation**:
   - As a student, click **Browse Openings** and apply for any job.
   - A success notification is instantly created: *"Your application for [Job Title] has been submitted successfully."*
   - Refresh the browser: notice the notification remains stored.
3. **Internship Application Confirmation**:
   - Apply for an internship; verify the internship application confirmation notification appears.
4. **Admin Status Change Trigger**:
   - Log in as **Admin (Sri Tanavi)** using 1-Click Demo or credentials.
   - Go to **Candidate Review & Pipeline** and change the student's application status to **Under Review** or **Shortlisted**.
   - Switch back to the student account: the bell badge updates immediately with *"Application Under Review"* or *"Congratulations! You have been shortlisted..."*.
5. **Privacy & Access Isolation**:
   - Switch between **Student Demo** and **Ananya Verma**: each student sees only their own notifications.
   - Unauthorized students cannot view or modify others' applications or change application statuses.

---

## 🔄 10. Ongoing Maintenance & Redeployment

Whenever you update code or add features:
1. Make your changes locally.
2. Commit and push:
   ```bash
   git add .
   git commit -m "Add complete notification system"
   git push origin main
   ```
3. Vercel automatically detects the push, runs the TypeScript check and build, and redeploys the live site with zero downtime.
