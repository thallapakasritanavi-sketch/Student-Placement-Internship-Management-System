/**
 * Student Placement & Internship Management System - API Client
 * Hybrid Architecture: Real Spring Boot Backend + In-Browser Vercel Mock Engine Fallback
 */

// -------------------------------------------------------------
// In-Browser Mock Database Engine (Used on Vercel / Static Hosting)
// -------------------------------------------------------------
const MockDB = {
    KEY: 'placement_system_mock_db_v2',

    getInitialData() {
        return {
            users: [
                { id: 1, name: 'Sri Tanavi', email: 'sri', role: 'ADMIN', password: 'admin123', college: 'Placement Cell', branch: 'Placement Officer' },
                { id: 2, name: 'Student Demo', email: 'student@placement.com', role: 'STUDENT', password: 'student123', college: 'National Institute of Technology', degree: 'B.Tech', branch: 'Computer Science & Engineering', cgpa: 8.9, graduationYear: 2026, skills: 'Java, Spring Boot, React, SQL, Git', resumeUrl: 'https://example.com/resume-demo.pdf', certifications: 'AWS Certified Cloud Practitioner, Oracle Certified Java Associate', projects: 'Placement Portal Full-Stack App, Real-Time Chat App' },
                { id: 3, name: 'Ananya Verma', email: 'ananya.verma@placement.com', role: 'STUDENT', password: 'student123', college: 'Indian Institute of Information Technology', degree: 'B.Tech', branch: 'Information Technology', cgpa: 9.1, graduationYear: 2026, skills: 'Python, Machine Learning, Java, Docker, REST APIs', resumeUrl: 'https://example.com/resume-ananya.pdf', certifications: 'Google Cloud Associate Cloud Engineer', projects: 'AI Resume Parser, Smart Recommendation Engine' },
                { id: 4, name: 'Rohan Patel', email: 'rohan.patel@placement.com', role: 'STUDENT', password: 'student123', college: 'Vellore Institute of Technology', degree: 'B.Tech', branch: 'Data Science & AI', cgpa: 8.4, graduationYear: 2026, skills: 'JavaScript, Node.js, SQL, AWS, TailwindCSS', resumeUrl: 'https://example.com/resume-rohan.pdf', certifications: 'Meta Frontend Developer Certificate', projects: 'Campus Event Tracker, E-Commerce Analytics' }
            ],
            jobs: [
                { id: 1, companyName: 'Google', title: 'Software Engineer - Campus 2026', location: 'Bengaluru, India', jobType: 'FULL_TIME', salaryPackage: 2400000, minCgpa: 8.0, description: 'Design, develop, test, deploy, maintain, and enhance mission-critical software systems across Google Cloud and Core infrastructure.', requirements: 'Strong proficiency in Data Structures, Algorithms, Java/C++, and Object-Oriented Design.', applicationDeadline: '2026-12-31', active: true, createdAt: '2026-10-15T09:00:00Z' },
                { id: 2, companyName: 'Microsoft', title: 'Cloud Solutions Engineer', location: 'Hyderabad, India', jobType: 'FULL_TIME', salaryPackage: 2250000, minCgpa: 7.5, description: 'Engineer resilient cloud platforms, developer tools, and scalable microservices on Azure.', requirements: 'Proficiency in Cloud Computing, Spring Boot/Node, Distributed Systems, and RESTful APIs.', applicationDeadline: '2026-11-30', active: true, createdAt: '2026-10-16T10:00:00Z' },
                { id: 3, companyName: 'Amazon', title: 'Frontend Systems Engineer', location: 'Remote / Hybrid', jobType: 'FULL_TIME', salaryPackage: 2000000, minCgpa: 7.0, description: 'Build lightning-fast, highly accessible, customer-centric UI experiences for millions of worldwide users.', requirements: 'Expertise in modern JavaScript/TypeScript, React/Vue, HTML5, CSS3, and web performance optimization.', applicationDeadline: '2026-12-15', active: true, createdAt: '2026-10-17T11:00:00Z' },
                { id: 4, companyName: 'Infosys', title: 'Specialist Programmer (Power Programmer)', location: 'Pune, India', jobType: 'FULL_TIME', salaryPackage: 950000, minCgpa: 6.5, description: 'Develop enterprise digital transformation architectures, microservices, and AI integrations.', requirements: 'Java, Spring Framework, Relational Databases, and Microservices architecture.', applicationDeadline: '2026-11-20', active: true, createdAt: '2026-10-18T12:00:00Z' },
                { id: 5, companyName: 'Tata Consultancy Services', title: 'TCS Digital Innovator', location: 'Chennai, India', jobType: 'FULL_TIME', salaryPackage: 850000, minCgpa: 6.5, description: 'Design next-generation banking, fintech, and retail automation software solutions.', requirements: 'Full stack development skills, Problem Solving, and Database Systems.', applicationDeadline: '2026-10-19T08:00:00Z' }
            ],
            internships: [
                { id: 1, companyName: 'Goldman Sachs', title: 'Summer Technology Analyst', location: 'Bengaluru, India', durationMonths: 6, stipendMonthly: 75000, minCgpa: 7.5, description: 'Work alongside quantitative engineers building algorithmic finance and risk analysis engines.', requirements: 'Data structures, algorithms, Java/Python, and analytical mindset.', applicationDeadline: '2026-12-10', active: true, createdAt: '2026-10-15T09:00:00Z' },
                { id: 2, companyName: 'Cisco', title: 'Network & Cloud Security Intern', location: 'Bengaluru, India', durationMonths: 3, stipendMonthly: 45000, minCgpa: 7.0, description: 'Implement automated network telemetry, cloud routing, and cyberdefense pipelines.', requirements: 'Computer Networking, Linux, Python, and TCP/IP fundamentals.', applicationDeadline: '2026-11-15', active: true, createdAt: '2026-10-16T10:00:00Z' },
                { id: 3, companyName: 'Adobe', title: 'Product Engineering Intern', location: 'Noida, India', durationMonths: 6, stipendMonthly: 60000, minCgpa: 7.5, description: 'Collaborate with the Adobe Creative Cloud engineering team on generative design tools.', requirements: 'JavaScript, WebGL, C++, UI systems.', applicationDeadline: '2026-12-05', active: true, createdAt: '2026-10-17T11:00:00Z' },
                { id: 4, companyName: 'Intel', title: 'Embedded Systems & AI Intern', location: 'Bengaluru, India', durationMonths: 6, stipendMonthly: 50000, minCgpa: 7.0, description: 'Develop edge AI acceleration models and firmware optimization for next-generation silicon.', requirements: 'C/C++, Computer Architecture, Python, PyTorch.', applicationDeadline: '2026-11-28', active: true, createdAt: '2026-10-18T12:00:00Z' }
            ],
            applications: [
                { id: 1, studentId: 2, studentName: 'Student Demo', studentEmail: 'student@placement.com', jobId: 1, jobTitle: 'Software Engineer - Campus 2026', companyName: 'Google', appliedAt: '2026-10-20T10:00:00Z', status: 'SHORTLISTED', notes: 'Shortlisted for technical assessment' },
                { id: 2, studentId: 2, studentName: 'Student Demo', studentEmail: 'student@placement.com', jobId: 2, jobTitle: 'Cloud Solutions Engineer', companyName: 'Microsoft', appliedAt: '2026-10-22T14:30:00Z', status: 'INTERVIEW_SCHEDULED', notes: 'Technical Round 1 scheduled' },
                { id: 3, studentId: 3, studentName: 'Ananya Verma', studentEmail: 'ananya.verma@placement.com', jobId: 1, jobTitle: 'Software Engineer - Campus 2026', companyName: 'Google', appliedAt: '2026-10-21T09:15:00Z', status: 'SELECTED', notes: 'Offer letter extended!' }
            ],
            placementDrives: [
                { id: 1, companyName: 'Google India', title: 'Google University Recruitment Drive 2026', driveDate: '2026-11-15', location: 'Main Campus Auditorium & Online', eligibleBranches: 'CSE, IT, ECE', minCgpa: 8.0, description: 'Full-day recruitment drive including coding rounds and technical interviews.' },
                { id: 2, companyName: 'Microsoft IDC', title: 'Microsoft Inspire Campus Drive', driveDate: '2026-11-22', location: 'Virtual Drive via Microsoft Teams', eligibleBranches: 'All Engineering Branches', minCgpa: 7.5, description: 'Virtual coding challenge followed by system design interviews.' }
            ],
            interviews: [
                { id: 1, studentId: 2, applicationId: 2, studentName: 'Student Demo', companyName: 'Microsoft', roundName: 'Technical Round 1 (Algorithms & Systems)', interviewDate: '2026-11-05', interviewTime: '11:00 AM', mode: 'ONLINE', meetLink: 'https://meet.google.com/abc-defg-hij', instructions: 'Please join 5 minutes early with your code editor ready.' }
            ],
            notifications: [
                { id: 1, userId: 2, title: 'Application Shortlisted', message: 'Congratulations! Google has shortlisted your application for Software Engineer.', isRead: false, createdAt: '2026-10-21T11:00:00Z' },
                { id: 2, userId: 2, title: 'Interview Scheduled', message: 'Microsoft has scheduled Technical Round 1 on 05 Nov 2026 at 11:00 AM.', isRead: false, createdAt: '2026-10-23T15:30:00Z' }
            ]
        };
    },

    load() {
        try {
            const raw = localStorage.getItem(this.KEY);
            if (!raw) {
                const initial = this.getInitialData();
                this.save(initial);
                return initial;
            }
            return JSON.parse(raw);
        } catch (e) {
            return this.getInitialData();
        }
    },

    save(data) {
        try {
            localStorage.setItem(this.KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('LocalStorage save failed:', e);
        }
    },

    handle(endpoint, options = {}) {
        const db = this.load();
        const method = (options.method || 'GET').toUpperCase();
        const body = options.body ? JSON.parse(options.body) : {};
        const urlParts = endpoint.split('?');
        const path = urlParts[0];
        const params = new URLSearchParams(urlParts[1] || '');

        // 1. Auth: Login
        if (path === '/auth/login' && method === 'POST') {
            const user = db.users.find(u => 
                (u.email.toLowerCase() === body.email.toLowerCase() || (u.role === 'ADMIN' && body.email.toLowerCase() === 'sri'))
            );
            if (!user) {
                return { success: false, message: 'Invalid credentials. For Admin use sri / admin123, for Student use student@placement.com / student123' };
            }
            const { password, ...safeUser } = user;
            return { success: true, message: 'Login successful', data: safeUser };
        }

        // 2. Auth: Register
        if (path === '/auth/register' && method === 'POST') {
            const existing = db.users.find(u => u.email.toLowerCase() === body.email.toLowerCase());
            if (existing) {
                return { success: false, message: 'An account with this email already exists.' };
            }
            const newUser = {
                id: Date.now(),
                name: body.name,
                email: body.email,
                role: body.role || 'STUDENT',
                college: body.college || '',
                degree: body.degree || '',
                branch: body.branch || '',
                cgpa: parseFloat(body.cgpa) || 0.0,
                graduationYear: parseInt(body.graduationYear) || 2026,
                skills: body.skills || '',
                password: body.password
            };
            db.users.push(newUser);
            this.save(db);
            const { password, ...safeUser } = newUser;
            return { success: true, message: 'Account created successfully', data: safeUser };
        }

        // 3. Auth: Logout
        if (path === '/auth/logout') {
            return { success: true, message: 'Logged out successfully' };
        }

        // 4. Students
        if (path === '/students' && method === 'GET') {
            const students = db.users.filter(u => u.role === 'STUDENT').map(({ password, ...u }) => u);
            return { success: true, data: students };
        }

        const studentProfileMatch = path.match(/^\/students\/(\d+)$/);
        if (studentProfileMatch) {
            const id = parseInt(studentProfileMatch[1]);
            const studentIdx = db.users.findIndex(u => u.id === id);
            if (studentIdx === -1) return { success: false, message: 'Student not found' };

            if (method === 'PUT') {
                db.users[studentIdx] = { ...db.users[studentIdx], ...body };
                this.save(db);
                const { password, ...safe } = db.users[studentIdx];
                return { success: true, message: 'Profile updated successfully', data: safe };
            }
            const { password, ...safe } = db.users[studentIdx];
            return { success: true, data: safe };
        }

        const studentStatsMatch = path.match(/^\/students\/(\d+)\/stats$/);
        if (studentStatsMatch) {
            const id = parseInt(studentStatsMatch[1]);
            const userApps = db.applications.filter(a => a.studentId === id);
            return {
                success: true,
                data: {
                    totalApplications: userApps.length,
                    shortlistedCount: userApps.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length,
                    isPlaced: userApps.some(a => a.status === 'SELECTED'),
                    activeJobs: db.jobs.filter(j => j.active).length,
                    activeInternships: db.internships.filter(i => i.active).length
                }
            };
        }

        // 5. Jobs
        if ((path === '/jobs' || path === '/jobs/search') && method === 'GET') {
            const studentId = parseInt(params.get('studentId') || '0');
            const kw = (params.get('keyword') || '').toLowerCase();
            const loc = (params.get('location') || '').toLowerCase();
            const jt = params.get('jobType');

            let filtered = db.jobs.filter(j => j.active);
            if (kw) {
                filtered = filtered.filter(j => j.title.toLowerCase().includes(kw) || j.companyName.toLowerCase().includes(kw) || (j.requirements && j.requirements.toLowerCase().includes(kw)));
            }
            if (loc) {
                filtered = filtered.filter(j => j.location.toLowerCase().includes(loc));
            }
            if (jt) {
                filtered = filtered.filter(j => j.jobType === jt);
            }

            const res = filtered.map(j => ({
                ...j,
                hasApplied: studentId > 0 && db.applications.some(a => a.studentId === studentId && a.jobId === j.id)
            }));
            return { success: true, data: res };
        }

        if (path === '/jobs' && method === 'POST') {
            const newJob = { id: Date.now(), active: true, createdAt: new Date().toISOString(), ...body };
            db.jobs.unshift(newJob);
            this.save(db);
            return { success: true, message: 'Job created successfully', data: newJob };
        }

        const jobDetailMatch = path.match(/^\/jobs\/(\d+)$/);
        if (jobDetailMatch) {
            const id = parseInt(jobDetailMatch[1]);
            if (method === 'DELETE') {
                db.jobs = db.jobs.filter(j => j.id !== id);
                this.save(db);
                return { success: true, message: 'Job deleted successfully' };
            }
            if (method === 'PUT') {
                const idx = db.jobs.findIndex(j => j.id === id);
                if (idx !== -1) {
                    db.jobs[idx] = { ...db.jobs[idx], ...body };
                    this.save(db);
                    return { success: true, message: 'Job updated', data: db.jobs[idx] };
                }
            }
        }

        // 6. Internships
        if ((path === '/internships' || path === '/internships/search') && method === 'GET') {
            const studentId = parseInt(params.get('studentId') || '0');
            const kw = (params.get('keyword') || '').toLowerCase();
            const loc = (params.get('location') || '').toLowerCase();

            let filtered = db.internships.filter(i => i.active);
            if (kw) {
                filtered = filtered.filter(i => i.title.toLowerCase().includes(kw) || i.companyName.toLowerCase().includes(kw));
            }
            if (loc) {
                filtered = filtered.filter(i => i.location.toLowerCase().includes(loc));
            }

            const res = filtered.map(i => ({
                ...i,
                hasApplied: studentId > 0 && db.applications.some(a => a.studentId === studentId && a.internshipId === i.id)
            }));
            return { success: true, data: res };
        }

        if (path === '/internships' && method === 'POST') {
            const newInternship = { id: Date.now(), active: true, createdAt: new Date().toISOString(), ...body };
            db.internships.unshift(newInternship);
            this.save(db);
            return { success: true, message: 'Internship posted successfully', data: newInternship };
        }

        // 7. Applications
        if (path === '/applications' && method === 'GET') {
            return { success: true, data: db.applications };
        }

        const studentAppsMatch = path.match(/^\/applications\/student\/(\d+)$/);
        if (studentAppsMatch) {
            const sid = parseInt(studentAppsMatch[1]);
            return { success: true, data: db.applications.filter(a => a.studentId === sid) };
        }

        if (path === '/applications' && method === 'POST') {
            const student = db.users.find(u => u.id === body.studentId);
            const job = body.jobId ? db.jobs.find(j => j.id === body.jobId) : null;
            const internship = body.internshipId ? db.internships.find(i => i.id === body.internshipId) : null;

            const newApp = {
                id: Date.now(),
                studentId: body.studentId,
                studentName: student ? student.name : 'Student',
                studentEmail: student ? student.email : '',
                jobId: body.jobId || null,
                jobTitle: job ? job.title : (internship ? internship.title : 'Position'),
                companyName: job ? job.companyName : (internship ? internship.companyName : 'Company'),
                internshipId: body.internshipId || null,
                appliedAt: new Date().toISOString(),
                status: 'APPLIED',
                notes: body.notes || 'Application received'
            };

            db.applications.unshift(newApp);

            // Add notification
            db.notifications.unshift({
                id: Date.now() + 1,
                userId: body.studentId,
                title: 'Application Submitted',
                message: `Your application for ${newApp.jobTitle} at ${newApp.companyName} has been submitted successfully!`,
                isRead: false,
                createdAt: new Date().toISOString()
            });

            this.save(db);
            return { success: true, message: 'Application submitted successfully!', data: newApp };
        }

        const appStatusMatch = path.match(/^\/applications\/(\d+)\/status$/);
        if (appStatusMatch && method === 'PUT') {
            const aid = parseInt(appStatusMatch[1]);
            const appIdx = db.applications.findIndex(a => a.id === aid);
            if (appIdx !== -1) {
                db.applications[appIdx].status = body.status;
                if (body.notes) db.applications[appIdx].notes = body.notes;

                // Send notification to the student
                db.notifications.unshift({
                    id: Date.now(),
                    userId: db.applications[appIdx].studentId,
                    title: `Application Status Updated: ${body.status}`,
                    message: `Your application for ${db.applications[appIdx].jobTitle} has been updated to "${body.status}".`,
                    isRead: false,
                    createdAt: new Date().toISOString()
                });

                this.save(db);
                return { success: true, message: 'Status updated successfully', data: db.applications[appIdx] };
            }
        }

        // 8. Placement Drives
        if (path === '/placement-drives' && method === 'GET') {
            return { success: true, data: db.placementDrives };
        }
        if (path === '/placement-drives' && method === 'POST') {
            const newDrive = { id: Date.now(), ...body };
            db.placementDrives.unshift(newDrive);
            this.save(db);
            return { success: true, message: 'Placement drive added', data: newDrive };
        }

        // 9. Interviews
        if (path === '/interviews' && method === 'GET') {
            return { success: true, data: db.interviews };
        }
        const studentInterviewsMatch = path.match(/^\/interviews\/student\/(\d+)$/);
        if (studentInterviewsMatch) {
            const sid = parseInt(studentInterviewsMatch[1]);
            return { success: true, data: db.interviews.filter(i => i.studentId === sid) };
        }
        if (path === '/interviews' && method === 'POST') {
            const newInterview = { id: Date.now(), ...body };
            db.interviews.unshift(newInterview);

            // Add notification
            db.notifications.unshift({
                id: Date.now() + 1,
                userId: body.studentId,
                title: 'Interview Scheduled',
                message: `You have an interview scheduled for ${body.companyName || 'your application'} on ${body.interviewDate} at ${body.interviewTime}.`,
                isRead: false,
                createdAt: new Date().toISOString()
            });

            this.save(db);
            return { success: true, message: 'Interview scheduled successfully', data: newInterview };
        }

        // 10. Notifications
        const userNotifsMatch = path.match(/^\/notifications\/user\/(\d+)$/);
        if (userNotifsMatch) {
            const uid = parseInt(userNotifsMatch[1]);
            return { success: true, data: db.notifications.filter(n => n.userId === uid) };
        }
        const readNotifMatch = path.match(/^\/notifications\/(\d+)\/read$/);
        if (readNotifMatch && method === 'PUT') {
            const nid = parseInt(readNotifMatch[1]);
            const notif = db.notifications.find(n => n.id === nid);
            if (notif) notif.isRead = true;
            this.save(db);
            return { success: true, message: 'Notification marked as read' };
        }
        const readAllNotifsMatch = path.match(/^\/notifications\/user\/(\d+)\/read-all$/);
        if (readAllNotifsMatch && method === 'PUT') {
            const uid = parseInt(readAllNotifsMatch[1]);
            db.notifications.filter(n => n.userId === uid).forEach(n => n.isRead = true);
            this.save(db);
            return { success: true, message: 'All notifications marked as read' };
        }

        // 11. Admin Stats
        if (path === '/admin/stats') {
            const uniqueCompanies = new Set();
            db.jobs.forEach(j => uniqueCompanies.add(j.companyName));
            db.internships.forEach(i => uniqueCompanies.add(i.companyName));

            return {
                success: true,
                data: {
                    totalStudents: db.users.filter(u => u.role === 'STUDENT').length,
                    totalJobs: db.jobs.filter(j => j.active).length,
                    totalInternships: db.internships.filter(i => i.active).length,
                    totalApplications: db.applications.length,
                    totalSelected: db.applications.filter(a => a.status === 'SELECTED').length,
                    totalCompanies: uniqueCompanies.size
                }
            };
        }

        return { success: false, message: `Endpoint ${method} ${path} not supported in mock engine` };
    }
};

// -------------------------------------------------------------
// Unified API Client
// -------------------------------------------------------------
const API = {
    baseUrl: '/api',

    getUser() {
        try {
            return JSON.parse(localStorage.getItem('placement_user')) || null;
        } catch (e) {
            return null;
        }
    },

    setUser(user) {
        localStorage.setItem('placement_user', JSON.stringify(user));
    },

    async logout() {
        try {
            await fetch(this.baseUrl + '/auth/logout', { method: 'POST', credentials: 'include' });
        } catch (e) {
            // Ignore error if server down or on Vercel
        }
        MockDB.handle('/auth/logout');
        localStorage.removeItem('placement_user');
        window.location.href = '/login.html';
    },

    requireRole(role) {
        const user = this.getUser();
        if (!user) {
            window.location.href = '/login.html';
            return null;
        }
        if (role && user.role !== role) {
            if (user.role === 'ADMIN') window.location.href = '/admin-dashboard.html';
            else if (user.role === 'STUDENT') window.location.href = '/student-dashboard.html';
            else if (user.role === 'RECRUITER') window.location.href = '/recruiter-dashboard.html';
            else window.location.href = '/login.html';
            return null;
        }
        return user;
    },

    async request(endpoint, options = {}) {
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const config = {
            credentials: 'include',
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        };

        // If hosted on Vercel or GitHub Pages, use the lightning-fast client MockDB engine
        const isVercelOrStatic = window.location.hostname.endsWith('vercel.app') ||
                                 window.location.hostname.endsWith('github.io') ||
                                 window.location.protocol === 'file:';

        if (isVercelOrStatic) {
            return MockDB.handle(endpoint, options);
        }

        try {
            const response = await fetch(this.baseUrl + endpoint, config);
            const data = await response.json().catch(() => ({ success: false, message: 'Invalid JSON response from server' }));

            if (!response.ok) {
                // If the backend returned 404/503 (e.g. backend offline), seamlessly fallback to MockDB
                if (response.status === 404 || response.status === 503) {
                    return MockDB.handle(endpoint, options);
                }
                const msg = data.message || (data.data && typeof data.data === 'object' ? Object.values(data.data).join(', ') : 'Request failed with status ' + response.status);
                throw new Error(msg);
            }
            return data;
        } catch (err) {
            // Network failure or backend offline - fallback to MockDB
            console.info('Backend unreachable, using in-browser mock engine:', endpoint);
            try {
                return MockDB.handle(endpoint, options);
            } catch (mockErr) {
                this.showToast(err.message || 'Network error occurred', 'danger');
                throw err;
            }
        }
    },

    showToast(message, type = 'primary') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }

        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-bg-${type} border-0 show mb-2 shadow-lg`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');

        toastEl.innerHTML = `
            <div class="d-flex">
                <div class="toast-body fw-semibold">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        container.appendChild(toastEl);
        setTimeout(() => {
            toastEl.remove();
        }, 4000);
    },

    // Auth
    async login(email, password) {
        const res = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (res.success && res.data) {
            this.setUser(res.data);
        }
        return res;
    },

    async register(data) {
        const res = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (res.success && res.data) {
            this.setUser(res.data);
        }
        return res;
    },

    // Student
    async getStudentProfile(studentId) {
        return await this.request(`/students/${studentId}`);
    },

    async updateStudentProfile(studentId, profileData) {
        return await this.request(`/students/${studentId}`, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },

    async getStudentStats(studentId) {
        return await this.request(`/students/${studentId}/stats`);
    },

    async getAllStudents() {
        return await this.request('/students');
    },

    // Jobs
    async getJobs(studentId) {
        const query = studentId ? `?studentId=${studentId}` : '';
        return await this.request(`/jobs${query}`);
    },

    async searchJobs(keyword, location, jobType, studentId) {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (location) params.append('location', location);
        if (jobType) params.append('jobType', jobType);
        if (studentId) params.append('studentId', studentId);
        return await this.request(`/jobs/search?${params.toString()}`);
    },

    async createJob(jobData) {
        return await this.request('/jobs', {
            method: 'POST',
            body: JSON.stringify(jobData)
        });
    },

    async updateJob(id, jobData) {
        return await this.request(`/jobs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(jobData)
        });
    },

    async deleteJob(id) {
        return await this.request(`/jobs/${id}`, {
            method: 'DELETE'
        });
    },

    // Internships
    async getInternships(studentId) {
        const query = studentId ? `?studentId=${studentId}` : '';
        return await this.request(`/internships${query}`);
    },

    async searchInternships(keyword, location, studentId) {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (location) params.append('location', location);
        if (studentId) params.append('studentId', studentId);
        return await this.request(`/internships/search?${params.toString()}`);
    },

    async createInternship(internshipData) {
        return await this.request('/internships', {
            method: 'POST',
            body: JSON.stringify(internshipData)
        });
    },

    async updateInternship(id, internshipData) {
        return await this.request(`/internships/${id}`, {
            method: 'PUT',
            body: JSON.stringify(internshipData)
        });
    },

    async deleteInternship(id) {
        return await this.request(`/internships/${id}`, {
            method: 'DELETE'
        });
    },

    // Applications
    async apply(studentId, jobId, internshipId, notes) {
        return await this.request('/applications', {
            method: 'POST',
            body: JSON.stringify({ studentId, jobId, internshipId, notes })
        });
    },

    async getStudentApplications(studentId) {
        return await this.request(`/applications/student/${studentId}`);
    },

    async getAllApplications() {
        return await this.request('/applications');
    },

    async updateApplicationStatus(id, status, notes) {
        return await this.request(`/applications/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, notes })
        });
    },

    // Placement Drives
    async getPlacementDrives() {
        return await this.request('/placement-drives');
    },

    async createPlacementDrive(driveData) {
        return await this.request('/placement-drives', {
            method: 'POST',
            body: JSON.stringify(driveData)
        });
    },

    async deletePlacementDrive(id) {
        return await this.request(`/placement-drives/${id}`, {
            method: 'DELETE'
        });
    },

    // Interviews
    async getStudentInterviews(studentId) {
        return await this.request(`/interviews/student/${studentId}`);
    },

    async getAllInterviews() {
        return await this.request('/interviews');
    },

    async scheduleInterview(interviewData) {
        return await this.request('/interviews', {
            method: 'POST',
            body: JSON.stringify(interviewData)
        });
    },

    async deleteInterview(id) {
        return await this.request(`/interviews/${id}`, {
            method: 'DELETE'
        });
    },

    // Notifications
    async getNotifications(userId) {
        return await this.request(`/notifications/user/${userId}`);
    },

    async markNotificationRead(id) {
        return await this.request(`/notifications/${id}/read`, { method: 'PUT' });
    },

    async markAllNotificationsRead(userId) {
        return await this.request(`/notifications/user/${userId}/read-all`, { method: 'PUT' });
    },

    // Admin
    async getAdminStats() {
        return await this.request('/admin/stats');
    }
};
