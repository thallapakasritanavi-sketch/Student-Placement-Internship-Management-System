import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def update_presentation(pptx_path):
    print(f"Loading presentation from: {pptx_path}")
    prs = Presentation(pptx_path)
    total_slides = len(prs.slides)
    print(f"Total slides: {total_slides}")

    COLOR_PRIMARY = RGBColor(15, 23, 42)    # Deep slate
    COLOR_BODY = RGBColor(30, 41, 59)       # Dark slate text
    COLOR_BLUE = RGBColor(30, 64, 175)      # Primary accent blue
    COLOR_MUTED = RGBColor(71, 85, 105)     # Muted text

    CURRENT_DATE = "24 October 2026"
    STUDENT_NAME = "T.SRI TANAVI,  44111174"
    GUIDE_NAME = "Mr. Mohammed Haseeb Rakshan P"
    GUIDE_DESIGNATION = "Assistant Professor, CSE"

    # =========================================================================
    # SLIDE 1: TITLE SLIDE
    # =========================================================================
    s1 = prs.slides[0]
    for shp in s1.shapes:
        if shp.name == "Subtitle 2" and shp.shape_id == 17 and shp.has_text_frame:
            tf = shp.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.alignment = PP_ALIGN.CENTER
            run = p.add_run()
            run.text = "STUDENT PLACEMENT & INTERNSHIP MANAGEMENT SYSTEM"
            run.font.name = "Arial"
            run.font.size = Pt(28)
            run.font.bold = True
            run.font.color.rgb = COLOR_PRIMARY
        elif shp.name == "Subtitle 2" and shp.shape_id == 29 and shp.has_text_frame:
            tf = shp.text_frame
            tf.clear()
            
            p0 = tf.paragraphs[0]
            p0.alignment = PP_ALIGN.LEFT
            r0 = p0.add_run()
            r0.text = "PROJECT STUDENT                                                                         GUIDE"
            r0.font.name = "Arial"
            r0.font.size = Pt(16)
            r0.font.bold = True
            r0.font.color.rgb = COLOR_PRIMARY

            p1 = tf.add_paragraph()
            p1.alignment = PP_ALIGN.LEFT
            r1 = p1.add_run()
            r1.text = f"{STUDENT_NAME}                                                               {GUIDE_NAME}"
            r1.font.name = "Times New Roman"
            r1.font.size = Pt(14)
            r1.font.bold = True
            r1.font.color.rgb = COLOR_BODY

            p2 = tf.add_paragraph()
            p2.alignment = PP_ALIGN.LEFT
            r2 = p2.add_run()
            r2.text = f"                                                                                          {GUIDE_DESIGNATION}"
            r2.font.name = "Times New Roman"
            r2.font.size = Pt(14)
            r2.font.bold = True
            r2.font.color.rgb = COLOR_BLUE
        elif shp.name == "Date Placeholder 3" and shp.has_text_frame:
            shp.text_frame.text = CURRENT_DATE
            if shp.text_frame.paragraphs and shp.text_frame.paragraphs[0].runs:
                shp.text_frame.paragraphs[0].runs[0].font.name = "Times New Roman"
                shp.text_frame.paragraphs[0].runs[0].font.size = Pt(10)

    # =========================================================================
    # SLIDE 2: AGENDA
    # =========================================================================
    s2 = prs.slides[1]
    for shp in s2.shapes:
        if shp.name == "Date Placeholder 3" and shp.has_text_frame:
            shp.text_frame.text = CURRENT_DATE
            if shp.text_frame.paragraphs and shp.text_frame.paragraphs[0].runs:
                shp.text_frame.paragraphs[0].runs[0].font.name = "Times New Roman"
                shp.text_frame.paragraphs[0].runs[0].font.size = Pt(10)

    # =========================================================================
    # SLIDE 3: COURSE CERTIFICATE
    # =========================================================================
    s3 = prs.slides[2]
    for shp in s3.shapes:
        if shp.name.startswith("Content Placeholder") and shp.has_text_frame:
            tf = shp.text_frame
            tf.clear()
            
            p_head = tf.paragraphs[0]
            p_head.text = "CERTIFICATE OF PROFESSIONAL TRAINING"
            p_head.alignment = PP_ALIGN.LEFT
            p_head.space_after = Pt(14)
            if p_head.runs:
                p_head.runs[0].font.name = "Times New Roman"
                p_head.runs[0].font.size = Pt(20)
                p_head.runs[0].font.bold = True
                p_head.runs[0].font.color.rgb = COLOR_BLUE

            cert_rows = [
                ("Project Title", "Student Placement & Internship Management System"),
                ("Student Name", "T. Sri Tanavi (Register No: 44111174)"),
                ("Department", "Department of Computer Science and Engineering"),
                ("Institution", "School of Computing, Sathyabama Institute of Science and Technology"),
                ("Domain", "Full Stack Java, Spring Boot 3 & Relational Database Architecture"),
                ("Training Component", "Professional Training I"),
                ("Project Status", "Completed, Tested, Containerized & Verified Successfully"),
                ("Live Cloud Website", "https://student-placement-internship-management.onrender.com")
            ]

            for label, val in cert_rows:
                p = tf.add_paragraph()
                p.space_after = Pt(6)
                
                r_label = p.add_run()
                r_label.text = f"{label}: "
                r_label.font.name = "Times New Roman"
                r_label.font.size = Pt(15)
                r_label.font.bold = True
                r_label.font.color.rgb = COLOR_PRIMARY

                r_val = p.add_run()
                r_val.text = val
                r_val.font.name = "Times New Roman"
                r_val.font.size = Pt(15)
                r_val.font.bold = False
                r_val.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 4: ABSTRACT
    # =========================================================================
    s4 = prs.slides[3]
    for shp in s4.shapes:
        if shp.name.startswith("Content Placeholder") and shp.has_text_frame:
            tf = shp.text_frame
            tf.clear()
            
            abstract_points = [
                ("Project Overview", "Developed a centralized, secure, full-stack placement and internship portal engineered to automate and modernize campus recruitment and student career lifecycle workflows."),
                ("Student Lifecycle Management", "Empowers students to maintain comprehensive academic profiles, track real-time profile completion scores, discover full-time jobs and internships with multi-criteria filters, apply with 1-click, and track live application statuses."),
                ("Recruiter & Placement Features", "Enables placement officers and corporate recruiters to post verified openings, shortlist eligible candidates via CGPA criteria, coordinate interview rounds with meeting links, and broadcast instant in-app alerts."),
                ("Architecture & Tech Stack", "Built on Java 17+, Spring Boot 3 REST API architecture, Spring Data JPA, Hibernate ORM, MySQL 8.0 relational database, and responsive Bootstrap 5 frontend."),
                ("Cloud Deployment & Reliability", "Dockerized and deployed live on Render PaaS with automated duplicate application prevention and secure HTTPS session handling.")
            ]

            for idx, (title, text) in enumerate(abstract_points):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                p.space_after = Pt(8)
                p.level = 0
                
                r_head = p.add_run()
                r_head.text = f"{title}: "
                r_head.font.name = "Times New Roman"
                r_head.font.size = Pt(15)
                r_head.font.bold = True
                r_head.font.color.rgb = COLOR_PRIMARY

                r_body = p.add_run()
                r_body.text = text
                r_body.font.name = "Times New Roman"
                r_body.font.size = Pt(14)
                r_body.font.bold = False
                r_body.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 5: INTRODUCTION
    # =========================================================================
    s5 = prs.slides[4]
    for shp in s5.shapes:
        if shp.name.startswith("Content Placeholder") and shp.has_text_frame:
            tf = shp.text_frame
            tf.clear()
            
            intro_sections = [
                ("Background & Motivation", [
                    "Conventional placement drives rely on disjoint spreadsheets, emails, and physical notice boards, leading to communication delays and missed career opportunities.",
                    "Students often lack a centralized platform to monitor eligibility requirements, multiple applications, interview dates, and recruitment drive schedules."
                ]),
                ("Proposed Solution", [
                    "A unified web portal bridging Students, Corporate Recruiters, and Placement Officers with automated application workflows, real-time status badges, and instant alerts."
                ]),
                ("Why Java & Spring Boot?", [
                    "Java delivers enterprise-grade scalability, strong type safety, and robust platform independence.",
                    "Spring Boot provides auto-configured RESTful controllers, Spring Data JPA for data persistence, and BCrypt password encryption for bulletproof security."
                ]),
                ("Production Cloud Deployment", [
                    "Hosted online on Render Cloud PaaS with containerized Docker services, guaranteeing 24/7 global access and automated CI/CD builds."
                ])
            ]

            first = True
            for sec_title, bullet_list in intro_sections:
                p_head = tf.paragraphs[0] if first else tf.add_paragraph()
                first = False
                p_head.space_before = Pt(4)
                p_head.space_after = Pt(2)
                p_head.level = 0
                
                r_h = p_head.add_run()
                r_h.text = sec_title
                r_h.font.name = "Times New Roman"
                r_h.font.size = Pt(15)
                r_h.font.bold = True
                r_h.font.color.rgb = COLOR_BLUE

                for b in bullet_list:
                    p_b = tf.add_paragraph()
                    p_b.space_after = Pt(3)
                    p_b.level = 1
                    
                    r_b = p_b.add_run()
                    r_b.text = b
                    r_b.font.name = "Times New Roman"
                    r_b.font.size = Pt(13)
                    r_b.font.bold = False
                    r_b.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 6: SYSTEM ARCHITECTURE (Text)
    # =========================================================================
    s6 = prs.slides[5]
    for shp in s6.shapes:
        if shp.name.startswith("Content Placeholder") and shp.has_text_frame:
            tf = shp.text_frame
            tf.clear()
            
            arch_sections = [
                ("3-Tier Enterprise Web Architecture", [
                    "Presentation Layer: Responsive frontend built with HTML5, CSS3, JavaScript (REST Client), and Bootstrap 5 for seamless desktop and mobile access.",
                    "Application Layer: Spring Boot 3 REST Controllers, Service business logic, session-based RBAC authentication, and global exception handlers.",
                    "Data Persistence Layer: Spring Data JPA and Hibernate ORM managing relational entities (Users, Students, Jobs, Internships, Applications, Interviews, Placement Drives) on MySQL 8.0."
                ]),
                ("Security & Data Integrity", [
                    "Role-Based Access Control (RBAC): Strict authorization boundaries for Student, Admin, and Recruiter roles with BCrypt password hashing.",
                    "Unique Constraint Enforcement: Relational database rules enforce zero duplicate applications per student and job/internship opening.",
                    "Cloud Hosting & HTTPS: Deployed via Docker on Render PaaS with automated health monitoring and secure HTTPS cookies."
                ])
            ]

            first = True
            for sec_title, bullet_list in arch_sections:
                p_head = tf.paragraphs[0] if first else tf.add_paragraph()
                first = False
                p_head.space_before = Pt(4)
                p_head.space_after = Pt(2)
                p_head.level = 0
                
                r_h = p_head.add_run()
                r_h.text = sec_title
                r_h.font.name = "Times New Roman"
                r_h.font.size = Pt(15)
                r_h.font.bold = True
                r_h.font.color.rgb = COLOR_BLUE

                for b in bullet_list:
                    p_b = tf.add_paragraph()
                    p_b.space_after = Pt(4)
                    p_b.level = 1
                    
                    r_b = p_b.add_run()
                    r_b.text = b
                    r_b.font.name = "Times New Roman"
                    r_b.font.size = Pt(13)
                    r_b.font.bold = False
                    r_b.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 7: SYSTEM ARCHITECTURE - DIAGRAM
    # =========================================================================
    s7 = prs.slides[6]
    for shp in s7.shapes:
        if shp.name == "Title 1" and shp.has_text_frame:
            shp.text_frame.text = "SYSTEM ARCHITECTURE – DIAGRAM"
            if shp.text_frame.paragraphs and shp.text_frame.paragraphs[0].runs:
                shp.text_frame.paragraphs[0].runs[0].font.name = "Times New Roman"
                shp.text_frame.paragraphs[0].runs[0].font.size = Pt(28)
                shp.text_frame.paragraphs[0].runs[0].font.bold = True
        elif shp.name == "Flow Caption" and shp.has_text_frame:
            shp.text_frame.text = "Request Flow:  Browser (Bootstrap UI)  →  REST API  →  Service Layer  →  JPA / Hibernate  →  MySQL (Render Cloud)"
            if shp.text_frame.paragraphs and shp.text_frame.paragraphs[0].runs:
                shp.text_frame.paragraphs[0].runs[0].font.name = "Times New Roman"
                shp.text_frame.paragraphs[0].runs[0].font.size = Pt(11)

    # =========================================================================
    # SLIDE 8: MODULE IMPLEMENTATION (Text)
    # =========================================================================
    s8 = prs.slides[7]
    for shp in s8.shapes:
        if shp.name.startswith("Content Placeholder") and shp.has_text_frame:
            tf = shp.text_frame
            tf.clear()
            
            modules = [
                ("1. Authentication & Role-Based Authorization Module", "User registration, secure login, BCrypt password hashing, session cookies, and role-based dashboard routing (Student, Admin, Recruiter)."),
                ("2. Student Profile & Academic Management Module", "Manages CGPA, department, graduation year, skill badges, certifications, projects, and real-time profile completion % calculation."),
                ("3. Job & Internship Management Module", "Full CRUD operations for postings with multi-criteria eligibility filters (min CGPA, required skills, stipend/salary, deadlines)."),
                ("4. Application Tracking & Status Workflow Module", "Single-click apply with duplicate submission prevention; 5-stage status workflow (Applied, Shortlisted, Interview Scheduled, Selected, Rejected)."),
                ("5. Interview Scheduling & In-App Notification Module", "Coordinates online/offline interview rounds with meeting links and triggers automated in-app alerts on status updates."),
                ("6. Production Cloud Deployment & Monitoring Module", "Docker containerization, live Render PaaS deployment, and Spring Actuator health monitoring.")
            ]

            first = True
            for title, desc in modules:
                p_head = tf.paragraphs[0] if first else tf.add_paragraph()
                first = False
                p_head.space_after = Pt(1)
                p_head.level = 0
                
                r_h = p_head.add_run()
                r_h.text = title
                r_h.font.name = "Times New Roman"
                r_h.font.size = Pt(14)
                r_h.font.bold = True
                r_h.font.color.rgb = COLOR_PRIMARY

                p_desc = tf.add_paragraph()
                p_desc.space_after = Pt(4)
                p_desc.level = 1
                
                r_d = p_desc.add_run()
                r_d.text = desc
                r_d.font.name = "Times New Roman"
                r_d.font.size = Pt(12)
                r_d.font.bold = False
                r_d.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 9: MODULE IMPLEMENTATION - WORKFLOW
    # =========================================================================
    s9 = prs.slides[8]
    for shp in s9.shapes:
        if shp.name == "Title 1" and shp.has_text_frame:
            shp.text_frame.text = "MODULE IMPLEMENTATION – WORKFLOW"
            if shp.text_frame.paragraphs and shp.text_frame.paragraphs[0].runs:
                shp.text_frame.paragraphs[0].runs[0].font.name = "Times New Roman"
                shp.text_frame.paragraphs[0].runs[0].font.size = Pt(28)
                shp.text_frame.paragraphs[0].runs[0].font.bold = True

    # =========================================================================
    # SLIDE 10: RESULTS AND DISCUSSIONS
    # =========================================================================
    s10 = prs.slides[9]
    for shp in s10.shapes:
        if shp.name.startswith("Content Placeholder") and shp.has_text_frame:
            tf = shp.text_frame
            tf.clear()
            
            results_sections = [
                ("Functional & Performance Results", [
                    "Zero Runtime Errors: Fully functional Spring Boot backend running locally on port 8080 and globally on Render cloud.",
                    "Live Website: Operational and publicly accessible at https://student-placement-internship-management.onrender.com.",
                    "High Query Performance: Optimized Spring Data JPA database queries achieve sub-30ms response times for opening searches and filters."
                ]),
                ("Automated Testing & Security Verification", [
                    "100% test pass rate across automated JUnit 5 / Spring Boot test suite verifying registration, login, application submission, and status transitions.",
                    "Strict Data Integrity: Zero duplicate applications permitted via database and service-level constraints; BCrypt encrypted credentials."
                ]),
                ("User Experience (UX) Outcomes", [
                    "Intuitive modern blue & white enterprise portal with live status badges, metric counters, and instant alert notifications.",
                    "Significantly streamlines campus placement coordination for students, recruiters, and placement officers."
                ])
            ]

            first = True
            for sec_title, bullet_list in results_sections:
                p_head = tf.paragraphs[0] if first else tf.add_paragraph()
                first = False
                p_head.space_before = Pt(4)
                p_head.space_after = Pt(2)
                p_head.level = 0
                
                r_h = p_head.add_run()
                r_h.text = sec_title
                r_h.font.name = "Times New Roman"
                r_h.font.size = Pt(15)
                r_h.font.bold = True
                r_h.font.color.rgb = COLOR_BLUE

                for b in bullet_list:
                    p_b = tf.add_paragraph()
                    p_b.space_after = Pt(3)
                    p_b.level = 1
                    
                    r_b = p_b.add_run()
                    r_b.text = b
                    r_b.font.name = "Times New Roman"
                    r_b.font.size = Pt(13)
                    r_b.font.bold = False
                    r_b.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 11: CONCLUSION
    # =========================================================================
    s11 = prs.slides[10]
    for shp in s11.shapes:
        if shp.name.startswith("Content Placeholder") and shp.has_text_frame:
            tf = shp.text_frame
            tf.clear()
            
            conclusion_sections = [
                ("Project Summary", [
                    "Successfully built, validated, and deployed the 'Student Placement & Internship Management System' using Java 17+, Spring Boot 3, MySQL 8.0, and Bootstrap 5.",
                    "Delivered an end-to-end recruitment management portal connecting students, recruiters, and placement officers seamlessly."
                ]),
                ("Key Achievements", [
                    "Robust relational database design with complete data integrity and duplicate application prevention.",
                    "Real-time analytics dashboards, dynamic profile scoring, in-app notification alerts, and live cloud deployment on Render."
                ]),
                ("Future Scope & Enhancements", [
                    "AI-powered resume parsing and intelligent candidate-to-job semantic matching algorithms.",
                    "Automated email and SMS gateways for interview call letters and official offer releases.",
                    "Cross-platform mobile application using Flutter / React Native for on-the-go notifications."
                ])
            ]

            first = True
            for sec_title, bullet_list in conclusion_sections:
                p_head = tf.paragraphs[0] if first else tf.add_paragraph()
                first = False
                p_head.space_before = Pt(4)
                p_head.space_after = Pt(2)
                p_head.level = 0
                
                r_h = p_head.add_run()
                r_h.text = sec_title
                r_h.font.name = "Times New Roman"
                r_h.font.size = Pt(15)
                r_h.font.bold = True
                r_h.font.color.rgb = COLOR_BLUE

                for b in bullet_list:
                    p_b = tf.add_paragraph()
                    p_b.space_after = Pt(3)
                    p_b.level = 1
                    
                    r_b = p_b.add_run()
                    r_b.text = b
                    r_b.font.name = "Times New Roman"
                    r_b.font.size = Pt(13)
                    r_b.font.bold = False
                    r_b.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 12: REFERENCES
    # =========================================================================
    s12 = prs.slides[11]
    for shp in s12.shapes:
        if shp.name.startswith("Content Placeholder") and shp.has_text_frame:
            tf = shp.text_frame
            tf.clear()
            
            references = [
                "[1]. Spring Boot Documentation Team, 'Spring Boot Reference Guide (v3.x)', VMware Tanzu / Broadcom, https://spring.io/projects/spring-boot, 2026.",
                "[2]. Oracle Corporation, 'Java SE 17 & 21 Documentation and Language Specifications', Oracle Press, 2026.",
                "[3]. Christian Bauer, Gavin King, and Gary Gregory, 'Java Persistence with Hibernate and Spring Data JPA', Manning Publications.",
                "[4]. MySQL Development Team, 'MySQL 8.0 Reference Manual: Relational Database Architecture', Oracle Corporation, https://dev.mysql.com/doc/.",
                "[5]. Bootstrap Core Team, 'Bootstrap 5: Responsive Frontend Toolkit & Component Framework', https://getbootstrap.com/.",
                "[6]. Render Cloud Infrastructure, 'Cloud Application Deployment & Managed Database Services', https://render.com/docs, 2026."
            ]

            for idx, ref in enumerate(references):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                p.space_after = Pt(8)
                p.level = 0
                r = p.add_run()
                r.text = ref
                r.font.name = "Times New Roman"
                r.font.size = Pt(14)
                r.font.bold = False
                r.font.color.rgb = COLOR_BODY
        elif shp.name == "Date Placeholder 3" and shp.has_text_frame:
            shp.text_frame.text = CURRENT_DATE
            if shp.text_frame.paragraphs and shp.text_frame.paragraphs[0].runs:
                shp.text_frame.paragraphs[0].runs[0].font.name = "Times New Roman"
                shp.text_frame.paragraphs[0].runs[0].font.size = Pt(10)
        elif shp.name == "Slide Number Placeholder 5" and shp.has_text_frame:
            shp.text_frame.text = "12"
            if shp.text_frame.paragraphs and shp.text_frame.paragraphs[0].runs:
                shp.text_frame.paragraphs[0].runs[0].font.name = "Times New Roman"
                shp.text_frame.paragraphs[0].runs[0].font.size = Pt(10)

    # =========================================================================
    # SLIDE 13: THANK YOU
    # =========================================================================
    s13 = prs.slides[12]
    for shp in s13.shapes:
        if shp.name == "Date Placeholder 2" and shp.has_text_frame:
            shp.text_frame.text = CURRENT_DATE
            if shp.text_frame.paragraphs and shp.text_frame.paragraphs[0].runs:
                shp.text_frame.paragraphs[0].runs[0].font.name = "Times New Roman"
                shp.text_frame.paragraphs[0].runs[0].font.size = Pt(10)
        elif shp.name == "Slide Number Placeholder 4" and shp.has_text_frame:
            shp.text_frame.text = "13"
            if shp.text_frame.paragraphs and shp.text_frame.paragraphs[0].runs:
                shp.text_frame.paragraphs[0].runs[0].font.name = "Times New Roman"
                shp.text_frame.paragraphs[0].runs[0].font.size = Pt(10)

    # Save presentation
    prs.save(pptx_path)
    print(f"Successfully updated and saved: {pptx_path}")

def main():
    source_pptx = r'C:\Users\thall\OneDrive\Desktop\PT-TANAVI.pptx'
    
    # Target paths to keep updated and in sync
    targets = [
        r'C:\Users\thall\OneDrive\Desktop\PT-TANAVI.pptx',
        r'C:\Users\thall\OneDrive\Desktop\Student Placement & Internship Management System Presentation.pptx',
        r'C:\Users\thall\OneDrive\Desktop\Student Placement & Internship Management System\Student_Placement_and_Internship_Management_System_Presentation.pptx',
        r'C:\Users\thall\OneDrive\Desktop\Professional Training PPT edited.pptx'
    ]

    # Update PT-TANAVI.pptx first
    update_presentation(source_pptx)

    # Copy the master updated presentation to all other targets so they are completely in sync
    for target in targets[1:]:
        print(f"Syncing updated presentation to: {target}")
        shutil.copyfile(source_pptx, target)

    print("\nAll presentations successfully updated and synchronized!")

if __name__ == '__main__':
    main()
