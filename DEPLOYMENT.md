# 🌐 Student Placement & Internship Management System - Deployment Guide

This guide explains how to make your website accessible to the public so that anyone in the world can use it.

---

## ⚡ Option 1: Instant Live Public URL (Ready Right Now)

Your project includes a 1-click launcher that creates an instant, secure public HTTPS link using your running computer.

### How to Start:
1. Double-click the file:
   ```
   start-public-access.bat
   ```
   *(Or run `powershell -ExecutionPolicy Bypass -File .\start-public-access.ps1` in PowerShell)*

2. It will automatically:
   - Verify the Java Spring Boot package.
   - Start the backend with the sample database preloaded.
   - Generate a secure public HTTPS URL (e.g. `https://xxxxxx.lhr.life`).
   - Automatically open the link in your web browser.

3. **Share the generated URL** with anyone (teachers, evaluators, recruiters, or classmates) on their smartphone, tablet, or laptop.

> [!NOTE]
> Keep the command window open while sharing. Closing the window or pressing `Ctrl + C` stops the public link.

---

## ☁️ Option 2: 24/7 Permanent Cloud Deployment (Render / Railway)

If you want your website to stay online 24 hours a day, 7 days a week (even when your PC is turned off), follow these simple steps to deploy on **Render** (free):

### Step 1: Push your Code to GitHub
```powershell
git init
git add .
git commit -m "Initial commit for Student Placement System"
git branch -M main
# Create a repository on https://github.com/new and link it:
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Step 2: Deploy on Render
1. Visit [Render.com](https://render.com) and sign up / log in with GitHub.
2. Click **New +** -> **Web Service**.
3. Select **Build and deploy from a Git repository** and connect your GitHub repository.
4. Render will automatically detect the included [`Dockerfile`](file:///c:/Users/thall/OneDrive/Desktop/Student%20Placement%20&%20Internship%20Management%20System/Dockerfile) and [`render.yaml`](file:///c:/Users/thall/OneDrive/Desktop/Student%20Placement%20&%20Internship%20Management%20System/render.yaml).
5. Click **Create Web Service**.
6. Render will build the container and provide your permanent URL:
   ```
   https://student-placement-system-xxxx.onrender.com
   ```

---

## 🔑 Demo Login Credentials for Public Users

| Role | Email | Password | What they can do |
| :--- | :--- | :--- | :--- |
| **Admin / Placement Officer** | `admin@placement.com` | `admin123` | View metrics, schedule drives & interviews, manage applications, view student database |
| **Student (Demo Candidate)** | `student@placement.com` | `student123` | Browse jobs/internships, apply with 1-click, track application statuses, view interview invites |
| **Student 2 (Ananya Verma)** | `ananya.verma@placement.com` | `student123` | Explore profile, notifications, shortlisted applications |
| **Recruiter** | Register directly via `/register.html` | Your password | Post vacancies, review student applicants |
