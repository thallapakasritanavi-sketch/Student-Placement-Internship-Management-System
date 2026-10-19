# Student Placement & Internship Management System

A production-ready, full-stack campus recruitment and internship management web application built with **Java 17+**, **Spring Boot 3**, **Spring Data JPA**, **MySQL**, and **Bootstrap 5**.

---

## 🌟 Key Features

### 🎓 1. Student Portal (`/student/dashboard` or `student-dashboard.html`)
- **Dashboard Overview**: Personalized greeting, dynamic profile completion percentage meter, metric cards for total applications, shortlists, placed status, available jobs, and internships.
- **Student Profile Management**: Manage college, degree, branch/department, CGPA, graduation year, technical skills, certifications, academic projects, and resume portfolio links.
- **Browse Full-Time Jobs**: Search jobs by title/skills/company, filter by location & type (Full-Time, Remote, Hybrid), view criteria (Min CGPA, salary), and apply with a single click. Prevents duplicate submissions with instant badges.
- **Browse Internships**: Search internships, filter by duration and stipend, eligibility verification, and direct application.
- **Live Application Tracking**: Real-time status badge tracking (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW_SCHEDULED`, `SELECTED`, `REJECTED`).
- **Interview Schedules**: Track scheduled technical/HR rounds with date, time, mode (Online/Offline), and Google Meet / room links.
- **Placement Drives**: View on-campus and virtual recruitment drives, packages, and registration deadlines.
- **In-App Notification Center**: Instant real-time alerts for application status changes, shortlists, interview calls, and unread counter with mark-as-read capability.

### 🛡️ 2. Admin & Placement Cell Portal (`/admin/dashboard` or `admin-dashboard.html`)
- **Live Analytics Dashboard**: Real-time counts of registered students, participating companies, active jobs, internships, total applications, and selected candidates.
- **Application Workflow Management**: Review student applications and change status with dropdowns that automatically trigger student notifications.
- **Student Directory**: Complete searchable table of registered students with department, CGPA, and technical skills.
- **Jobs & Internships Management**: Add, update, and delete full-time jobs and internships through modal dialogues.
- **Interview Scheduling**: Assign interview dates, times, online links/room venues, and instructions to any candidate.
- **Placement Drive Coordination**: Schedule and manage on-campus recruitment events.

### 🏢 3. Recruiter Portal (`/recruiter/dashboard` or `recruiter-dashboard.html`)
- Register with company credentials, review candidate profiles, evaluate applicants, and update hiring statuses.

---

## 🛠️ Technology Stack

- **Backend**: Java 17+, Spring Boot 3.2+, Spring Web, Spring Data JPA, Spring Security (BCrypt Password Hashing), Hibernate ORM
- **Database**: MySQL 8.0 (with automatic table generation via `spring.jpa.hibernate.ddl-auto=update` and H2 in-memory test/fallback profile)
- **Frontend**: HTML5, CSS3, JavaScript (ES6+ REST API client), Bootstrap 5.3, Bootstrap Icons
- **Build Tool**: Apache Maven

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Dashboard URL |
| :--- | :--- | :--- | :--- |
| **Admin / Placement Officer** | `admin@placement.com` | `admin123` | `/admin-dashboard.html` |
| **Student (Demo)** | `student@placement.com` | `student123` | `/student-dashboard.html` |
| **Student 2 (Ananya)** | `ananya.verma@placement.com` | `student123` | `/student-dashboard.html` |
| **Student 3 (Rohan)** | `rohan.patel@placement.com` | `student123` | `/student-dashboard.html` |

*(Quick demo buttons are also provided on the Login page for one-click instant sign-in).*

---

## 🚀 How to Run the Application

### Prerequisites:
- Java JDK 17 or higher (`java -version`)
- MySQL 8.0 running on `localhost:3306` (or use H2 fallback profile)

### Step 1: Clone or Navigate to Project Directory
```powershell
cd "c:\Users\thall\OneDrive\Desktop\Student Placement & Internship Management System"
```

### Step 2: (Optional) Set MySQL Environment Variables
If your MySQL root user has a password:
```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
```

### Step 3: Run with Maven

To run with **MySQL**:
```powershell
& "$env:LOCALAPPDATA\Programs\Maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
```
*(Or if `mvn` is in your PATH: `mvn spring-boot:run`)*

To run with **H2 In-Memory DB** (Zero database setup needed):
```powershell
& "$env:LOCALAPPDATA\Programs\Maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run "-Dspring-boot.run.profiles=h2"
```

### Step 4: Open in Web Browser
Open your browser and navigate to:
```
http://localhost:8080
```

---

## 📡 Key REST APIs Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & get role |
| `POST` | `/api/auth/register` | Register student or recruiter |
| `GET` | `/api/students/{id}` | Get student profile details |
| `PUT` | `/api/students/{id}` | Update student profile & recalculate completion % |
| `GET` | `/api/students/{id}/stats` | Get student dashboard counts |
| `GET` | `/api/jobs` | Get all jobs (with applied flag for current student) |
| `GET` | `/api/jobs/search` | Search jobs by keyword, location, jobType |
| `POST` | `/api/jobs` | Post new job (Admin/Recruiter) |
| `DELETE` | `/api/jobs/{id}` | Delete job |
| `GET` | `/api/internships` | Get all internships |
| `POST` | `/api/internships` | Post new internship |
| `POST` | `/api/applications` | Apply for job/internship (prevents duplicate) |
| `GET` | `/api/applications/student/{id}` | Get applications by student |
| `PUT` | `/api/applications/{id}/status` | Update application status & notify student |
| `GET` | `/api/interviews/student/{id}` | Get student interview schedules |
| `POST` | `/api/interviews` | Schedule an interview |
| `GET` | `/api/notifications/user/{userId}` | Get user notifications |
| `PUT` | `/api/notifications/{id}/read` | Mark notification as read |
| `GET` | `/api/admin/stats` | Real-time system metrics for Admin Dashboard |

---

## 🗄️ Database Architecture (MySQL)

- `users`: Stores login credentials, hashed BCrypt password, and Role (`ADMIN`, `STUDENT`, `RECRUITER`).
- `students`: Linked one-to-one with `users`, storing academics, CGPA, department, graduation year, skills, and resume link.
- `companies`: Corporate partner information, domains, locations, and contact info.
- `jobs`: Full-time roles, compensation packages, required skills, and deadlines.
- `internships`: Practical internship roles, durations (e.g. 3/6 Months), stipends, and minimum CGPA criteria.
- `applications`: Applications submitted by students for jobs or internships with unique constraint `(student_id, job_id)` preventing duplicates.
- `interviews`: Scheduled candidate interviews with dates, times, mode (`ONLINE`/`OFFLINE`), and venue links.
- `placement_drives`: Campus recruitment drives and pooled hiring schedules.
- `notifications`: Student notification stream with read/unread tracking.

---

## 🧪 Running Automated Tests
```powershell
mvn test
```
All automated unit and integration tests run on the in-memory H2 profile to guarantee zero external dependency during build and continuous testing.

---

## ☁️ Cloud Deployment on Railway

1. **Push your repository to GitHub** (ensure `.env` and secrets are never committed).
2. **Log in to [railway.app](https://railway.app)** using your GitHub account.
3. Click **"New Project"** -> **"Deploy from GitHub repo"** and select this repository.
4. Click **"+ New"** -> **"Database"** -> **"Add MySQL"**.
5. Under your application service settings, link the following environment variable names using Railway reference syntax:
   - `MYSQLHOST` = `${{MySQL.MYSQLHOST}}`
   - `MYSQLPORT` = `${{MySQL.MYSQLPORT}}`
   - `MYSQLDATABASE` = `${{MySQL.MYSQLDATABASE}}`
   - `MYSQLUSER` = `${{MySQL.MYSQLUSER}}`
   - `MYSQLPASSWORD` = `${{MySQL.MYSQLPASSWORD}}`
6. Under **Service Settings** -> **Networking**, click **"Generate Domain"** to produce your public HTTPS URL.
