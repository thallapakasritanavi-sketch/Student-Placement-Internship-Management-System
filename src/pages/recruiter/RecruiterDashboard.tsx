import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Job, Application, ApplicationStatus } from '../../types';
import { api } from '../../services/api';
import { 
  Building2, 
  Briefcase, 
  Users, 
  Plus, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  DollarSign,
  Award
} from 'lucide-react';

interface RecruiterDashboardProps {
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ onShowToast }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'applicants' | 'postings'>('applicants');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // Post Job Modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Bengaluru, India');
  const [salaryPackage, setSalaryPackage] = useState<number>(2000000);
  const [minCgpa, setMinCgpa] = useState<number>(7.5);
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [deadline, setDeadline] = useState('2026-12-31');

  useEffect(() => {
    loadRecruiterData();
  }, [user]);

  async function loadRecruiterData() {
    try {
      const [allJobs, allApps] = await Promise.all([
        api.getAllJobs(),
        api.getApplications()
      ]);
      const myCompany = user?.companyName?.toLowerCase() || 'google';
      const companyJobs = allJobs.filter(j => j.companyName.toLowerCase().includes(myCompany));
      const companyApps = allApps.filter(a => a.companyName?.toLowerCase().includes(myCompany));
      setJobs(companyJobs.length > 0 ? companyJobs : allJobs.slice(0, 2));
      setApplications(companyApps.length > 0 ? companyApps : allApps);
    } catch (e) {
      console.error('Error loading recruiter data:', e);
    }
  }

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createJob({
        companyName: user?.companyName || 'Corporate Partner',
        title,
        location,
        jobType: 'FULL_TIME',
        salaryPackage: Number(salaryPackage),
        minCgpa: Number(minCgpa),
        description,
        requirements,
        deadline,
        active: true,
        postedBy: user?.id
      });
      setJobs([created, ...jobs]);
      setShowModal(false);
      onShowToast(`New role ${title} posted successfully!`, 'success');
      setTitle('');
      setDescription('');
    } catch (err: any) {
      onShowToast('Failed to post role', 'error');
    }
  };

  const handleUpdateStatus = async (appId: number, status: ApplicationStatus) => {
    try {
      const updated = await api.updateApplicationStatus(appId, status);
      setApplications(applications.map(a => a.id === appId ? updated : a));
      onShowToast(`Applicant status marked as ${status}!`, 'success');
    } catch (e: any) {
      onShowToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-indigo-800">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
            <Building2 className="h-4 w-4" />
            <span>Corporate Recruitment Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {user?.companyName || 'Google India'} Talent Acquisition
          </h1>
          <p className="text-sm text-indigo-100 max-w-xl">
            Evaluate applicants, screen resumes, and select candidates for technical interview rounds.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 flex items-center space-x-2 transition-colors self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Post New Campus Opening</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('applicants')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'applicants' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Candidate Applicants ({applications.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('postings')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'postings' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Active Postings ({jobs.length})</span>
        </button>
      </div>

      {/* Tab 1: Applicants */}
      {activeTab === 'applicants' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Review Candidate Resumes & Portfolios</h3>
            <span className="text-xs text-slate-500">{applications.length} Submissions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">Academic Stats</th>
                  <th className="pb-3">Target Role</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Recruiter Action</th>
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
                          className="text-xs text-indigo-600 hover:underline inline-flex items-center space-x-1 mt-1"
                        >
                          <span>Review Full Resume (PDF)</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                    <td className="py-4 text-xs">
                      <div className="font-semibold text-slate-700">{app.studentBranch || 'Computer Science'}</div>
                      <div className="font-bold text-indigo-600 mt-0.5">{app.studentCgpa || 8.8} CGPA</div>
                    </td>
                    <td className="py-4 text-xs font-semibold text-slate-800">
                      {app.jobTitle}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        app.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'SHORTLISTED' ? 'bg-amber-100 text-amber-800' :
                        app.status === 'INTERVIEW_SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'SELECTED')}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      >
                        Hire
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Postings */}
      {activeTab === 'postings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Current Campus Postings</h3>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white"
            >
              + Post New
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="border border-slate-200 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-slate-900">{job.title}</h4>
                <div className="text-xs text-slate-500 font-semibold">{job.companyName}</div>
                <div className="text-xs font-bold text-emerald-700">₹{(job.salaryPackage / 100000).toFixed(1)} LPA CTC</div>
                <p className="text-xs text-slate-600 line-clamp-3">{job.description}</p>
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-100 flex justify-between">
                  <span>Min CGPA: {job.minCgpa}</span>
                  <span>Active Listing</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Post Role for {user?.companyName || 'Company'}</h3>
            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Software Engineer - Campus 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Annual CTC (INR)</label>
                  <input
                    type="number"
                    required
                    value={salaryPackage}
                    onChange={(e) => setSalaryPackage(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Job Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
                >
                  Publish Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
