import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { User, HistoryItem, AnalysisResult } from '../types';
import { getUserHistory, HistoryItemResponse } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  refreshHistory: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase: SupabaseClient | null = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          loadUserFromSession(session.user);
        } else {
          setIsLoading(false);
        }
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          loadUserFromSession(session.user);
        } else {
          setUser(null);
          setHistory([]);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Fallback to localStorage if Supabase is not configured
      const storedUser = localStorage.getItem('dc_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        loadHistoryFromBackend(parsedUser.id || parsedUser.email);
      }
      setIsLoading(false);
    }
  }, []);

  const loadUserFromSession = async (supabaseUser: SupabaseUser) => {
    const userData: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
    };
    setUser(userData);
    localStorage.setItem('dc_user', JSON.stringify(userData));
    await loadHistoryFromBackend(supabaseUser.id);
    setIsLoading(false);
  };

  const loadHistoryFromBackend = async (userId: string) => {
    try {
      const backendHistory = await getUserHistory(userId);
      const formattedHistory: HistoryItem[] = backendHistory.map((item: HistoryItemResponse) => {
        const medicalAdvice = typeof item.medical_advice === 'string' 
          ? JSON.parse(item.medical_advice) 
          : item.medical_advice;

        const validateDiagnosis = (diagnosis: string): 'Monkeypox' | 'Chickenpox' | 'Measles' | 'Normal' => {
          const validDiagnoses: ('Monkeypox' | 'Chickenpox' | 'Measles' | 'Normal')[] = 
            ['Monkeypox', 'Chickenpox', 'Measles', 'Normal'];
          
          if (validDiagnoses.includes(diagnosis as any)) {
            return diagnosis as 'Monkeypox' | 'Chickenpox' | 'Measles' | 'Normal';
          }
          
          return 'Normal'; // Default fallback
        };

        const result: AnalysisResult = {
          diagnosis: validateDiagnosis(item.diagnosis),
          assessment: medicalAdvice.assessment || '',
          keyFeatures: medicalAdvice.key_features || [],
          recommendations: medicalAdvice.recommendations || [],
          confidenceScore: item.confidence,
        };

        return {
          id: item.id,
          date: item.created_at,
          result,
          imageUrl: item.image_url,
        };
      });
      setHistory(formattedHistory);
    } catch (error) {
      console.error('Failed to load history:', error);
      setHistory([]);
    }
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    if (!supabase) {
      // Fallback to localStorage
      const usersDb = JSON.parse(localStorage.getItem('dc_users_db') || '[]');
      const foundUser = usersDb.find((u: User) => u.email === email && u.password === pass);
      
      if (foundUser) {
        const { password, ...safeUser } = foundUser;
        setUser(safeUser);
        localStorage.setItem('dc_user', JSON.stringify(safeUser));
        await loadHistoryFromBackend(safeUser.id || safeUser.email);
        return true;
      }
      return false;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) throw error;
      if (data.user) {
        await loadUserFromSession(data.user);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      // Fallback to localStorage
      const usersDb = JSON.parse(localStorage.getItem('dc_users_db') || '[]');
      if (usersDb.find((u: User) => u.email === email)) {
        return { success: false, error: "User already exists with this email." };
      }
      
      const newUser: User = { 
        id: Math.random().toString(36).substring(2, 15),
        name, 
        email, 
        password: pass 
      };
      usersDb.push(newUser);
      localStorage.setItem('dc_users_db', JSON.stringify(usersDb));
      
      const { password, ...safeUser } = newUser;
      setUser(safeUser);
      localStorage.setItem('dc_user', JSON.stringify(safeUser));
      setHistory([]);
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name,
            name: name,
          },
        },
      });

      if (error) {
        // Handle specific Supabase errors
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          return { success: false, error: "User already exists with this email." };
        }
        if (error.message.includes('Password')) {
          return { success: false, error: error.message };
        }
        if (error.message.includes('email')) {
          return { success: false, error: "Invalid email address." };
        }
        return { success: false, error: error.message || "Registration failed. Please try again." };
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        // User created but needs to confirm email
        return { 
          success: false, 
          error: "Please check your email to confirm your account before signing in." 
        };
      }

      if (data.user) {
        await loadUserFromSession(data.user);
        return { success: true };
      }
      
      return { success: false, error: "Registration failed. Please try again." };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || "An unexpected error occurred. Please try again." 
      };
    }
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setHistory([]);
    localStorage.removeItem('dc_user');
  };

  const addToHistory = (item: HistoryItem) => {
    // History is now managed by the backend, so we refresh it
    if (user) {
      refreshHistory();
    }
  };

  const refreshHistory = async () => {
    if (user?.id) {
      await loadHistoryFromBackend(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading, 
      history, 
      addToHistory,
      refreshHistory 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};