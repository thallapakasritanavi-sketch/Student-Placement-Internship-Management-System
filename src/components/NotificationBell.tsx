import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { NotificationItem } from '../types';
import { api, NOTIFICATIONS_UPDATED_EVENT } from '../services/api';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  ExternalLink, 
  Sparkles, 
  Briefcase, 
  Calendar, 
  Award, 
  AlertCircle,
  X,
  Clock
} from 'lucide-react';

interface NotificationBellProps {
  onNavigate?: (view: string, extra?: { tab?: string; appId?: number }) => void;
  className?: string;
  buttonClassName?: string;
}

function formatNotificationTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'WELCOME':
      return <Sparkles className="h-4 w-4 text-amber-500" />;
    case 'APPLICATION_SUBMITTED':
      return <Briefcase className="h-4 w-4 text-blue-500" />;
    case 'INTERVIEW_SCHEDULED':
      return <Calendar className="h-4 w-4 text-purple-500" />;
    case 'STATUS_CHANGE':
      return <Award className="h-4 w-4 text-emerald-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-slate-500" />;
  }
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ 
  onNavigate, 
  className = '',
  buttonClassName = ''
}) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      const items = await api.getNotifications(user.id);
      setNotifications(items);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // 1. Listen for cross-component / cross-tab broadcast events
    const handleUpdate = () => {
      fetchNotifications();
    };
    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);

    // 2. Real-time polling fallback every 10 seconds
    const interval = setInterval(() => {
      if (user) fetchNotifications();
    }, 10000);

    // 3. Supabase Realtime channel if configured
    let channel: any = null;
    if (isSupabaseConfigured && supabase && user) {
      try {
        channel = supabase
          .channel(`notifications-bell-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`
            },
            () => {
              fetchNotifications();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('Supabase realtime subscription failed:', err);
      }
    }

    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, handleUpdate);
      clearInterval(interval);
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (e: React.MouseEvent, notifId: number | string) => {
    e.stopPropagation();
    try {
      await api.markNotificationRead(notifId, user.id);
      setNotifications(prev => prev.map(n => String(n.id) === String(notifId) ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await api.markAllNotificationsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      try {
        await api.markNotificationRead(notif.id, user.id);
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
      } catch (err) {
        console.warn('Mark as read error:', err);
      }
    }

    setIsOpen(false);

    if (onNavigate) {
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
      } else if (user.role === 'RECRUITER') {
        onNavigate('recruiter-dashboard');
      }
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate('notifications');
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
        className={`relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${buttonClassName}`}
      >
        <Bell className="h-5 w-5" />
        
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-rose-600 rounded-full ring-2 ring-white animate-in zoom-in-50 duration-200">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-0 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ maxWidth: 'calc(100vw - 24px)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 p-1 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-6 w-6 opacity-60" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700">No notifications yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">
                  When you register, submit applications, or receive interview updates, they'll appear here.
                </p>
              </div>
            ) : (
              notifications.slice(0, 8).map((notif) => {
                const isUnread = !notif.isRead;
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 cursor-pointer transition-colors flex items-start space-x-3 text-left group ${
                      isUnread 
                        ? 'bg-blue-50/50 hover:bg-blue-50' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Status / Category Icon */}
                    <div className={`mt-0.5 p-2 rounded-xl shrink-0 ${
                      isUnread ? 'bg-white shadow-xs border border-blue-200' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {getNotificationIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className={`text-xs truncate ${
                          isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
                        }`}>
                          {notif.title}
                        </h5>
                        <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                          {formatNotificationTime(notif.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/60">
                        <span className="text-[10px] font-medium text-blue-600 flex items-center space-x-1 group-hover:underline">
                          <span>View details</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </span>

                        {isUnread && (
                          <button
                            type="button"
                            onClick={(e) => handleMarkAsRead(e, notif.id)}
                            title="Mark as read"
                            className="text-[10px] text-slate-400 hover:text-blue-600 flex items-center space-x-0.5 px-1.5 py-0.5 rounded-sm hover:bg-white"
                          >
                            <Check className="h-3 w-3" />
                            <span>Mark read</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Unread indicator dot */}
                    {isUnread && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
            <button
              type="button"
              onClick={handleViewAll}
              className="w-full py-2 px-3 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl transition-colors"
            >
              View All Notifications ({notifications.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
