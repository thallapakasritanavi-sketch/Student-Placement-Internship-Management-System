import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Job, Internship, Application, Interview, NotificationItem } from '../../types';
import { api } from '../../services/api';
import { 
  Briefcase, 
  User, 
  FileText, 
  Calendar, 
  Bell, 
  CheckCircle, 
  Clock, 
  Upload, 
  ExternalLink, 
  AlertCircle,
  Building2,
  DollarSign,
  MapPin,
  Award,
  Search,
  Filter
} from 'lucide-react';

interface StudentDashboardProps {
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onShowToast }) => {
  const { user, updateCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'openings' | 'applications' | 'profile' | 'interviews'>('openings');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);

  // Profile Form State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [college, setCollege] = useState(user?.college || '');
  const [degree, setDegree] = useState(user?.degree || 'B.Tech');
  const [branch, setBranch] = useState(user?.branch || 'Computer Science & Engineering');
  const [cgpa, setCgpa] = useState<number>(user?.cgpa || 8.5);
  const [skills, setSkills] = useState(user?.skills || '');
  const [certifications, setCertifications] = useState(user?.certifications || '');
  const [projects, setProjects] = useState(user?.projects || '');
  const [resumeUrl, setResumeUrl] = useState(user?.resumeUrl || '');

  useEffect(() => {
    loadStudentData();
  }, [user]);

  async function loadStudentData() {
    if (!user) return;
    try {
      const [j, i, apps, ints, notifs] = await Promise.all([
        api.getJobs(),
        api.getInternships(),
        api.getStudentApplications(user.id),
        api.getInterviews(),
        api.getNotifications(user.id)
      ]);
      setJobs(j);
      setInternships(i);
      setApplications(apps);
      setInterviews(ints.filter(int => int.studentId === user.id));
      setNotifications(notifs);
    } catch (err) {
      console.error('Error loading student dashboard data:', err);
    }
  }

  const handleApply = async (item: Job | Internship, type: 'JOB' | 'INTERNSHIP') => {
    if (!user) return;

    // CGPA verification
    if (user.cgpa && user.cgpa < item.minCgpa) {
      onShowToast(`Eligibility requirement not met: minimum CGPA is ${item.minCgpa} (your CGPA: ${user.cgpa})`, 'error');
      return;
    }

    try {
      const newApp = await api.apply({
        studentId: user.id,
        studentName: user.fullName,
        studentEmail: user.email,
        studentCgpa: user.cgpa,
        studentBranch: user.branch,
        studentResumeUrl: user.resumeUrl,
        jobId: type === 'JOB' ? item.id : undefined,
        internshipId: type === 'INTERNSHIP' ? item.id : undefined,
        jobTitle: item.title,
        companyName: item.companyName,
        type
      });
      setApplications([newApp, ...applications]);
      onShowToast(`Application submitted to ${item.companyName} for ${item.title}!`, 'success');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to submit application', 'error');
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user) return;
    const file = e.target.files[0];

    setUploadingResume(true);
    try {
      const uploadedUrl = await api.uploadResume(file, user.id);
      setResumeUrl(uploadedUrl);
      await updateCurrentUser({ resumeUrl: uploadedUrl });
      onShowToast('Resume uploaded and linked to profile!', 'success');
    } catch (err: any) {
      onShowToast(err.message || 'Failed to upload resume', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateCurrentUser({
        fullName,
        college,
        degree,
        branch,
        cgpa: Number(cgpa),
        skills,
        certifications,
        projects,
        resumeUrl
      });
      onShowToast('Academic profile updated successfully!', 'success');
    } catch (err: any) {
      onShowToast('Failed to update profile', 'error');
    }
  };

  const hasApplied = (id: number, type: 'JOB' | 'INTERNSHIP') => {
    return applications.some(a => type === 'JOB' ? a.jobId === id : a.internshipId === id);
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInternships = internships.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-blue-200">
            <span>Student Career Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-sm text-blue-100 max-w-xl">
            {user?.degree} in {user?.branch} • CGPA: <span className="font-bold text-white">{user?.cgpa || 'Not set'}</span>
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center min-w-[100px]">
            <div className="text-2xl font-black">{applications.length}</div>
            <div className="text-xs text-blue-200">Applied</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center min-w-[100px]">
            <div className="text-2xl font-black text-emerald-300">
              {applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'SELECTED').length}
            </div>
            <div className="text-xs text-blue-200">Shortlisted</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center min-w-[100px]">
            <div className="text-2xl font-black text-amber-300">{interviews.length}</div>
            <div className="text-xs text-blue-200">Interviews</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('openings')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'openings' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Browse Openings</span>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'applications' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>My Applications ({applications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('interviews')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'interviews' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Interview Calls ({interviews.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Academic Profile & Resume</span>
        </button>
      </div>

      {/* Tab 1: Browse Openings */}
      {activeTab === 'openings' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div className="text-xs text-slate-500">
              Showing {filteredJobs.length} Full-Time Jobs and {filteredInternships.length} Internships
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <span>Full-Time Placement Opportunities</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => {
                const applied = hasApplied(job.id, 'JOB');
                const meetsCgpa = (user?.cgpa || 0) >= job.minCgpa;

                return (
                  <div key={job.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {job.jobType.replace('_', ' ')}
                          </span>
                          <h4 className="font-bold text-slate-900 text-lg mt-1">{job.title}</h4>
                          <div className="text-sm font-semibold text-slate-600">{job.companyName}</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-3">{job.description}</p>

                      <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center space-x-1.5 font-bold text-emerald-700">
                          <DollarSign className="h-4 w-4 text-emerald-600" />
                          <span>₹{(job.salaryPackage / 100000).toFixed(1)} LPA CTC</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Award className="h-4 w-4 text-amber-500" />
                          <span>Min CGPA: {job.minCgpa} {meetsCgpa ? '✓ (Eligible)' : '✗ (Requires higher CGPA)'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Deadline: {job.deadline}</span>
                      {applied ? (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 flex items-center space-x-1">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApply(job, 'JOB')}
                          disabled={!meetsCgpa}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          1-Click Apply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Internships Grid */}
          <div className="space-y-4 pt-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <span>Summer Internships</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternships.map((intern) => {
                const applied = hasApplied(intern.id, 'INTERNSHIP');
                const meetsCgpa = (user?.cgpa || 0) >= intern.minCgpa;

                return (
                  <div key={intern.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {intern.durationMonths} Months Internship
                        </span>
                        <h4 className="font-bold text-slate-900 text-lg mt-1">{intern.title}</h4>
                        <div className="text-sm font-semibold text-slate-600">{intern.companyName}</div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-3">{intern.description}</p>

                      <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center space-x-1.5 font-bold text-indigo-700">
                          <DollarSign className="h-4 w-4 text-indigo-600" />
                          <span>₹{intern.stipendMonthly.toLocaleString()} / Month Stipend</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>{intern.location}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Award className="h-4 w-4 text-amber-500" />
                          <span>Min CGPA: {intern.minCgpa}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Deadline: {intern.deadline}</span>
                      {applied ? (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 flex items-center space-x-1">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Applied</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApply(intern, 'INTERNSHIP')}
                          disabled={!meetsCgpa}
                          className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          1-Click Apply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: My Applications */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Application Pipeline Status</h3>
          {applications.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>You have not submitted any applications yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="pb-3">Company & Role</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Applied On</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Notes / Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50">
                      <td className="py-4">
                        <div className="font-bold text-slate-900">{app.jobTitle}</div>
                        <div className="text-xs text-slate-500">{app.companyName}</div>
                      </td>
                      <td className="py-4">
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                          {app.type}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-slate-500">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          app.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-800' :
                          app.status === 'INTERVIEW_SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'SHORTLISTED' ? 'bg-amber-100 text-amber-800' :
                          app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-slate-600">
                        {app.notes || 'Under evaluation by recruitment team'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Interviews */}
      {activeTab === 'interviews' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Scheduled Technical & HR Interviews</h3>
          {interviews.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No active interview schedules currently.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="border border-blue-200 bg-blue-50/50 rounded-2xl p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
                        {interview.mode}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-2">{interview.companyName}</h4>
                      <p className="text-xs text-blue-700 font-semibold">{interview.roundName}</p>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-bold text-slate-800">{interview.interviewDate}</div>
                      <div className="text-slate-500">{interview.interviewTime}</div>
                    </div>
                  </div>

                  {interview.instructions && (
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-blue-100">
                      {interview.instructions}
                    </p>
                  )}

                  {interview.meetLink && (
                    <a
                      href={interview.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Join Meeting Link</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile & Resume */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Academic & Placement Portfolio</h3>
            <p className="text-xs text-slate-500 mt-1">Keep your verified CGPA, skills, and resume updated for recruiter screening.</p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">College / Institute</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Degree & Branch</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cumulative CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={cgpa}
                  onChange={(e) => setCgpa(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Technical Skills</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Java, Python, React, PostgreSQL, Docker, Git"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Certifications & Accreditations</label>
                <input
                  type="text"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  placeholder="e.g. AWS Certified Cloud Practitioner, Oracle Java Certified"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Featured Projects</label>
                <textarea
                  rows={3}
                  value={projects}
                  onChange={(e) => setProjects(e.target.value)}
                  placeholder="Brief description of major technical projects, GitHub URLs, or deployed apps"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {/* Resume Upload Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700">Resume / Curriculum Vitae (PDF/DOC)</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors">
                  <Upload className="h-4 w-4 text-blue-600" />
                  <span>{uploadingResume ? 'Uploading...' : 'Choose PDF File'}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>

                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <span>View Current Uploaded Resume</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">No resume uploaded yet.</span>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 text-sm transition-colors"
              >
                Save Portfolio Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
