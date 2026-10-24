package com.sritanavi.placement.config;

import com.sritanavi.placement.entity.*;
import com.sritanavi.placement.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Value("${app.admin.name:Sri Tanavi}")
    private String adminName;

    @Value("${app.admin.email:sri}")
    private String adminEmail;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final PlacementDriveRepository placementDriveRepository;
    private final InterviewRepository interviewRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentRepository studentRepository,
                           CompanyRepository companyRepository,
                           JobRepository jobRepository,
                           InternshipRepository internshipRepository,
                           ApplicationRepository applicationRepository,
                           PlacementDriveRepository placementDriveRepository,
                           InterviewRepository interviewRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.internshipRepository = internshipRepository;
        this.applicationRepository = applicationRepository;
        this.placementDriveRepository = placementDriveRepository;
        this.interviewRepository = interviewRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Synchronize / update existing Admin account if already present in database
        synchronizeAdminAccount();

        if (userRepository.count() > 0) {
            return; // Data already exists
        }

        System.out.println(">>> Initializing Student Placement & Internship Management System sample data...");

        // 1. Create Admin
        User admin = new User();
        admin.setEmail(adminEmail.trim().toLowerCase());
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setFullName(adminName.trim());
        admin.setPhone("+91 9876543210");
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        // 2. Create Companies
        Company techNova = companyRepository.save(new Company(null, "TechNova Solutions",
                "Leading global enterprise software and cloud consulting provider.",
                "https://technova.example.com", "Bangalore, India", "careers@technova.com", "+91 80 2345 6789"));

        Company cloudCore = companyRepository.save(new Company(null, "CloudCore Technologies",
                "Next-generation hybrid cloud infrastructure and DevOps platform solutions.",
                "https://cloudcore.example.com", "Hyderabad, India", "hr@cloudcore.com", "+91 40 4567 8901"));

        Company innoSoft = companyRepository.save(new Company(null, "InnoSoft Labs",
                "AI-driven SaaS product engineering lab building modern microservices.",
                "https://innosoft.example.com", "Pune, India", "talent@innosoft.com", "+91 20 6789 0123"));

        Company dataSphere = companyRepository.save(new Company(null, "DataSphere Systems",
                "Big data analytics and real-time streaming intelligence platforms.",
                "https://datasphere.example.com", "Chennai, India", "jobs@datasphere.com", "+91 44 8901 2345"));

        // 3. Create Students
        // Main Demo Student
        User studentUser1 = userRepository.save(new User(null, "student@placement.com", passwordEncoder.encode("student123"), "Rahul Sharma", "+91 9811223344", Role.STUDENT));
        Student student1 = new Student(null, studentUser1, "National Institute of Technology", "B.Tech", "Computer Science & Engineering", 2026, 8.85, "Bangalore, India", "Java, Spring Boot, MySQL, REST APIs, HTML/CSS, JavaScript, Git");
        student1.setCertifications("Oracle Certified Java SE 17 Professional, AWS Certified Cloud Practitioner");
        student1.setProjects("Student Placement Portal, E-Commerce Microservices Platform, Real-time Chat App");
        student1.setResumeUrl("https://github.com/rahul-sharma/resume");
        student1 = studentRepository.save(student1);

        // Student 2
        User studentUser2 = userRepository.save(new User(null, "ananya.verma@placement.com", passwordEncoder.encode("student123"), "Ananya Verma", "+91 9822334455", Role.STUDENT));
        Student student2 = new Student(null, studentUser2, "National Institute of Technology", "B.Tech", "Information Technology", 2026, 9.15, "Hyderabad, India", "Python, React, Java, Spring Boot, PostgreSQL, Docker");
        student2.setCertifications("Google Cloud Associate Cloud Engineer");
        student2.setProjects("AI Image Classifier, Smart Attendance Management System");
        student2 = studentRepository.save(student2);

        // Student 3
        User studentUser3 = userRepository.save(new User(null, "rohan.patel@placement.com", passwordEncoder.encode("student123"), "Rohan Patel", "+91 9833445566", Role.STUDENT));
        Student student3 = new Student(null, studentUser3, "National Institute of Technology", "B.Tech", "Electronics & Communication", 2026, 7.90, "Pune, India", "Java, C++, SQL, Spring Boot, Embedded IoT");
        student3.setCertifications("Microsoft Certified: Azure Fundamentals");
        student3.setProjects("IoT Smart Agriculture System");
        student3 = studentRepository.save(student3);

        // Student 4
        User studentUser4 = userRepository.save(new User(null, "priya.nair@placement.com", passwordEncoder.encode("student123"), "Priya Nair", "+91 9844556677", Role.STUDENT));
        Student student4 = new Student(null, studentUser4, "National Institute of Technology", "M.Tech", "Computer Science", 2026, 9.40, "Chennai, India", "Java, Spring Cloud, Kafka, Kubernetes, Distributed Systems");
        student4.setCertifications("Certified Kubernetes Application Developer (CKAD)");
        student4.setProjects("High-Throughput Financial Event Processing Engine");
        student4 = studentRepository.save(student4);

        // Student 5
        User studentUser5 = userRepository.save(new User(null, "sneha.reddy@placement.com", passwordEncoder.encode("student123"), "Sneha Reddy", "+91 9855667788", Role.STUDENT));
        Student student5 = new Student(null, studentUser5, "National Institute of Technology", "B.Tech", "Computer Science", 2026, 8.45, "Hyderabad, India", "Full Stack Java, Angular, MySQL, Docker, Linux");
        student5.setCertifications("Full Stack Web Developer Nanodegree");
        student5.setProjects("Hospital OPD & Patient Portal");
        student5 = studentRepository.save(student5);

        // 4. Create Jobs
        Job job1 = jobRepository.save(new Job(null, "Software Developer - Java/Spring", "TechNova Solutions", "Bangalore", "Full-Time", "₹ 12,00,000 - 15,00,000 LPA", 7.5,
                "Java 17, Spring Boot, REST APIs, Hibernate, MySQL, Git",
                "Join our core product team to build high-performance distributed microservices handling millions of transactions daily.",
                LocalDate.now().plusDays(30), 5, "ACTIVE"));

        Job job2 = jobRepository.save(new Job(null, "Cloud Backend Engineer", "CloudCore Technologies", "Hyderabad / Hybrid", "Full-Time", "₹ 14,00,000 - 18,00,000 LPA", 8.0,
                "Java, Spring Cloud, AWS/GCP, Docker, Kubernetes, CI/CD",
                "Looking for dynamic engineers to architect scalable cloud solutions and optimize containerized workflows.",
                LocalDate.now().plusDays(25), 3, "ACTIVE"));

        Job job3 = jobRepository.save(new Job(null, "Full Stack Developer", "InnoSoft Labs", "Pune", "Full-Time", "₹ 10,00,000 - 13,50,000 LPA", 7.0,
                "Java, Spring Boot, JavaScript, HTML5/CSS3, SQL, REST APIs",
                "Design and develop responsive full-stack applications with state-of-the-art UI and robust backend services.",
                LocalDate.now().plusDays(40), 4, "ACTIVE"));

        Job job4 = jobRepository.save(new Job(null, "Associate Data Platform Engineer", "DataSphere Systems", "Chennai", "Full-Time", "₹ 11,00,000 - 14,00,000 LPA", 7.5,
                "Java, Python, SQL, Apache Kafka, Spark, Spring Boot",
                "Develop big data ingest pipelines and analytics microservices for global enterprise clients.",
                LocalDate.now().plusDays(20), 2, "ACTIVE"));

        Job job5 = jobRepository.save(new Job(null, "Systems & DevOps Engineer", "TechNova Solutions", "Bangalore", "Full-Time", "₹ 13,00,000 - 16,00,000 LPA", 7.5,
                "Linux, Java, Shell Scripting, Docker, Jenkins, Terraform",
                "Build automated release pipelines, manage cloud clusters and enhance platform reliability.",
                LocalDate.now().plusDays(15), 3, "ACTIVE"));

        // 5. Create Internships
        Internship intern1 = internshipRepository.save(new Internship(null, "Java Full Stack Developer Intern", "TechNova Solutions", "Bangalore", "6 Months", "₹ 35,000 / month", 7.0,
                "Core Java, Spring Boot, HTML, CSS, JavaScript, SQL",
                "Work directly with senior developers on production microservices, REST API design, and modern web portals with pre-placement offer (PPO) opportunities.",
                LocalDate.now().plusDays(20), 8, "ACTIVE"));

        Internship intern2 = internshipRepository.save(new Internship(null, "Cloud Engineering Intern", "CloudCore Technologies", "Hyderabad", "6 Months", "₹ 40,000 / month", 7.5,
                "Linux, Java/Python, AWS Basics, Docker, Git",
                "Hands-on internship assisting with cloud migrations, infrastructure automation scripts, and serverless architectures.",
                LocalDate.now().plusDays(15), 5, "ACTIVE"));

        Internship intern3 = internshipRepository.save(new Internship(null, "Frontend UI/UX Engineering Intern", "InnoSoft Labs", "Pune", "3 Months", "₹ 25,000 / month", 6.5,
                "HTML5, CSS3, JavaScript, Bootstrap, Responsive Design",
                "Collaborate with UX designers to build clean, responsive, and intuitive web interfaces for our enterprise SaaS suites.",
                LocalDate.now().plusDays(28), 4, "ACTIVE"));

        Internship intern4 = internshipRepository.save(new Internship(null, "Data Analytics Intern", "DataSphere Systems", "Chennai", "6 Months", "₹ 30,000 / month", 7.0,
                "SQL, Python/Java, PowerBI, Database Design",
                "Assist data science teams in data cleaning, SQL query optimization, and building business dashboards.",
                LocalDate.now().plusDays(35), 6, "ACTIVE"));

        Internship intern5 = internshipRepository.save(new Internship(null, "Software QA Automation Intern", "TechNova Solutions", "Bangalore", "3 Months", "₹ 28,000 / month", 6.5,
                "Java, Selenium, REST Assured, JUnit, Postman",
                "Build automated integration and regression test suites for continuous deployment pipelines.",
                LocalDate.now().plusDays(18), 3, "ACTIVE"));

        // 6. Create Applications
        Application app1 = applicationRepository.save(new Application(null, student1, job1, null, "JOB", ApplicationStatus.SHORTLISTED, "Strong resume and solid Java project foundation"));
        Application app2 = applicationRepository.save(new Application(null, student1, null, intern1, "INTERNSHIP", ApplicationStatus.INTERVIEW_SCHEDULED, "Technical round scheduled"));
        Application app3 = applicationRepository.save(new Application(null, student1, job3, null, "JOB", ApplicationStatus.APPLIED, "Awaiting initial screening"));

        Application app4 = applicationRepository.save(new Application(null, student2, job2, null, "JOB", ApplicationStatus.SELECTED, "Exceptional coding test and architecture interview"));
        Application app5 = applicationRepository.save(new Application(null, student4, job2, null, "JOB", ApplicationStatus.SHORTLISTED, "Top M.Tech candidate with Kubernetes knowledge"));
        Application app6 = applicationRepository.save(new Application(null, student5, null, intern3, "INTERNSHIP", ApplicationStatus.SELECTED, "Great frontend portfolio and problem solving skills"));

        // 7. Create Interviews
        Interview interview1 = interviewRepository.save(new Interview(null, student1, app2, "TechNova Solutions",
                "Java Full Stack Developer Intern - Technical Round",
                LocalDate.now().plusDays(3), "10:30 AM IST",
                InterviewMode.ONLINE, "https://meet.google.com/abc-technova-round1",
                InterviewStatus.SCHEDULED, "Topics: Java OOP, Data Structures, Spring Boot Basics, SQL queries."));

        Interview interview2 = interviewRepository.save(new Interview(null, student1, app1, "TechNova Solutions",
                "Software Developer - Final Managerial Round",
                LocalDate.now().plusDays(7), "02:00 PM IST",
                InterviewMode.ONLINE, "https://meet.google.com/tnv-mgr-round2",
                InterviewStatus.SCHEDULED, "Discussion on previous projects and system design."));

        Interview interview3 = interviewRepository.save(new Interview(null, student4, app5, "CloudCore Technologies",
                "Cloud Backend Engineer - System Design Round",
                LocalDate.now().plusDays(4), "11:00 AM IST",
                InterviewMode.OFFLINE, "Auditorium Hall 2, Placement Block, College Campus",
                InterviewStatus.SCHEDULED, "Bring 2 copies of resume and college ID card."));

        // 8. Create Placement Drives
        placementDriveRepository.save(new PlacementDrive(null, "TechNova Solutions", "Graduate Engineer Trainee & SDE-1",
                LocalDate.now().plusDays(10), LocalDate.now().plusDays(7),
                "Main Campus Auditorium & Lab 3", "B.Tech CSE/IT/ECE with CGPA >= 7.0",
                "Java, Spring, Data Structures, Algorithms, SQL", "₹ 12.0 - 15.0 LPA",
                "Comprehensive on-campus hiring drive consisting of Online Assessment, Technical Interviews, and HR Round.",
                "UPCOMING"));

        placementDriveRepository.save(new PlacementDrive(null, "CloudCore Technologies", "Associate Cloud & DevOps Engineer",
                LocalDate.now().plusDays(18), LocalDate.now().plusDays(14),
                "Virtual Drive (Online)", "B.Tech/M.Tech all branches with CGPA >= 7.5",
                "Cloud Fundamentals, Linux, Java/Python, Networking", "₹ 14.0 - 18.0 LPA",
                "Virtual campus recruitment drive with live coding assessment on HackerRank followed by 2 technical interviews.",
                "UPCOMING"));

        placementDriveRepository.save(new PlacementDrive(null, "InnoSoft Labs", "Associate Full Stack Engineer",
                LocalDate.now().plusDays(24), LocalDate.now().plusDays(20),
                "Placement Seminar Hall", "B.Tech CSE/IT with CGPA >= 6.5",
                "Full Stack Web Development, REST APIs, Databases", "₹ 10.0 - 13.5 LPA",
                "Annual product engineering recruitment drive with immediate internship starting in next semester.",
                "UPCOMING"));

        // 9. Create Notifications for Student 1
        notificationRepository.save(new Notification(null, studentUser1,
                "Application Shortlisted!",
                "Your application for Software Developer at TechNova Solutions has been Shortlisted.",
                false, "APPLICATION"));

        notificationRepository.save(new Notification(null, studentUser1,
                "Interview Scheduled",
                "Technical Interview scheduled for Java Full Stack Intern on " + LocalDate.now().plusDays(3) + " at 10:30 AM.",
                false, "INTERVIEW"));

        notificationRepository.save(new Notification(null, studentUser1,
                "New Placement Drive Announced",
                "TechNova Solutions On-Campus Placement Drive will take place on " + LocalDate.now().plusDays(10) + ". Register before deadline.",
                false, "DRIVE"));

        System.out.println(">>> Sample data initialization completed successfully!");
    }

    private void synchronizeAdminAccount() {
        List<User> existingAdmins = userRepository.findByRole(Role.ADMIN);
        if (!existingAdmins.isEmpty()) {
            User admin = existingAdmins.get(0);
            boolean updated = false;

            // 1. Synchronize display name
            if (adminName != null && !adminName.trim().isEmpty() && !adminName.trim().equals(admin.getFullName())) {
                admin.setFullName(adminName.trim());
                updated = true;
            }

            // 2. Synchronize email if changed and target email is not used by another account
            if (adminEmail != null && !adminEmail.trim().isEmpty()) {
                String targetEmail = adminEmail.trim().toLowerCase();
                if (!targetEmail.equalsIgnoreCase(admin.getEmail())) {
                    boolean emailTaken = userRepository.findByEmail(targetEmail)
                            .map(u -> !u.getId().equals(admin.getId()))
                            .orElse(false);
                    if (!emailTaken) {
                        admin.setEmail(targetEmail);
                        updated = true;
                    }
                }
            }

            // 3. Synchronize password if custom password provided and different
            if (adminPassword != null && !adminPassword.isBlank()) {
                if (!passwordEncoder.matches(adminPassword, admin.getPassword())) {
                    admin.setPassword(passwordEncoder.encode(adminPassword));
                    updated = true;
                }
            }

            if (updated) {
                userRepository.save(admin);
                System.out.println(">>> Existing Admin account synchronized safely (Display Name: " + admin.getFullName() + ")");
            }
        }
    }
}
