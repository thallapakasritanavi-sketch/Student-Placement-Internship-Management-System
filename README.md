# 🎓 Student Placement and Internship Management System

A cloud-native recruitment and campus placement platform designed to streamline corporate hiring, student portfolios, eligibility verification, multi-round interview coordination, and placement analytics.

---

## 🌟 Key Features

### 👨‍🎓 1. Student Portal
- **Academic & Career Portfolio**: Maintain verified cumulative CGPA, degree, branch, technical skills, certifications, and major projects.
- **Resume Upload & Management**: Direct resume upload (PDF/DOC) securely linked to profile.
- **Opportunity Discovery**: Browse full-time placements and summer internships with live search, branch filtering, and min-CGPA eligibility checks.
- **1-Click Application**: Instant submission with automated duplicate application prevention.
- **Application Status Tracking**: Real-time status updates (`Applied`, `Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected`).
- **Interview Hub**: View interview dates, times, and direct video conferencing links.

### 🏛️ 2. Placement Officer Administration (Sri Tanavi)
- **Executive Analytics Dashboard**: Live metrics tracking placement percentage, highest package, average CTC, total applications, and partner recruiters.
- **Job & Internship Publisher**: Create and manage verified corporate listings with detailed salary, stipend, CGPA criteria, and deadlines.
- **Candidate Evaluation Board**: Review student submissions with direct resume inspection and status actions (`Shortlist`, `Interview`, `Select`).
- **Interview Round Scheduler**: Schedule technical and HR interview rounds with dates, times, and meeting links.
- **Campus Drive Management**: Coordinate on-campus and virtual hiring drives for specific academic branches.
- **Student Registry**: Complete directory of verified students with search and skill tags.

### 🏢 3. Corporate Recruiter Desk
- **Talent Acquisition**: Post company openings for campus recruitment.
- **Resume Screening**: Direct access to candidate resumes without third-party email bottlenecks.
- **Hiring Pipeline**: Instant status updates (`Shortlist`, `Hire`, `Reject`) notifying students in real time.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & UI** | Tailwind CSS, Lucide React Icons |
| **Database** | Supabase PostgreSQL with Row Level Security (RLS) |
| **Authentication** | Supabase Auth (Email / Password + Role Guards) |
| **File Storage** | Supabase Storage (`resumes` bucket) |
| **Hosting & CI/CD** | Vercel Global Edge Network |
| **Reliability Fallback** | In-Browser Local Mock Store (Zero blank screens) |

---

## 🔑 Demo Access & Evaluation Credentials

Quick 1-Click access buttons are available on the login page:

| Role | Username / Identifier | Password | Access Highlights |
| :--- | :--- | :--- | :--- |
| **Admin (Placement Officer)** | `sri` or `sri@placement.com` | `admin123` | Full administrative control, analytics, drives, interview scheduler |
| **Student (Demo Account)** | `student@placement.com` | `student123` | Profile management, 1-click apply, live application tracker |
| **Student 2 (Ananya Verma)** | `ananya.verma@placement.com` | `student123` | Shortlisted candidate records & interview calls |
| **Recruiter (Google India)** | `recruiter@google.com` | `recruiter123` | Post openings, candidate screening & status updates |

---

## 💻 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/thallapakasritanavi-sketch/Student-Placement-Internship-Management-System.git
   cd "Student-Placement-Internship-Management-System"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables (optional for live Supabase integration)**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and provide your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

4. **Start development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## ☁️ Cloud Deployment

For detailed, step-by-step instructions on deploying this system to **Vercel** and configuring **Supabase**, please refer to [`DEPLOYMENT.md`](DEPLOYMENT.md).

---

## 📄 License & Credits
Developed for academic presentation and campus recruitment automation under the supervision of **Sri Tanavi**.
