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

## 🔄 8. Ongoing Maintenance & Redeployment

Whenever you update code or add features:
1. Make your changes locally.
2. Commit and push:
   ```bash
   git add .
   git commit -m "Add new placement feature"
   git push origin main
   ```
3. Vercel automatically detects the push, runs the TypeScript check and build, and redeploys the live site with zero downtime.
