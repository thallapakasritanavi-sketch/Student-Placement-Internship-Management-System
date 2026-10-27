import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Job, Internship, Application, PlacementDrive, Interview, UserProfile, ApplicationStatus } from '../../types';
import { api } from '../../services/api';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Plus, 
  FileCheck, 
  DollarSign, 
  ExternalLink,
  Award,
  Filter,
  Download,
  Trash2
} from 'lucide-react';

interface AdminDashboardProps {
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onShowToast }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'jobs' | 'applications' | 'drives' | 'students'>('analytics');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);

  // New Job Modal Form
  const [showJobModal, setShowJobModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('Bengaluru, India');
  const [newSalary, setNewSalary] = useState<number>(1800000);
  const [newMinCgpa, setNewMinCgpa] = useState<number>(7.5);
  const [newDesc, setNewDesc] = useState('');
  const [newReqs, setNewReqs] = useState('');
  const [newDeadline, setNewDeadline] = useState('2026-12-31');

  // Schedule Interview Form
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [roundName, setRoundName] = useState('Technical Round 1 (Coding & System Design)');
  const [interviewDate, setInterviewDate] = useState('2026-11-10');
  const [interviewTime, setInterviewTime] = useState('10:00 AM IST');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/xyz-placement');
  const [interviewInstructions, setInterviewInstructions] = useState('Please join 5 mins early with webcam enabled and student ID ready.');

  // Drive Modal
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveCompany, setDriveCompany] = useState('');
  const [driveTitle, setDriveTitle] = useState('');
  const [driveDate, setDriveDate] = useState('2026-11-20');
  const [driveBranches, setDriveBranches] = useState('CSE, IT, ECE');
  const [driveMinCgpa, setDriveMinCgpa] = useState<number>(7.5);
  const [driveDesc, setDriveDesc] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    try {
      const [allJobs, allInterns, allApps, allDrives, allInts, allProfiles] = await Promise.all([
        api.getAllJobs(),
        api.getAllInternships(),
        api.getApplications(),
        api.getPlacementDrives(),
        api.getInterviews(),
        api.getAllProfiles()
      ]);
      setJobs(allJobs);
      setInternships(allInterns);
      setApplications(allApps);
      setDrives(allDrives);
      setInterviews(allInts);
      setStudents(allProfiles.filter(p => p.role === 'STUDENT'));
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  }

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createJob({
        companyName: newCompany,
        title: newTitle,
        location: newLocation,
        jobType: 'FULL_TIME',
        salaryPackage: Number(newSalary),
        minCgpa: Number(newMinCgpa),
        description: newDesc,
        requirements: newReqs,
        deadline: newDeadline,
        active: true,
        postedBy: user?.id
      });
      setJobs([created, ...jobs]);
      setShowJobModal(false);
      onShowToast(`Job opening for ${newCompany} published!`, 'success');
      // Reset form
      setNewTitle('');
      setNewCompany('');
      setNewDesc('');
    } catch (e: any) {
      onShowToast(e.message || 'Failed to publish opening', 'error');
    }
  };

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createPlacementDrive({
        companyName: driveCompany,
        title: driveTitle,
        driveDate,
        location: 'Campus Auditorium & Virtual Platform',
        eligibleBranches: driveBranches,
        minCgpa: Number(driveMinCgpa),
        description: driveDesc
      });
      setDrives([created, ...drives]);
      setShowDriveModal(false);
      onShowToast(`Campus drive for ${driveCompany} scheduled!`, 'success');
    } catch (e: any) {
      onShowToast(e.message || 'Failed to schedule drive', 'error');
    }
  };

  const handleStatusChange = async (appId: number, status: ApplicationStatus) => {
    try {
      const updated = await api.updateApplicationStatus(appId, status);
      setApplications(applications.map(a => a.id === appId ? updated : a));
      onShowToast(`Candidate application updated to ${status}!`, 'success');
    } catch (e: any) {
      onShowToast('Failed to update status', 'error');
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      const created = await api.scheduleInterview({
        studentId: selectedApp.studentId,
        studentName: selectedApp.studentName,
        applicationId: selectedApp.id,
        companyName: selectedApp.companyName || 'Campus Partner',
        roundName,
        interviewDate,
        interviewTime,
        mode: 'ONLINE',
        meetLink,
        instructions: interviewInstructions
      });
      setInterviews([created, ...interviews]);
      setShowInterviewModal(false);
      setSelectedApp(null);
      await loadAdminData();
      onShowToast(`Interview scheduled for ${selectedApp.studentName}!`, 'success');
    } catch (e: any) {
      onShowToast('Failed to schedule interview', 'error');
    }
  };

  const selectedCount = applications.filter(a => a.status === 'SELECTED').length;
  const placementRate = students.length > 0 ? ((selectedCount / students.length) * 100).toFixed(1) : '94.2';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="h-4 w-4" />
            <span>Placement Officer Portal • Sri Tanavi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Placement Administration
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Live recruitment control center: manage drives, review student candidates, track package analytics, and schedule interviews.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowJobModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 flex items-center space-x-1.5 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Post Job Opening</span>
          </button>
          <button
            onClick={() => setShowDriveModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center space-x-1.5 transition-colors"
          >
            <Calendar className="h-4 w-4 text-amber-400" />
            <span>Schedule Drive</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'analytics' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Overview & Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'applications' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          <span>Applications Pipeline ({applications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'jobs' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Active Openings ({jobs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('drives')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'drives' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Drives & Interviews ({drives.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'students' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Student Registry ({students.length})</span>
        </button>
      </div>

      {/* Tab 1: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Placement Rate</span>
                <Award className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">{placementRate}%</div>
              <div className="text-xs text-emerald-600 font-semibold mt-1">↑ +4.2% from previous season</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Highest Package</span>
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">₹44.0 LPA</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Top offer from Google Cloud</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Applications</span>
                <FileCheck className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">{applications.length}</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Across all participating branches</div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Registered Students</span>
                <Users className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-slate-900 mt-2">{students.length}</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Verified academic profiles</div>
            </div>
          </div>

          {/* Recent Candidate Activity */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Recent Candidate Pipeline Activities</h3>
            <div className="divide-y divide-slate-100">
              {applications.slice(0, 5).map(app => (
                <div key={app.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 text-sm">{app.studentName}</span>
                    <span className="text-xs text-slate-500 ml-2">applied for {app.jobTitle} ({app.companyName})</span>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    app.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-800' :
                    app.status === 'INTERVIEW_SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Applications Pipeline */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Candidate Evaluation & Shortlisting</h3>
            <span className="text-xs text-slate-500">{applications.length} Submissions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">Branch & CGPA</th>
                  <th className="pb-3">Opening</th>
                  <th className="pb-3">Current Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50">
                    <td className="py-4">
                      <div className="font-bold text-slate-900">{app.studentName}</div>
                      <div className="text-xs text-slate-500">{app.studentEmail}</div>
                      {app.studentResumeUrl && (
                        <a 
                          href={app.studentResumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline inline-flex items-center space-x-1 mt-0.5"
                        >
                          <span>View Resume</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                    <td className="py-4 text-xs">
                      <div className="font-semibold text-slate-700">{app.studentBranch || 'Computer Science'}</div>
                      <div className="text-slate-500 font-bold mt-0.5 text-blue-600">{app.studentCgpa || 8.5} CGPA</div>
                    </td>
                    <td className="py-4">
                      <div className="font-semibold text-slate-900 text-xs">{app.jobTitle}</div>
                      <div className="text-xs text-slate-500">{app.companyName}</div>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        app.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'INTERVIEW_SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'SHORTLISTED' ? 'bg-amber-100 text-amber-800' :
                        app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleStatusChange(app.id, 'SHORTLISTED')}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setShowInterviewModal(true);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100"
                      >
                        Interview
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, 'SELECTED')}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Active Openings */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Current Job & Internship Listings</h3>
            <button
              onClick={() => setShowJobModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
            >
              + Post New Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900">{job.title}</h4>
                    <p className="text-xs font-semibold text-slate-600">{job.companyName}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    ₹{(job.salaryPackage / 100000).toFixed(1)} LPA
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{job.description}</p>
                <div className="text-xs text-slate-600 flex justify-between pt-2 border-t border-slate-100">
                  <span>Min CGPA: {job.minCgpa}</span>
                  <span>Deadline: {job.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Drives */}
      {activeTab === 'drives' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Scheduled Recruitment Drives</h3>
            <button
              onClick={() => setShowDriveModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
            >
              + Schedule Drive
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drives.map(drive => (
              <div key={drive.id} className="border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{drive.title}</h4>
                    <p className="text-xs font-semibold text-slate-600">{drive.companyName}</p>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                    {drive.driveDate}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{drive.description}</p>
                <div className="text-xs bg-slate-50 p-2.5 rounded-xl text-slate-600">
                  <div><strong>Eligible Branches:</strong> {drive.eligibleBranches}</div>
                  <div><strong>Location:</strong> {drive.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Students Registry */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Enrolled Student Registry</h3>
            <span className="text-xs text-slate-500">{students.length} Verified Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Email & Phone</th>
                  <th className="pb-3">Branch & Degree</th>
                  <th className="pb-3">CGPA</th>
                  <th className="pb-3">Skills</th>
                  <th className="pb-3">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50">
                    <td className="py-3 font-bold text-slate-900 text-xs">{student.fullName}</td>
                    <td className="py-3 text-xs text-slate-500">
                      <div>{student.email}</div>
                      <div>{student.phone || 'N/A'}</div>
                    </td>
                    <td className="py-3 text-xs text-slate-600">
                      {student.degree} ({student.branch})
                    </td>
                    <td className="py-3 text-xs font-bold text-blue-600">{student.cgpa || 8.5}</td>
                    <td className="py-3 text-xs text-slate-500 max-w-xs truncate">{student.skills || 'Java, Web'}</td>
                    <td className="py-3 text-xs">
                      {student.resumeUrl ? (
                        <a 
                          href={student.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center space-x-1"
                        >
                          <span>PDF</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Post New Full-Time Opportunity</h3>
            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Software Development Engineer"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Annual CTC (INR)</label>
                  <input
                    type="number"
                    required
                    value={newSalary}
                    onChange={(e) => setNewSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newMinCgpa}
                    onChange={(e) => setNewMinCgpa(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Role responsibilities and technical overview"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                >
                  Publish Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showInterviewModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">
              Schedule Interview for {selectedApp.studentName}
            </h3>
            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Round Name</label>
                <input
                  type="text"
                  required
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Interview Date</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Meeting Link</label>
                <input
                  type="url"
                  required
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                >
                  Confirm & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Drive Modal */}
      {showDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Schedule Campus Drive</h3>
            <form onSubmit={handleCreateDrive} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Drive Title</label>
                <input
                  type="text"
                  required
                  value={driveTitle}
                  onChange={(e) => setDriveTitle(e.target.value)}
                  placeholder="e.g. Microsoft IDC Campus Drive 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Company</label>
                  <input
                    type="text"
                    required
                    value={driveCompany}
                    onChange={(e) => setDriveCompany(e.target.value)}
                    placeholder="e.g. Microsoft"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={driveDate}
                    onChange={(e) => setDriveDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Eligible Branches</label>
                <input
                  type="text"
                  required
                  value={driveBranches}
                  onChange={(e) => setDriveBranches(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Min CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={driveMinCgpa}
                  onChange={(e) => setDriveMinCgpa(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Drive Overview</label>
                <textarea
                  rows={2}
                  required
                  value={driveDesc}
                  onChange={(e) => setDriveDesc(e.target.value)}
                  placeholder="Rounds details, test links, instructions"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDriveModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                >
                  Schedule Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
