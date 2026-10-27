import React from 'react';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg text-white">Placement & Internship Portal</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              A comprehensive campus recruitment ecosystem unifying student portfolios, verified academic credentials, recruiter postings, automated drive schedules, and real-time application pipelines.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-emerald-400">Cloud Infrastructure Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">Student Career Hub</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Corporate Recruiter Desk</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Placement Officer Admin</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Recruitment Drives</span></li>
            </ul>
          </div>

          {/* Support & Tech */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Security & Tech</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-1.5 text-slate-300">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                <span>Supabase PostgreSQL & RLS</span>
              </li>
              <li><span>Vercel Global Edge Hosting</span></li>
              <li><span>BCrypt / Supabase Auth</span></li>
              <li><span>TypeScript & React 18</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 space-y-3 md:space-y-0">
          <p>© {new Date().getFullYear()} Student Placement and Internship Management System. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Coordinated by</span>
            <span className="font-semibold text-slate-300">Sri Tanavi</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500 ml-1 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
