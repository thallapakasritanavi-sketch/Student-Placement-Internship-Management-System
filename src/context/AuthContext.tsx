import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<UserProfile>;
  signUp: (params: { email: string; password?: string; role: UserRole; fullName: string; branch?: string; cgpa?: number; companyName?: string }) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  demoLogin: (role: UserRole) => Promise<UserProfile>;
  updateCurrentUser: (updates: Partial<UserProfile>) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_SESSION_KEY = 'spims_active_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile = await api.getProfile(session.user.id);
            if (profile) {
              setUser(profile);
              setLoading(false);
              return;
            }
          }
        }
        
        // Check active local user session
        const stored = localStorage.getItem(CURRENT_USER_SESSION_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const currentProfile = await api.getProfile(parsed.id);
          if (currentProfile) {
            setUser(currentProfile);
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const signIn = async (email: string, password?: string): Promise<UserProfile> => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase && password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data.user) {
          const profile = await api.getProfile(data.user.id);
          if (profile) {
            setUser(profile);
            localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(profile));
            return profile;
          }
        }
      }

      // Check fallback mock database
      const allProfiles = await api.getAllProfiles();
      const cleanEmail = email.trim().toLowerCase();
      
      // Match by exact email or "sri" for admin
      const matched = allProfiles.find(p => 
        p.email.toLowerCase() === cleanEmail || 
        (cleanEmail === 'sri' && p.role === 'ADMIN')
      );

      if (!matched) {
        throw new Error('User not found. Use demo login or create a new account.');
      }

      setUser(matched);
      localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(matched));
      return matched;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (params: {
    email: string;
    password?: string;
    role: UserRole;
    fullName: string;
    branch?: string;
    cgpa?: number;
    companyName?: string;
  }): Promise<UserProfile> => {
    setLoading(true);
    try {
      let userId = `user-${Date.now()}`;

      if (isSupabaseConfigured && supabase && params.password) {
        const { data, error } = await supabase.auth.signUp({
          email: params.email,
          password: params.password,
          options: {
            data: {
              role: params.role,
              fullName: params.fullName
            }
          }
        });
        if (error) throw error;
        if (data.user) {
          userId = data.user.id;
        }
      }

      const newProfile: UserProfile = {
        id: userId,
        email: params.email,
        role: params.role,
        fullName: params.fullName,
        branch: params.branch,
        cgpa: params.cgpa,
        companyName: params.companyName,
        createdAt: new Date().toISOString()
      };

      if (isSupabaseConfigured && supabase) {
        await supabase.from('profiles').insert([newProfile]);
      }

      setUser(newProfile);
      localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(newProfile));
      return newProfile;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(CURRENT_USER_SESSION_KEY);
  };

  const demoLogin = async (role: UserRole): Promise<UserProfile> => {
    const all = await api.getAllProfiles();
    let demoUser: UserProfile | undefined;

    if (role === 'ADMIN') {
      demoUser = all.find(p => p.role === 'ADMIN');
    } else if (role === 'RECRUITER') {
      demoUser = all.find(p => p.role === 'RECRUITER');
    } else {
      demoUser = all.find(p => p.role === 'STUDENT');
    }

    if (!demoUser) throw new Error(`Demo ${role} account unavailable`);

    setUser(demoUser);
    localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(demoUser));
    return demoUser;
  };

  const updateCurrentUser = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    if (!user) throw new Error('No active user');
    const updated = await api.updateProfile(user.id, updates);
    setUser(updated);
    localStorage.setItem(CURRENT_USER_SESSION_KEY, JSON.stringify(updated));
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, demoLogin, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
