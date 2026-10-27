import React from 'react';
import { GraduationCap, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="h-16 w-16 mx-auto rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <GraduationCap className="h-9 w-9" />
        </div>
        <div>
          <span className="text-4xl font-black text-blue-600 block">404</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Page Not Found</h1>
          <p className="text-sm text-slate-500 mt-2">
            The placement or dashboard page you requested could not be located.
          </p>
        </div>

        <button
          onClick={onNavigateHome}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
};
