# 🌐 Student Placement & Internship Management System - Cloud Deployment Guide

This guide provides simple, step-by-step instructions for deploying your **Student Placement & Internship Management System** as a public, secure HTTPS website accessible from any smartphone, laptop, or computer anywhere in the world.

---

## 🏆 Recommended Hosting Platform: Railway (24/7 Cloud Hosting)

**Railway** is the most seamless platform for Java Spring Boot + MySQL applications because it provides:
- **1-Click MySQL Database**: Dedicated, persistent MySQL 8 service with automatic daily backups.
- **Automatic GitHub CI/CD**: Every `git push` automatically rebuilds and deploys the latest version.
- **Zero-Config Database Linking**: Railway provides standard environment variables (`MYSQLHOST`, `MYSQLPORT`, etc.) which your application is now pre-configured to automatically detect.
- **Free Automated HTTPS Domain**: Provides instant SSL certificates (`https://xxxx.up.railway.app`).
- **Real-Time Deployment & Application Logs**: Easy one-click log inspection directly in your browser.

---

### 📋 Step-by-Step Railway Deployment (Takes ~5 Minutes)

#### Step 1: Push Your Code to GitHub
Open PowerShell and push your latest code to your repository:
```powershell
cd "c:\Users\thall\OneDrive\Desktop\Student Placement & Internship Management System"
git add .
git commit -m "Configure production Dockerfile, Railway deployment, CORS, and cloud MySQL support"
git push origin main
```

#### Step 2: Create a Project on Railway
1. Visit **[Railway.app](https://railway.app)** and click **Login** (choose **Login with GitHub**).
2. On your Railway dashboard, click **"New Project"**.
3. Select **"Deploy from GitHub repo"**.
4. Choose your repository: `Student-Placement-Internship-Management-System`.
5. Railway will automatically detect the [`railway.json`](railway.json) and [`Dockerfile`](Dockerfile).

#### Step 3: Add a Hosted MySQL Database
1. Inside your project canvas on Railway, click **"+ New"** (top right) or press `Ctrl + K`.
2. Select **"Database"** -> **"Add MySQL"**.
3. Railway will provision a persistent MySQL server in ~10 seconds.
4. Click on the MySQL service -> Go to the **Variables** tab to view your credentials (`MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`).

#### Step 4: Link Database Variables to the Web Service
1. Click on your **Web Service** (your GitHub repository box) on Railway.
2. Go to the **Variables** tab.
3. Click **"New Variable"** -> **"Add Reference"** and select:
   - `MYSQLHOST` -> `${{MySQL.MYSQLHOST}}`
   - `MYSQLPORT` -> `${{MySQL.MYSQLPORT}}`
   - `MYSQLDATABASE` -> `${{MySQL.MYSQLDATABASE}}`
   - `MYSQLUSER` -> `${{MySQL.MYSQLUSER}}`
   - `MYSQLPASSWORD` -> `${{MySQL.MYSQLPASSWORD}}`
   *(Or click "Raw Editor" and paste standard reference mappings).*

> [!TIP]
> **Want to test without MySQL first?**
> You can simply add a single variable:
> `SPRING_PROFILES_ACTIVE = h2`
> This runs the application with an in-memory database and all demo data preloaded instantly!

#### Step 5: Generate Your Public HTTPS Domain
1. On your Web Service box, click **"Settings"**.
2. Scroll to the **"Networking"** section.
3. Under **Public Networking**, click **"Generate Domain"**.
4. Railway will generate your live public URL, for example:
   ```
   https://student-placement-system-production.up.railway.app
   ```
5. Click the URL to open your live website in Google Chrome!

---

## ☁️ Alternative Option: Render.com

Render is another popular cloud platform with direct GitHub deployment:

1. Sign up / Log in to **[Render.com](https://render.com)** using your GitHub account.
2. Click **"New +"** -> **"Web Service"**.
3. Connect your repository: `Student-Placement-Internship-Management-System`.
4. Render will detect [`render.yaml`](render.yaml) and [`Dockerfile`](Dockerfile).
5. Set:
   - **Environment**: Docker
   - **Plan**: Free
6. Under **Environment Variables**, if using H2 fallback, set:
   - `SPRING_PROFILES_ACTIVE` = `h2`
   - `PORT` = `8080`
7. Click **"Create Web Service"**.
8. Once built, Render will assign a public HTTPS domain: `https://your-app.onrender.com`.

---

## ⚡ Option 3: Instant Local Public Access (Ready Now from Your PC)

If you need to show your project immediately to an evaluator, teacher, or friend without setting up cloud accounts:

1. Double-click the file:
   ```
   start-public-access.bat
   ```
2. It starts your local Spring Boot application and creates a secure public tunnel with a live shareable URL.

---

## 🔒 Security & Data Persistence

1. **Passwords & Secrets Protection**:
   - Passwords are encrypted with **BCrypt** hashing.
   - User entity has `@JsonIgnore` on the password field, ensuring credentials are never exposed through REST responses.
   - Database credentials are read dynamically from cloud environment variables (`MYSQLHOST`, `MYSQLPASSWORD`, etc.), preventing hardcoded secrets from leaking into Git.
2. **Database Persistence**:
   - Railway MySQL stores data in an attached persistent volume that survives restarts and re-deployments.
   - `spring.jpa.hibernate.ddl-auto=update` preserves existing database rows and automatically updates table schemas safely.
3. **Authentication Guard**:
   - The landing page (`/index.html`) is open to the public.
   - Student, Admin, and Recruiter dashboards enforce authentication verification via `API.requireRole(...)` and redirect unauthenticated visitors to `/login.html`.

---

## 🔄 How to Update the Website After Changing Code

Whenever you make improvements or changes to your project:
1. Open PowerShell:
   ```powershell
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
2. Railway and Render listen for commits to `main` and will **automatically rebuild and redeploy** the application with zero manual intervention.

---

## 🔍 How to View Deployment Logs

1. Go to your **Railway** dashboard.
2. Click on your project -> click on your web service card.
3. Open the **"Deployments"** tab -> click on the active deployment.
4. View real-time **Build Logs** (Maven package steps) and **Deploy Logs** (Spring Boot startup and SQL queries).

---

## 🔑 Demo Login Credentials for Public Evaluators

| Role | Login Name / Email | Password | Allowed Operations |
| :--- | :--- | :--- | :--- |
| **Admin / Placement Officer (Sri Tanavi)** | `sri` | Configured Admin Password (or `admin123` default) | Analytics dashboard, manage student database, post jobs/internships, schedule interviews, coordinate drives |
| **Student (Demo Account)** | `student@placement.com` | `student123` | Update academic profile, browse jobs & internships, 1-click apply, live application status tracking, notifications |
| **Student 2 (Ananya Verma)** | `ananya.verma@placement.com` | `student123` | View shortlisted application records & interview calls |
| **Recruiter** | Register directly via `/register.html` | Your chosen password | Post company openings, review applicants |
