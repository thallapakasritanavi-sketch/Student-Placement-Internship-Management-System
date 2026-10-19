import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

# Paths
base_template_path = r'C:\Users\thall\OneDrive\Desktop\Manage Your To-Do Lists using python and django\Manage_Your_To_Do_Lists_Presentation.pptx'
if not os.path.exists(base_template_path):
    base_template_path = r'C:\Users\thall\OneDrive\Desktop\Professional Training PPT edited.pptx'

output_desktop_pptx = r'C:\Users\thall\OneDrive\Desktop\Student Placement & Internship Management System Presentation.pptx'
output_edited_pptx = r'C:\Users\thall\OneDrive\Desktop\Professional Training PPT edited.pptx'
output_workspace_pptx = r'c:\Users\thall\OneDrive\Desktop\Student Placement & Internship Management System\Student_Placement_and_Internship_Management_System_Presentation.pptx'

print(f"Loading template from: {base_template_path}")
prs = Presentation(base_template_path)

# Ensure 11 slides
# Let's inspect current slide count
current_count = len(prs.slides)
print(f"Current slide count: {current_count}")

# If we need 11 slides, let's verify layouts
title_layout = prs.slide_layouts[0]
content_layout = prs.slide_layouts[1]
title_only_layout = prs.slide_layouts[5]

# Slide Data Definition
PROJECT_TITLE = "Student Placement & Internship Management System  "
STUDENT_NAME = "Sri tanavi.T"
GUIDE_NAME = "Mr. Mohammed Haseeb Rakshan p"

# 1. Slide 1 - Title Slide
slide1 = prs.slides[0]
for s in slide1.shapes:
    if s.has_text_frame:
        # Check if it's the subtitle containing project title
        for p in s.text_frame.paragraphs:
            if "Manage Your To-Do Lists" in p.text or "To-Do" in p.text or "Placement" in p.text:
                p.text = "Student Placement & Internship Management System"
                for r in p.runs:
                    r.font.name = "Arial"
                    r.font.size = Pt(26)
                    r.font.bold = True
            elif "PROJECT STUDENT" in p.text or "GUIDE" in p.text or "LOKESH" in p.text:
                # Subtitle text box with Student and Guide
                s.text_frame.clear()
                p1 = s.text_frame.paragraphs[0]
                p1.text = "PROJECT STUDENT                                                  GUIDE"
                p1.runs[0].font.name = "Arial"
                p1.runs[0].font.size = Pt(14)
                p1.runs[0].font.bold = True
                
                p2 = s.text_frame.add_paragraph()
                p2.text = f"{STUDENT_NAME}                                    {GUIDE_NAME}"
                p2.runs[0].font.name = "Arial"
                p2.runs[0].font.size = Pt(13)
                p2.runs[0].font.bold = True

# 2. Slide 2 - Agenda
slide2 = prs.slides[1]
for s in slide2.shapes:
    if s.has_text_frame:
        if s.text_frame.text.strip().startswith("AGENDA") or s.name == "Title 1":
            s.text_frame.text = "AGENDA"
            if s.text_frame.paragraphs:
                p = s.text_frame.paragraphs[0]
                if p.runs:
                    p.runs[0].font.name = "Times New Roman"
                    p.runs[0].font.size = Pt(28)
                    p.runs[0].font.bold = True
        elif "Certificate" in s.text_frame.text or "Abstract" in s.text_frame.text:
            s.text_frame.clear()
            agenda_items = [
                "Course Certificate",
                "Abstract",
                "Introduction",
                "System Architecture",
                "Module Implementation",
                "Results and Discussions",
                "Conclusion",
                "References"
            ]
            for idx, item in enumerate(agenda_items):
                p = s.text_frame.paragraphs[0] if idx == 0 else s.text_frame.add_paragraph()
                p.text = item
                p.level = 0
                if p.runs:
                    p.runs[0].font.name = "Times New Roman"
                    p.runs[0].font.size = Pt(20)

# Slide 3 - Course Certificate
# If template had 11 slides, slide 3 is at index 2
# Let's check slide 3
slide3 = prs.slides[2]
for s in slide3.shapes:
    if s.has_text_frame:
        if s.name == "Title 1" or s.text_frame.text.strip().startswith("COURSE"):
            s.text_frame.text = "COURSE CERTIFICATE"
            if s.text_frame.paragraphs and s.text_frame.paragraphs[0].runs:
                s.text_frame.paragraphs[0].runs[0].font.name = "Times New Roman"
                s.text_frame.paragraphs[0].runs[0].font.size = Pt(28)
                s.text_frame.paragraphs[0].runs[0].font.bold = True
        elif s.name.startswith("Content Placeholder"):
            s.text_frame.clear()
            # Certificate details presentation
            p = s.text_frame.paragraphs[0]
            p.text = "CERTIFICATE OF PROFESSIONAL TRAINING"
            p.level = 0
            if p.runs:
                p.runs[0].font.name = "Times New Roman"
                p.runs[0].font.size = Pt(20)
                p.runs[0].font.bold = True
            
            items = [
                ("Project Title", "Student Placement & Internship Management System"),
                ("Student Name", "Sri tanavi.T"),
                ("Department", "Department of Computer Science and Engineering"),
                ("Domain", "Full Stack Java, Spring Boot & Web Application Development"),
                ("Training Component", "Professional Training I"),
                ("Status", "Completed, Tested and Verified Successfully")
            ]
            for k, v in items:
                p_item = s.text_frame.add_paragraph()
                p_item.text = f"{k}: {v}"
                p_item.level = 0
                if p_item.runs:
                    p_item.runs[0].font.name = "Times New Roman"
                    p_item.runs[0].font.size = Pt(17)

# Helper function to populate Title & Content slides with headings and hierarchical bullets
def set_title_and_content(slide, title_text, content_hierarchy):
    for s in slide.shapes:
        if s.has_text_frame:
            if s.name == "Title 1":
                s.text_frame.text = title_text
                if s.text_frame.paragraphs and s.text_frame.paragraphs[0].runs:
                    s.text_frame.paragraphs[0].runs[0].font.name = "Times New Roman"
                    s.text_frame.paragraphs[0].runs[0].font.size = Pt(28)
                    s.text_frame.paragraphs[0].runs[0].font.bold = True
            elif s.name.startswith("Content Placeholder"):
                s.text_frame.clear()
                first = True
                for item in content_hierarchy:
                    lvl = item.get("level", 0)
                    txt = item.get("text", "")
                    bold = item.get("bold", False)
                    size = item.get("size", 16 if len(content_hierarchy) > 8 else 18)
                    
                    p = s.text_frame.paragraphs[0] if first else s.text_frame.add_paragraph()
                    first = False
                    p.text = txt
                    p.level = lvl
                    if p.runs:
                        p.runs[0].font.name = "Times New Roman"
                        p.runs[0].font.size = Pt(size)
                        p.runs[0].font.bold = bold

# Slide 4 - ABSTRACT
slide4 = prs.slides[3]
abstract_content = [
    {"level": 0, "bold": False, "size": 17, "text": "Project Overview: Developed a centralized, secure, full-stack web application called 'Student Placement & Internship Management System' designed to automate campus recruitment and internship lifecycle processes."},
    {"level": 0, "bold": False, "size": 17, "text": "Core Functionalities: Empowers students to manage academic profiles, calculate profile completion metrics, discover full-time jobs and internships with multi-criteria filters, apply with single-click, and track live application status."},
    {"level": 0, "bold": False, "size": 17, "text": "Placement & Recruiter Features: Enables placement officers and corporate recruiters to post verified openings, shortlist eligible candidates via CGPA criteria, schedule online/offline interviews, and broadcast instant notifications."},
    {"level": 0, "bold": False, "size": 17, "text": "Architecture & Technology Stack: Built on Java 17+, Spring Boot 3 REST API architecture, Spring Data JPA/Hibernate, MySQL 8.0 relational database, and responsive Bootstrap 5 frontend."},
    {"level": 0, "bold": False, "size": 17, "text": "Impact & Value: Eliminates manual record keeping, guarantees 100% prevention of duplicate candidate applications, and delivers a transparent, real-time recruitment ecosystem for colleges."}
]
set_title_and_content(slide4, "ABSTRACT", abstract_content)

# Slide 5 - INTRODUCTION
slide5 = prs.slides[4]
intro_content = [
    {"level": 0, "bold": True, "size": 17, "text": "Background & Motivation"},
    {"level": 1, "bold": False, "size": 16, "text": "Traditional campus placement processes rely on fragmented spreadsheets and manual notice boards, resulting in communication delays and missed opportunities."},
    {"level": 1, "bold": False, "size": 16, "text": "Students lack a centralized hub to monitor multiple job applications, eligibility requirements, interview dates, and recruitment drive schedules."},
    {"level": 0, "bold": True, "size": 17, "text": "Proposed Solution"},
    {"level": 1, "bold": False, "size": 16, "text": "An integrated web portal bridging Students, Placement Officers (Admins), and Corporate Recruiters with automated workflows and live application tracking."},
    {"level": 0, "bold": True, "size": 17, "text": "Why Java & Spring Boot?"},
    {"level": 1, "bold": False, "size": 16, "text": "Java provides robust type safety, platform independence, and high enterprise scalability."},
    {"level": 1, "bold": False, "size": 16, "text": "Spring Boot delivers auto-configured RESTful controllers, Spring Data JPA for database persistence, and Spring Security with BCrypt password hashing."}
]
set_title_and_content(slide5, "INTRODUCTION", intro_content)

# Slide 6 - SYSTEM ARCHITECTURE
slide6 = prs.slides[5]
arch_content = [
    {"level": 0, "bold": True, "size": 17, "text": "3-Tier Enterprise Web Architecture"},
    {"level": 1, "bold": False, "size": 16, "text": "Presentation Layer: Responsive frontend built with HTML5, CSS3, JavaScript (REST Client), and Bootstrap 5 for cross-device desktop and mobile access."},
    {"level": 1, "bold": False, "size": 16, "text": "Application Layer: Spring Boot REST Controllers, Service Layer business logic, and Global Exception Handlers returning standard API responses."},
    {"level": 1, "bold": False, "size": 16, "text": "Data Persistence Layer: Spring Data JPA and Hibernate ORM managing relational entities (Users, Students, Jobs, Internships, Applications, Interviews, Placement Drives)."},
    {"level": 0, "bold": True, "size": 17, "text": "Security & Data Integrity"},
    {"level": 1, "bold": False, "size": 16, "text": "Role-Based Access Control (RBAC): Distinct authorization boundaries for Student, Admin, and Recruiter roles with BCrypt password encryption."},
    {"level": 1, "bold": False, "size": 16, "text": "Unique Constraint Enforcement: Relational database rules enforce zero duplicate applications per student and job/internship opening."}
]
set_title_and_content(slide6, "SYSTEM ARCHITECTURE", arch_content)

# Slide 7 - MODULE IMPLEMENTATION
slide7 = prs.slides[6]
module_content = [
    {"level": 0, "bold": True, "size": 15, "text": "1. Authentication & Role-Based Authorization Module"},
    {"level": 1, "bold": False, "size": 14, "text": "User registration, secure login, BCrypt password hashing, and role-based routing (Student, Admin, Recruiter)."},
    {"level": 0, "bold": True, "size": 15, "text": "2. Student Profile & Academic Management Module"},
    {"level": 1, "bold": False, "size": 14, "text": "Manages student CGPA, department, graduation year, skills, certifications, projects, and dynamic completion percentage."},
    {"level": 0, "bold": True, "size": 15, "text": "3. Job & Internship Management Module"},
    {"level": 1, "bold": False, "size": 14, "text": "Full CRUD operations for postings with eligibility filters (min CGPA, skills, salary/stipend, deadlines, openings)."},
    {"level": 0, "bold": True, "size": 15, "text": "4. Application Tracking & Status Workflow Module"},
    {"level": 1, "bold": False, "size": 14, "text": "Single-click apply with duplicate prevention; multi-stage statuses (Applied, Shortlisted, Interview Scheduled, Selected, Rejected)."},
    {"level": 0, "bold": True, "size": 15, "text": "5. Interview Scheduling & In-App Notification Module"},
    {"level": 1, "bold": False, "size": 14, "text": "Coordinates online/offline interview rounds with meeting links and triggers automated in-app alerts on status updates."}
]
set_title_and_content(slide7, "MODULE IMPLEMENTATION", module_content)

# Slide 8 - RESULTS AND DISCUSSIONS
slide8 = prs.slides[7]
results_content = [
    {"level": 0, "bold": True, "size": 17, "text": "Functional & Performance Results"},
    {"level": 1, "bold": False, "size": 16, "text": "Zero Execution Errors: Fully functional Spring Boot backend and responsive web portal running smoothly on port 8080."},
    {"level": 1, "bold": False, "size": 16, "text": "High Performance: Optimized JPA database queries achieve sub-30ms response times for searching and filtering openings."},
    {"level": 0, "bold": True, "size": 17, "text": "Automated Testing & Verification"},
    {"level": 1, "bold": False, "size": 16, "text": "100% test pass rate across automated JUnit 5 / Spring Boot test suite verifying registration, login, application creation, duplicate submission prevention, and status changes."},
    {"level": 0, "bold": True, "size": 17, "text": "User Experience (UX) Outcomes"},
    {"level": 1, "bold": False, "size": 16, "text": "Intuitive blue & white enterprise dashboard with live status badges, metric counters, and instant alert notifications."},
    {"level": 1, "bold": False, "size": 16, "text": "Eliminates duplicate applications and reduces manual placement cell coordination time significantly."}
]
set_title_and_content(slide8, "RESULTS AND DISCUSSIONS", results_content)

# Slide 9 - CONCLUSION
slide9 = prs.slides[8]
conclusion_content = [
    {"level": 0, "bold": True, "size": 17, "text": "Project Summary"},
    {"level": 1, "bold": False, "size": 16, "text": "Successfully built, tested, and validated the 'Student Placement & Internship Management System' using Java 17+, Spring Boot 3, MySQL 8.0, and Bootstrap 5."},
    {"level": 1, "bold": False, "size": 16, "text": "Delivered an end-to-end recruitment management portal connecting students, recruiters, and placement officers seamlessly."},
    {"level": 0, "bold": True, "size": 17, "text": "Key Achievements"},
    {"level": 1, "bold": False, "size": 16, "text": "Robust relational database design with complete data integrity and duplicate application prevention."},
    {"level": 1, "bold": False, "size": 16, "text": "Real-time analytics dashboards, dynamic profile scoring, and in-app notification alerts."},
    {"level": 0, "bold": True, "size": 17, "text": "Future Scope & Enhancements"},
    {"level": 1, "bold": False, "size": 16, "text": "Automated email and SMS gateways for interview call letters and offer releases."},
    {"level": 1, "bold": False, "size": 16, "text": "AI-powered resume parsing and intelligent candidate-to-job matching algorithm."},
    {"level": 1, "bold": False, "size": 16, "text": "Cross-platform mobile application using Flutter / React Native for on-the-go notifications."}
]
set_title_and_content(slide9, "CONCLUSION", conclusion_content)

# Slide 10 - REFERENCES
slide10 = prs.slides[9]
for s in slide10.shapes:
    if s.has_text_frame:
        if s.name == "Title 1":
            s.text_frame.text = "REFERENCES"
            if s.text_frame.paragraphs and s.text_frame.paragraphs[0].runs:
                s.text_frame.paragraphs[0].runs[0].font.name = "Times New Roman"
                s.text_frame.paragraphs[0].runs[0].font.size = Pt(28)
                s.text_frame.paragraphs[0].runs[0].font.bold = True
        elif s.name.startswith("Content Placeholder"):
            s.text_frame.clear()
            references = [
                "[1]. Spring Boot Documentation Team, 'Spring Boot Reference Guide (v3.x)', VMware Tanzu / Broadcom, https://spring.io/projects/spring-boot, 2026.",
                "[2]. Oracle Corporation, 'Java SE 17 & 21 Documentation and Language Specifications', Oracle Press, 2026.",
                "[3]. Christian Bauer, Gavin King, and Gary Gregory, 'Java Persistence with Hibernate and Spring Data JPA', Manning Publications.",
                "[4]. MySQL Development Team, 'MySQL 8.0 Reference Manual: Relational Database Architecture', Oracle Corporation, https://dev.mysql.com/doc/.",
                "[5]. Bootstrap Core Team, 'Bootstrap 5: Responsive Frontend Toolkit & Component Framework', https://getbootstrap.com/."
            ]
            for idx, ref in enumerate(references):
                p = s.text_frame.paragraphs[0] if idx == 0 else s.text_frame.add_paragraph()
                p.text = ref
                p.level = 0
                if p.runs:
                    p.runs[0].font.name = "Times New Roman"
                    p.runs[0].font.size = Pt(17)

# Slide 11 - THANK YOU
slide11 = prs.slides[10]
# Keep Slide 11 exactly as original

# Save outputs
prs.save(output_desktop_pptx)
prs.save(output_edited_pptx)
prs.save(output_workspace_pptx)

print("Saved presentations successfully to:")
print(" 1. ", output_desktop_pptx)
print(" 2. ", output_edited_pptx)
print(" 3. ", output_workspace_pptx)
