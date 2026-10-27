import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { NotFoundPage } from './pages/NotFoundPage';
import { UserRole } from './types';

function getViewFromPath(pathname: string): string {
  if (pathname === '/' || pathname === '') return 'landing';
  if (pathname === '/login' || pathname === '/register' || pathname === '/auth') return 'auth';
  if (pathname.startsWith('/admin')) return 'admin-dashboard';
  if (pathname.startsWith('/recruiter')) return 'recruiter-dashboard';
  if (pathname.startsWith('/student')) return 'student-dashboard';
  return 'not-found';
}

function getPathFromView(view: string): string {
  if (view === 'landing') return '/';
  if (view === 'auth') return '/login';
  if (view === 'admin-dashboard') return '/admin/dashboard';
  if (view === 'recruiter-dashboard') return '/recruiter/dashboard';
  if (view === 'student-dashboard') return '/student/dashboard';
  return '/404';
}

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<string>(() => getViewFromPath(window.location.pathname));
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    const newPath = getPathFromView(view);
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ id: String(Date.now()), text, type });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-semibold text-sm">Loading Student Placement Portal...</p>
        </div>
      </div>
    );
  }

  // Route protection
  let renderedView = currentView;
  if (currentView === 'admin-dashboard' && user?.role !== 'ADMIN') {
    renderedView = 'auth';
  } else if (currentView === 'recruiter-dashboard' && user?.role !== 'RECRUITER') {
    renderedView = 'auth';
  } else if (currentView === 'student-dashboard' && user?.role !== 'STUDENT') {
    renderedView = 'auth';
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-blue-500 selection:text-white">
      <Navbar currentView={currentView} onNavigate={navigateTo} />
      
      <main className="flex-1">
        {renderedView === 'landing' && (
          <LandingPage onNavigate={navigateTo} onSelectRole={() => navigateTo('auth')} />
        )}
        {renderedView === 'auth' && (
          <AuthPage onNavigate={navigateTo} />
        )}
        {renderedView === 'student-dashboard' && (
          <StudentDashboard onShowToast={showToast} />
        )}
        {renderedView === 'admin-dashboard' && (
          <AdminDashboard onShowToast={showToast} />
        )}
        {renderedView === 'recruiter-dashboard' && (
          <RecruiterDashboard onShowToast={showToast} />
        )}
        {renderedView === 'not-found' && (
          <NotFoundPage onNavigateHome={() => navigateTo('landing')} />
        )}
      </main>

      <Footer />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
