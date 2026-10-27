import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Building2, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  Award,
  Clock
} from 'lucide-react';
import { Job, Internship, PlacementDrive } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onSelectRole: (role: 'STUDENT' | 'ADMIN' | 'RECRUITER') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectRole }) => {
  const { demoLogin } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'internships' | 'drives'>('jobs');

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsData, internData, drivesData] = await Promise.all([
          api.getJobs(),
          api.getInternships(),
          api.getPlacementDrives()
        ]);
        setJobs(jobsData);
        setInternships(internData);
        setDrives(drivesData);
      } catch (e) {
        console.error('Error loading landing data:', e);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.3),rgba(255,255,255,0))]"></div>
        <div className="relative max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>Campus Placement Season 2026 Live</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Connecting Ambitious Students with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Global Industry Leaders</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A unified, cloud-native recruitment ecosystem managing placements, summer internships, student profiles, and multi-round interviews with verified accuracy.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('auth')}
              className="px-6 py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 flex items-center space-x-2 transition-all hover:scale-105"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={async () => {
                await demoLogin('ADMIN');
                onNavigate('admin-dashboard');
              }}
              className="px-6 py-3.5 rounded-xl font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md flex items-center space-x-2 transition-all hover:scale-105"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Launch Placement Officer View</span>
            </button>
          </div>

          {/* Quick stats ribbon */}
          <div className="pt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400">96.8%</div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium">Placement Rate</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">₹44.0 LPA</div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium">Highest Package</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">180+</div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium">Recruiting Partners</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">650+</div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium">Offers Extended</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Opportunities Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Active Openings</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Explore Featured Roles</h2>
          </div>

          {/* Tabs */}
          <div className="mt-4 md:mt-0 flex space-x-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'jobs' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full-Time Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('internships')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'internships' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Internships ({internships.length})
            </button>
            <button
              onClick={() => setActiveTab('drives')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'drives' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Campus Drives ({drives.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Full-Time Jobs */}
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                        {job.jobType.replace('_', ' ')}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">{job.title}</h3>
                      <div className="text-sm font-semibold text-slate-600 flex items-center space-x-1 mt-0.5">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <span>{job.companyName}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 font-semibold text-emerald-700">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span>₹{(job.salaryPackage / 100000).toFixed(1)} LPA CTC</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>Min CGPA: {job.minCgpa}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Apply by {job.deadline}</span>
                  </span>
                  <button
                    onClick={() => onNavigate('auth')}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Internships */}
        {activeTab === 'internships' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((intern) => (
              <div 
                key={intern.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                      {intern.durationMonths} Months Internship
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">{intern.title}</h3>
                    <div className="text-sm font-semibold text-slate-600 flex items-center space-x-1 mt-0.5">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>{intern.companyName}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {intern.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{intern.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 font-semibold text-indigo-700">
                      <DollarSign className="h-4 w-4 text-indigo-600" />
                      <span>₹{intern.stipendMonthly.toLocaleString()} / Month Stipend</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-500">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>Min CGPA: {intern.minCgpa}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Deadline: {intern.deadline}</span>
                  </span>
                  <button
                    onClick={() => onNavigate('auth')}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Placement Drives */}
        {activeTab === 'drives' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drives.map((drive) => (
              <div 
                key={drive.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800">
                      Campus Recruitment Drive
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">{drive.title}</h3>
                    <div className="text-sm font-semibold text-slate-600">{drive.companyName}</div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center space-x-1 text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{drive.driveDate}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4">{drive.description}</p>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Eligible Branches:</span>
                    <span className="font-semibold text-slate-800">{drive.eligibleBranches}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Minimum CGPA:</span>
                    <span className="font-semibold text-slate-800">{drive.minCgpa} CGPA</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block">Location / Mode:</span>
                    <span className="font-semibold text-slate-800">{drive.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3-Role Workflow Architecture */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">Tailored Experiences</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Built for Every Placement Stakeholder</h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A synchronized platform connecting students, recruitment teams, and institutional coordinators with dedicated role-based features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Student Portal</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Build a professional profile, upload verified resumes, discover eligible jobs, apply in 1-click, and track application milestones in real-time.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-700 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Resume upload & academic profile builder</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Personalized eligibility filters (CGPA, branch)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Live interview scheduler & calendar</span>
                </li>
              </ul>
              <button
                onClick={async () => {
                  await demoLogin('STUDENT');
                  onNavigate('student-dashboard');
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
              >
                Access Student Demo
              </button>
            </div>

            {/* Recruiter Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Corporate Recruiters</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Publish tailored job descriptions, review applicant resumes directly, apply filters by skills and CGPA, and schedule technical rounds.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-700 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Post jobs and 6-month internships</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Instant candidate resume screening</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Direct status updates (Shortlist, Hire)</span>
                </li>
              </ul>
              <button
                onClick={async () => {
                  await demoLogin('RECRUITER');
                  onNavigate('recruiter-dashboard');
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Access Recruiter Demo
              </button>
            </div>

            {/* Admin / Placement Officer Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Placement Officer</h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Supervised by Sri Tanavi. Comprehensive placement analytics, drive coordination, company partnerships, and placement reports.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-700 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Real-time placement rate & package stats</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Full student academic registry with filters</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Automated notifications & drive alerts</span>
                </li>
              </ul>
              <button
                onClick={async () => {
                  await demoLogin('ADMIN');
                  onNavigate('admin-dashboard');
                }}
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
              >
                Access Admin Portal (Sri Tanavi)
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
