import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  Briefcase, 
  LogOut, 
  User, 
  Menu, 
  X, 
  ShieldCheck, 
  Building2, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

import { NotificationBell } from './NotificationBell';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, extra?: { tab?: string; appId?: number }) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, signOut, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    onNavigate('landing');
  };

  const getDashboardView = () => {
    if (!user) return 'auth';
    if (user.role === 'ADMIN') return 'admin-dashboard';
    if (user.role === 'RECRUITER') return 'recruiter-dashboard';
    return 'student-dashboard';
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div 
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-lg tracking-tight block leading-tight">
                Placement & Internships
              </span>
              <span className="text-xs text-blue-600 font-semibold tracking-wider uppercase block">
                Management System
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'landing' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {user ? (
              <>
                <button
                  onClick={() => onNavigate(getDashboardView())}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    currentView.includes('dashboard') ? 'text-blue-600 bg-blue-50 font-semibold' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {user.role === 'ADMIN' && <ShieldCheck className="h-4 w-4 text-emerald-600" />}
                  {user.role === 'RECRUITER' && <Building2 className="h-4 w-4 text-indigo-600" />}
                  {user.role === 'STUDENT' && <Briefcase className="h-4 w-4 text-blue-600" />}
                  <span>Dashboard</span>
                </button>
              </>
            ) : null}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
                <NotificationBell onNavigate={onNavigate} />

                <div className="flex items-center space-x-2 text-right">
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block leading-tight">
                      {user.fullName}
                    </span>
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">
                    {user.fullName.substring(0, 2).toUpperCase()}
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {/* 1-Click Demo Login Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                  >
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <span>Demo Accounts</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>

                  {demoDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        1-Click Access
                      </div>
                      <button
                        onClick={async () => {
                          await demoLogin('ADMIN');
                          setDemoDropdownOpen(false);
                          onNavigate('admin-dashboard');
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <div>
                          <div className="font-medium">Admin (Sri Tanavi)</div>
                          <div className="text-xs text-slate-400">Full Placement Control</div>
                        </div>
                      </button>
                      <button
                        onClick={async () => {
                          await demoLogin('STUDENT');
                          setDemoDropdownOpen(false);
                          onNavigate('student-dashboard');
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                      >
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium">Student (Demo Account)</div>
                          <div className="text-xs text-slate-400">Apply & Track Status</div>
                        </div>
                      </button>
                      <button
                        onClick={async () => {
                          await demoLogin('RECRUITER');
                          setDemoDropdownOpen(false);
                          onNavigate('recruiter-dashboard');
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                      >
                        <Building2 className="h-4 w-4 text-indigo-600" />
                        <div>
                          <div className="font-medium">Recruiter (Google)</div>
                          <div className="text-xs text-slate-400">Post Openings & Review</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('auth')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Actions */}
          <div className="flex md:hidden items-center space-x-1">
            {user && <NotificationBell onNavigate={onNavigate} />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <button
            onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </button>
          {user ? (
            <>
              <button
                onClick={() => { onNavigate(getDashboardView()); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-blue-600 bg-blue-50 font-semibold"
              >
                Go to Dashboard ({user.role})
              </button>
              <button
                onClick={() => { onNavigate('notifications'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Notification Centre</span>
              </button>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{user.fullName}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="p-2 text-red-600 bg-red-50 rounded-lg"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={async () => {
                  await demoLogin('ADMIN');
                  setMobileMenuOpen(false);
                  onNavigate('admin-dashboard');
                }}
                className="w-full py-2.5 px-3 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                Demo Admin (Sri Tanavi)
              </button>
              <button
                onClick={async () => {
                  await demoLogin('STUDENT');
                  setMobileMenuOpen(false);
                  onNavigate('student-dashboard');
                }}
                className="w-full py-2.5 px-3 rounded-lg text-sm font-semibold bg-blue-50 text-blue-800 border border-blue-200"
              >
                Demo Student Account
              </button>
              <button
                onClick={() => { onNavigate('auth'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 px-3 rounded-lg text-sm font-semibold bg-blue-600 text-white text-center"
              >
                Sign In / Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
