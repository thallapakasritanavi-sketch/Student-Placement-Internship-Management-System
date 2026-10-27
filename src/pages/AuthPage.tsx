import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { GraduationCap, Building2, ShieldCheck, Sparkles, ArrowRight, Lock, Mail, User } from 'lucide-react';

interface AuthPageProps {
  onNavigate: (view: string) => void;
  initialRole?: UserRole;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const { signIn, signUp, demoLogin } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [cgpa, setCgpa] = useState<number>(8.0);
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const user = await signIn(email, password);
        if (user.role === 'ADMIN') onNavigate('admin-dashboard');
        else if (user.role === 'RECRUITER') onNavigate('recruiter-dashboard');
        else onNavigate('student-dashboard');
      } else {
        const user = await signUp({
          email,
          password,
          role,
          fullName,
          branch: role === 'STUDENT' ? branch : undefined,
          cgpa: role === 'STUDENT' ? Number(cgpa) : undefined,
          companyName: role === 'RECRUITER' ? companyName : undefined
        });
        if (user.role === 'ADMIN') onNavigate('admin-dashboard');
        else if (user.role === 'RECRUITER') onNavigate('recruiter-dashboard');
        else onNavigate('student-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async (targetRole: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      const user = await demoLogin(targetRole);
      if (user.role === 'ADMIN') onNavigate('admin-dashboard');
      else if (user.role === 'RECRUITER') onNavigate('recruiter-dashboard');
      else onNavigate('student-dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to initialize demo session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-2xl bg-blue-600 text-white items-center justify-center shadow-lg shadow-blue-500/30">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'signin' ? 'Sign In to Portal' : 'Create an Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Student Placement and Internship Management System
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'signin' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'signup' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                {/* Role Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">I am registering as:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('STUDENT')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                        role === 'STUDENT' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <GraduationCap className="h-4 w-4" />
                      <span>Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('RECRUITER')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                        role === 'RECRUITER' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="h-4 w-4" />
                      <span>Recruiter</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. T. Sri Tanavi"
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {role === 'STUDENT' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Branch</label>
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
                      >
                        <option value="Computer Science & Engineering">CSE</option>
                        <option value="Information Technology">IT</option>
                        <option value="Electronics & Communication">ECE</option>
                        <option value="Data Science & AI">AI & DS</option>
                        <option value="Mechanical Engineering">Mech</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Current CGPA</label>
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
                  </div>
                )}

                {role === 'RECRUITER' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Google India"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {mode === 'signin' ? 'Email or Login Identifier' : 'College Email'}
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === 'signin' ? "sri or student@placement.com" : "student@placement.com"}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Dashboard' : 'Complete Registration'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* 1-Click Evaluation Credentials */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Instant 1-Click Demo Evaluation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoAccess('ADMIN')}
                className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin (Sri)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoAccess('STUDENT')}
                className="p-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoAccess('RECRUITER')}
                className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Recruiter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
