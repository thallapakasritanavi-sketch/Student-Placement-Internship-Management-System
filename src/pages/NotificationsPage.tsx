import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { NotificationItem, NotificationType } from '../types';
import { api, NOTIFICATIONS_UPDATED_EVENT } from '../services/api';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  ArrowLeft, 
  Sparkles, 
  Briefcase, 
  Calendar, 
  Award, 
  AlertCircle,
  Filter,
  ExternalLink,
  Clock
} from 'lucide-react';

interface NotificationsPageProps {
  onNavigate: (view: string, extra?: { tab?: string; appId?: number }) => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate, onShowToast }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'applications' | 'status' | 'interviews'>('all');
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const items = await api.getNotifications(user.id);
      setNotifications(items);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleUpdate = () => {
      fetchNotifications();
    };
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);

    const interval = setInterval(() => {
      if (user) fetchNotifications();
    }, 10000);

    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);
      clearInterval(interval);
    };
  }, [user?.id]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Please sign in to view your notifications</h2>
        <button
          onClick={() => onNavigate('auth')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-sm"
        >
          Sign In
        </button>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: number | string) => {
    try {
      await api.markNotificationRead(id, user.id);
      setNotifications(prev => prev.map(n => String(n.id) === String(id) ? { ...n, isRead: true } : n));
      onShowToast('Notification marked as read', 'success');
    } catch (err) {
      onShowToast('Failed to update notification', 'error');
    }
  };

  const handleMarkAllAsRead = async () => {
    setLoading(true);
    try {
      await api.markAllNotificationsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      onShowToast('All notifications marked as read', 'success');
    } catch (err) {
      onShowToast('Failed to mark all as read', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await api.deleteNotification(id, user.id);
      setNotifications(prev => prev.filter(n => String(n.id) !== String(id)));
      onShowToast('Notification removed', 'info');
    } catch (err) {
      onShowToast('Failed to remove notification', 'error');
    }
  };

  const handleClearRead = async () => {
    try {
      await api.clearAllReadNotifications(user.id);
      setNotifications(prev => prev.filter(n => !n.isRead));
      onShowToast('Cleared all read notifications', 'info');
    } catch (err) {
      onShowToast('Failed to clear read notifications', 'error');
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      await api.markNotificationRead(notif.id, user.id);
    }

    if (user.role === 'STUDENT') {
      if (notif.type === 'APPLICATION_SUBMITTED' || notif.type === 'STATUS_CHANGE') {
        onNavigate('student-dashboard', { tab: 'applications', appId: notif.relatedApplicationId });
      } else if (notif.type === 'INTERVIEW_SCHEDULED') {
        onNavigate('student-dashboard', { tab: 'interviews' });
      } else {
        onNavigate('student-dashboard', { tab: 'openings' });
      }
    } else if (user.role === 'ADMIN') {
      onNavigate('admin-dashboard');
    } else {
      onNavigate('recruiter-dashboard');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'applications') return n.type === 'APPLICATION_SUBMITTED';
    if (filter === 'status') return n.type === 'STATUS_CHANGE';
    if (filter === 'interviews') return n.type === 'INTERVIEW_SCHEDULED';
    return true;
  });

  const getDashboardView = () => {
    if (user.role === 'ADMIN') return 'admin-dashboard';
    if (user.role === 'RECRUITER') return 'recruiter-dashboard';
    return 'student-dashboard';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate(getDashboardView())}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Notification Centre</span>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Updates regarding student registration, applications, status changes, and interview schedules.
            </p>
          </div>
        </div>

        {/* Global Batch Actions */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs flex items-center space-x-1.5 transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              <span>Mark All as Read</span>
            </button>
          )}
          {notifications.some(n => n.isRead) && (
            <button
              onClick={handleClearRead}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors flex items-center space-x-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'all' 
              ? 'bg-slate-900 text-white shadow-sm' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'unread' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('applications')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'applications' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Applications
        </button>
        <button
          onClick={() => setFilter('status')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'status' 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Status Updates
        </button>
        <button
          onClick={() => setFilter('interviews')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'interviews' 
              ? 'bg-purple-600 text-white shadow-sm' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Interviews
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No notifications found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              {filter === 'unread' 
                ? 'You have caught up with all your notifications!' 
                : 'There are no notifications matching the selected filter.'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isUnread = !notif.isRead;
            const notifDate = new Date(notif.createdAt);
            const formattedDate = notifDate.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
            const formattedTime = notifDate.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={notif.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-150 flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${
                  isUnread 
                    ? 'border-blue-300 ring-2 ring-blue-500/10 shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  {/* Category icon */}
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    notif.type === 'WELCOME' ? 'bg-amber-100 text-amber-700' :
                    notif.type === 'APPLICATION_SUBMITTED' ? 'bg-blue-100 text-blue-700' :
                    notif.type === 'INTERVIEW_SCHEDULED' ? 'bg-purple-100 text-purple-700' :
                    notif.type === 'STATUS_CHANGE' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {notif.type === 'WELCOME' && <Sparkles className="h-5 w-5" />}
                    {notif.type === 'APPLICATION_SUBMITTED' && <Briefcase className="h-5 w-5" />}
                    {notif.type === 'INTERVIEW_SCHEDULED' && <Calendar className="h-5 w-5" />}
                    {notif.type === 'STATUS_CHANGE' && <Award className="h-5 w-5" />}
                    {notif.type === 'GENERAL' && <AlertCircle className="h-5 w-5" />}
                  </div>

                  {/* Body */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-sm ${isUnread ? 'font-extrabold text-slate-900' : 'font-bold text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      {isUnread && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700">
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formattedDate} at {formattedTime}</span>
                      </span>

                      {/* Action Navigation */}
                      <button
                        onClick={() => handleNotificationClick(notif)}
                        className="text-blue-600 font-semibold hover:underline inline-flex items-center space-x-1"
                      >
                        <span>Open related section</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-start shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                  {isUnread && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center space-x-1 border border-slate-200"
                      title="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Mark Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
