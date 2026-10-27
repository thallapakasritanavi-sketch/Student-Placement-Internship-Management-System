import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, Job, Internship, Application, PlacementDrive, Interview, NotificationItem, ApplicationStatus } from '../types';

const STORAGE_KEY = 'spims_mock_store_v1';

// Initial default synthetic data
const initialData = {
  profiles: [
    {
      id: 'admin-sri',
      email: 'sri@placement.com',
      role: 'ADMIN',
      fullName: 'Sri Tanavi',
      phone: '+91 98765 43210',
      college: 'Placement Cell',
      branch: 'Placement Coordinator',
      createdAt: '2026-10-01T00:00:00Z'
    },
    {
      id: 'student-demo',
      email: 'student@placement.com',
      role: 'STUDENT',
      fullName: 'Student Demo',
      phone: '+91 91234 56789',
      college: 'National Institute of Technology',
      degree: 'B.Tech',
      branch: 'Computer Science & Engineering',
      cgpa: 8.85,
      graduationYear: 2026,
      skills: 'Java, Spring Boot, React, TypeScript, SQL, Git, Docker',
      resumeUrl: 'https://example.com/resumes/student-demo.pdf',
      certifications: 'AWS Certified Cloud Practitioner, Oracle Certified Java Associate',
      projects: 'Placement Portal Full-Stack App, Real-Time Distributed Chat',
      createdAt: '2026-10-02T00:00:00Z'
    },
    {
      id: 'student-ananya',
      email: 'ananya.verma@placement.com',
      role: 'STUDENT',
      fullName: 'Ananya Verma',
      phone: '+91 98220 11223',
      college: 'Indian Institute of Information Technology',
      degree: 'B.Tech',
      branch: 'Information Technology',
      cgpa: 9.15,
      graduationYear: 2026,
      skills: 'Python, PyTorch, React, REST APIs, Microservices, Cloud Security',
      resumeUrl: 'https://example.com/resumes/ananya-verma.pdf',
      certifications: 'Google Cloud Associate Cloud Engineer',
      projects: 'AI Resume Parser, Smart Recommendation Engine',
      createdAt: '2026-10-03T00:00:00Z'
    },
    {
      id: 'recruiter-google',
      email: 'recruiter@google.com',
      role: 'RECRUITER',
      fullName: 'Google Campus Recruiter',
      companyName: 'Google',
      phone: '+91 80 6789 0000',
      createdAt: '2026-10-04T00:00:00Z'
    }
  ] as UserProfile[],

  jobs: [
    {
      id: 1,
      companyName: 'Google',
      title: 'Software Engineer - Campus 2026',
      location: 'Bengaluru, India (Hybrid)',
      jobType: 'FULL_TIME',
      salaryPackage: 2400000,
      minCgpa: 8.0,
      description: 'Design, develop, test, deploy, maintain, and enhance mission-critical software systems across Google Cloud and Core infrastructure.',
      requirements: 'Strong proficiency in Data Structures, Algorithms, TypeScript/Java/C++, and Distributed Systems.',
      deadline: '2026-12-31',
      active: true,
      postedBy: 'recruiter-google',
      createdAt: '2026-10-15T09:00:00Z'
    },
    {
      id: 2,
      companyName: 'Microsoft',
      title: 'Cloud Solutions Engineer',
      location: 'Hyderabad, India',
      jobType: 'FULL_TIME',
      salaryPackage: 2250000,
      minCgpa: 7.5,
      description: 'Engineer resilient cloud platforms, developer tools, and scalable microservices on Azure.',
      requirements: 'Proficiency in Cloud Computing, Spring Boot/Node, Distributed Systems, and RESTful APIs.',
      deadline: '2026-11-30',
      active: true,
      postedBy: 'admin-sri',
      createdAt: '2026-10-16T10:00:00Z'
    },
    {
      id: 3,
      companyName: 'Amazon',
      title: 'Frontend Systems Engineer',
      location: 'Bengaluru / Remote',
      jobType: 'FULL_TIME',
      salaryPackage: 2000000,
      minCgpa: 7.0,
      description: 'Build lightning-fast, highly accessible, customer-centric UI experiences for millions of worldwide users.',
      requirements: 'Expertise in modern JavaScript/TypeScript, React/Vue, Tailwind CSS, and web performance optimization.',
      deadline: '2026-12-15',
      active: true,
      postedBy: 'admin-sri',
      createdAt: '2026-10-17T11:00:00Z'
    },
    {
      id: 4,
      companyName: 'Infosys',
      title: 'Specialist Programmer (Power Programmer)',
      location: 'Pune / Chennai, India',
      jobType: 'FULL_TIME',
      salaryPackage: 950000,
      minCgpa: 6.5,
      description: 'Develop enterprise digital transformation architectures, microservices, and AI integrations.',
      requirements: 'Proficiency in full-stack web architectures, Relational Databases, and Microservices.',
      deadline: '2026-11-20',
      active: true,
      postedBy: 'admin-sri',
      createdAt: '2026-10-18T12:00:00Z'
    }
  ] as Job[],

  internships: [
    {
      id: 1,
      companyName: 'Goldman Sachs',
      title: 'Summer Technology Analyst',
      location: 'Bengaluru, India',
      durationMonths: 6,
      stipendMonthly: 75000,
      minCgpa: 7.5,
      description: 'Work alongside quantitative engineers building algorithmic finance and risk analysis engines.',
      requirements: 'Data structures, algorithms, Java/Python, and analytical problem-solving.',
      deadline: '2026-12-10',
      active: true,
      postedBy: 'admin-sri',
      createdAt: '2026-10-15T09:00:00Z'
    },
    {
      id: 2,
      companyName: 'Cisco',
      title: 'Network & Cloud Security Intern',
      location: 'Bengaluru, India',
      durationMonths: 3,
      stipendMonthly: 45000,
      minCgpa: 7.0,
      description: 'Implement automated network telemetry, cloud routing, and cyberdefense pipelines.',
      requirements: 'Computer Networking, Linux, Python, and TCP/IP fundamentals.',
      deadline: '2026-11-15',
      active: true,
      postedBy: 'admin-sri',
      createdAt: '2026-10-16T10:00:00Z'
    },
    {
      id: 3,
      companyName: 'Adobe',
      title: 'Product Engineering Intern',
      location: 'Noida, India',
      durationMonths: 6,
      stipendMonthly: 60000,
      minCgpa: 7.5,
      description: 'Collaborate with the Adobe Creative Cloud engineering team on generative design tools.',
      requirements: 'JavaScript, WebGL, C++, and interactive UI systems.',
      deadline: '2026-12-05',
      active: true,
      postedBy: 'admin-sri',
      createdAt: '2026-10-17T11:00:00Z'
    }
  ] as Internship[],

  applications: [
    {
      id: 1,
      studentId: 'student-demo',
      studentName: 'Student Demo',
      studentEmail: 'student@placement.com',
      studentCgpa: 8.85,
      studentBranch: 'Computer Science & Engineering',
      studentResumeUrl: 'https://example.com/resumes/student-demo.pdf',
      jobId: 1,
      jobTitle: 'Software Engineer - Campus 2026',
      companyName: 'Google',
      type: 'JOB',
      status: 'SHORTLISTED',
      notes: 'Shortlisted for Online Assessment',
      appliedAt: '2026-10-20T10:00:00Z'
    },
    {
      id: 2,
      studentId: 'student-demo',
      studentName: 'Student Demo',
      studentEmail: 'student@placement.com',
      studentCgpa: 8.85,
      studentBranch: 'Computer Science & Engineering',
      studentResumeUrl: 'https://example.com/resumes/student-demo.pdf',
      jobId: 2,
      jobTitle: 'Cloud Solutions Engineer',
      companyName: 'Microsoft',
      type: 'JOB',
      status: 'INTERVIEW_SCHEDULED',
      notes: 'Technical Round 1 scheduled for Nov 5',
      appliedAt: '2026-10-22T14:30:00Z'
    },
    {
      id: 3,
      studentId: 'student-ananya',
      studentName: 'Ananya Verma',
      studentEmail: 'ananya.verma@placement.com',
      studentCgpa: 9.15,
      studentBranch: 'Information Technology',
      studentResumeUrl: 'https://example.com/resumes/ananya-verma.pdf',
      jobId: 1,
      jobTitle: 'Software Engineer - Campus 2026',
      companyName: 'Google',
      type: 'JOB',
      status: 'SELECTED',
      notes: 'Official Offer letter extended!',
      appliedAt: '2026-10-21T09:15:00Z'
    }
  ] as Application[],

  placementDrives: [
    {
      id: 1,
      companyName: 'Google India',
      title: 'Google University Recruitment Drive 2026',
      driveDate: '2026-11-15',
      location: 'Main Campus Auditorium & Online Assessment',
      eligibleBranches: 'CSE, IT, ECE',
      minCgpa: 8.0,
      description: 'Comprehensive hiring drive covering Coding Test, Technical Rounds, and Leadership Interview.'
    },
    {
      id: 2,
      companyName: 'Microsoft IDC',
      title: 'Microsoft Inspire Campus Drive',
      driveDate: '2026-11-22',
      location: 'Virtual Drive via Microsoft Teams',
      eligibleBranches: 'All Engineering Branches',
      minCgpa: 7.5,
      description: 'Online coding challenge followed by system architecture & coding interviews.'
    }
  ] as PlacementDrive[],

  interviews: [
    {
      id: 1,
      studentId: 'student-demo',
      studentName: 'Student Demo',
      applicationId: 2,
      companyName: 'Microsoft',
      roundName: 'Technical Round 1 (Algorithms & Cloud Concepts)',
      interviewDate: '2026-11-05',
      interviewTime: '11:00 AM IST',
      mode: 'ONLINE',
      meetLink: 'https://teams.microsoft.com/l/meetup-join/demo-meeting',
      instructions: 'Please join 5 minutes early with your code editor ready and valid student ID.'
    }
  ] as Interview[],

  notifications: [
    {
      id: 1,
      userId: 'student-demo',
      title: 'Application Shortlisted',
      message: 'Congratulations! Google has shortlisted your application for Software Engineer.',
      isRead: false,
      createdAt: '2026-10-21T11:00:00Z'
    },
    {
      id: 2,
      userId: 'student-demo',
      title: 'Interview Scheduled',
      message: 'Microsoft has scheduled Technical Round 1 for 05 Nov 2026 at 11:00 AM IST.',
      isRead: false,
      createdAt: '2026-10-23T15:30:00Z'
    }
  ] as NotificationItem[]
};

function getLocalStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(raw);
  } catch {
    return initialData;
  }
}

function saveLocalStore(data: typeof initialData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to local store:', err);
  }
}

export const api = {
  // Profiles
  async getProfile(id: string): Promise<UserProfile | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
      if (!error && data) return data as UserProfile;
    }
    const store = getLocalStore();
    return store.profiles.find((p: UserProfile) => p.id === id) || null;
  },

  async getAllProfiles(): Promise<UserProfile[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as UserProfile[];
    }
    return getLocalStore().profiles;
  },

  async updateProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as UserProfile;
    }
    const store = getLocalStore();
    const idx = store.profiles.findIndex((p: UserProfile) => p.id === id);
    if (idx !== -1) {
      store.profiles[idx] = { ...store.profiles[idx], ...updates };
      saveLocalStore(store);
      return store.profiles[idx];
    }
    throw new Error('Profile not found');
  },

  // Jobs
  async getJobs(): Promise<Job[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('jobs').select('*').eq('active', true).order('created_at', { ascending: false });
      if (!error && data) return data as Job[];
    }
    return getLocalStore().jobs.filter((j: Job) => j.active);
  },

  async getAllJobs(): Promise<Job[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Job[];
    }
    return getLocalStore().jobs;
  },

  async createJob(jobData: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('jobs').insert([jobData]).select().single();
      if (!error && data) return data as Job;
    }
    const store = getLocalStore();
    const newJob: Job = {
      ...jobData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    store.jobs.unshift(newJob);
    saveLocalStore(store);
    return newJob;
  },

  async toggleJobActive(id: number, active: boolean): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('jobs').update({ active }).eq('id', id);
      return;
    }
    const store = getLocalStore();
    const job = store.jobs.find((j: Job) => j.id === id);
    if (job) {
      job.active = active;
      saveLocalStore(store);
    }
  },

  // Internships
  async getInternships(): Promise<Internship[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('internships').select('*').eq('active', true).order('created_at', { ascending: false });
      if (!error && data) return data as Internship[];
    }
    return getLocalStore().internships.filter((i: Internship) => i.active);
  },

  async getAllInternships(): Promise<Internship[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('internships').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Internship[];
    }
    return getLocalStore().internships;
  },

  async createInternship(internData: Omit<Internship, 'id' | 'createdAt'>): Promise<Internship> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('internships').insert([internData]).select().single();
      if (!error && data) return data as Internship;
    }
    const store = getLocalStore();
    const newIntern: Internship = {
      ...internData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    store.internships.unshift(newIntern);
    saveLocalStore(store);
    return newIntern;
  },

  // Applications
  async getApplications(): Promise<Application[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('applications').select('*').order('applied_at', { ascending: false });
      if (!error && data) return data as Application[];
    }
    return getLocalStore().applications;
  },

  async getStudentApplications(studentId: string): Promise<Application[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('applications').select('*').eq('student_id', studentId).order('applied_at', { ascending: false });
      if (!error && data) return data as Application[];
    }
    const store = getLocalStore();
    return store.applications.filter((a: Application) => a.studentId === studentId);
  },

  async apply(applicationData: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    studentCgpa?: number;
    studentBranch?: string;
    studentResumeUrl?: string;
    jobId?: number;
    internshipId?: number;
    jobTitle: string;
    companyName: string;
    type: 'JOB' | 'INTERNSHIP';
  }): Promise<Application> {
    const store = getLocalStore();
    
    // Check duplicate
    const exists = store.applications.some((a: Application) => 
      a.studentId === applicationData.studentId && 
      ((applicationData.jobId && a.jobId === applicationData.jobId) || 
       (applicationData.internshipId && a.internshipId === applicationData.internshipId))
    );

    if (exists) {
      throw new Error('You have already applied for this opening.');
    }

    const newApp: Application = {
      id: Date.now(),
      ...applicationData,
      status: 'APPLIED',
      appliedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('applications').insert([newApp]);
      } catch (e) {
        console.warn('Supabase insert failed, stored in local cache', e);
      }
    }

    store.applications.unshift(newApp);
    saveLocalStore(store);

    // Create confirmation notification
    await api.createNotification({
      userId: applicationData.studentId,
      title: 'Application Submitted',
      message: `Your application for ${applicationData.jobTitle} at ${applicationData.companyName} was successfully submitted.`
    });

    return newApp;
  },

  async updateApplicationStatus(id: number, status: ApplicationStatus, notes?: string): Promise<Application> {
    const store = getLocalStore();
    const app = store.applications.find((a: Application) => a.id === id);
    if (!app) throw new Error('Application not found');

    app.status = status;
    if (notes) app.notes = notes;

    if (isSupabaseConfigured && supabase) {
      await supabase.from('applications').update({ status, notes }).eq('id', id);
    }

    saveLocalStore(store);

    // Notify student
    await api.createNotification({
      userId: app.studentId,
      title: `Application Status: ${status.replace('_', ' ')}`,
      message: `Your application for ${app.jobTitle} at ${app.companyName} has been updated to ${status}.`
    });

    return app;
  },

  // Placement Drives
  async getPlacementDrives(): Promise<PlacementDrive[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('placement_drives').select('*').order('drive_date', { ascending: true });
      if (!error && data) return data as PlacementDrive[];
    }
    return getLocalStore().placementDrives;
  },

  async createPlacementDrive(drive: Omit<PlacementDrive, 'id' | 'createdAt'>): Promise<PlacementDrive> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('placement_drives').insert([drive]).select().single();
      if (!error && data) return data as PlacementDrive;
    }
    const store = getLocalStore();
    const newDrive: PlacementDrive = {
      ...drive,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    store.placementDrives.unshift(newDrive);
    saveLocalStore(store);
    return newDrive;
  },

  // Interviews
  async getInterviews(): Promise<Interview[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('interviews').select('*').order('interview_date', { ascending: true });
      if (!error && data) return data as Interview[];
    }
    return getLocalStore().interviews;
  },

  async scheduleInterview(interview: Omit<Interview, 'id' | 'createdAt'>): Promise<Interview> {
    const store = getLocalStore();
    const newInterview: Interview = {
      ...interview,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('interviews').insert([newInterview]);
    }

    store.interviews.unshift(newInterview);
    saveLocalStore(store);

    // Also update application status
    await api.updateApplicationStatus(interview.applicationId, 'INTERVIEW_SCHEDULED', `Round: ${interview.roundName}`);

    // Notify student
    await api.createNotification({
      userId: interview.studentId,
      title: 'Interview Scheduled',
      message: `${interview.companyName} has scheduled ${interview.roundName} on ${interview.interviewDate} at ${interview.interviewTime}.`
    });

    return newInterview;
  },

  // Notifications
  async getNotifications(userId: string): Promise<NotificationItem[]> {
    const store = getLocalStore();
    return store.notifications.filter((n: NotificationItem) => n.userId === userId);
  },

  async createNotification(notif: { userId: string; title: string; message: string }): Promise<void> {
    const store = getLocalStore();
    const item: NotificationItem = {
      id: Date.now(),
      userId: notif.userId,
      title: notif.title,
      message: notif.message,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    store.notifications.unshift(item);
    saveLocalStore(store);
  },

  async markNotificationRead(id: number): Promise<void> {
    const store = getLocalStore();
    const n = store.notifications.find((notif: NotificationItem) => notif.id === id);
    if (n) {
      n.isRead = true;
      saveLocalStore(store);
    }
  },

  // Storage / Resume upload
  async uploadResume(file: File, studentId: string): Promise<string> {
    if (isSupabaseConfigured && supabase) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${studentId}-${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, file);
      if (!uploadError) {
        const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
        return data.publicUrl;
      }
    }
    // Fallback: return data URL or simulated storage link
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string || `https://storage.mock.local/${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  }
};
