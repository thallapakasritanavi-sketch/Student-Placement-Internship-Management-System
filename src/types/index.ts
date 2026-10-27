export type UserRole = 'STUDENT' | 'ADMIN' | 'RECRUITER';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  college?: string;
  degree?: string;
  branch?: string;
  cgpa?: number;
  graduationYear?: number;
  skills?: string;
  resumeUrl?: string;
  certifications?: string;
  projects?: string;
  companyName?: string;
  createdAt?: string;
}

export interface Job {
  id: number;
  companyName: string;
  title: string;
  location: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT';
  salaryPackage: number;
  minCgpa: number;
  description: string;
  requirements: string;
  deadline: string;
  active: boolean;
  postedBy?: string;
  createdAt?: string;
}

export interface Internship {
  id: number;
  companyName: string;
  title: string;
  location: string;
  durationMonths: number;
  stipendMonthly: number;
  minCgpa: number;
  description: string;
  requirements: string;
  deadline: string;
  active: boolean;
  postedBy?: string;
  createdAt?: string;
}

export type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'SELECTED' | 'REJECTED';

export interface Application {
  id: number;
  studentId: string;
  studentName?: string;
  studentEmail?: string;
  studentCgpa?: number;
  studentBranch?: string;
  studentResumeUrl?: string;
  jobId?: number;
  internshipId?: number;
  jobTitle?: string;
  companyName?: string;
  type?: 'JOB' | 'INTERNSHIP';
  status: ApplicationStatus;
  notes?: string;
  appliedAt: string;
}

export interface PlacementDrive {
  id: number;
  companyName: string;
  title: string;
  driveDate: string;
  location: string;
  eligibleBranches: string;
  minCgpa: number;
  description: string;
  createdAt?: string;
}

export interface Interview {
  id: number;
  studentId: string;
  studentName?: string;
  applicationId: number;
  companyName: string;
  roundName: string;
  interviewDate: string;
  interviewTime: string;
  mode: 'ONLINE' | 'OFFLINE';
  meetLink?: string;
  instructions?: string;
  createdAt?: string;
}

export interface NotificationItem {
  id: number;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
