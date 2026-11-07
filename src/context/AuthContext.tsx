import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, RegisterData } from '../types';
import { PRESET_USERS } from '../campusData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (regNo: string, password: string, role?: 'student' | 'admin') => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchUser: (user: User) => void;
  availablePresetUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_TOKEN = 'campus_retriever_token';
const STORAGE_KEY_USER = 'campus_retriever_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start with null user so the FIRST PAGE is ALWAYS the Login Portal on fresh launch
  const [user, setUser] = useState<User | null>(() => {
    // Clear any stale persistent storage on fresh webapp launch
    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      sessionStorage.clear();
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }, [token]);

  const login = async (regNo: string, password: string, role?: 'student' | 'admin') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_number: regNo, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }

      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during sign in' };
    }
  };

  const register = async (registerData: RegisterData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Account creation failed' };
      }

      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during account registration' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const switchUser = (newUser: User) => {
    setUser(newUser);
    setToken(newUser.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        switchUser,
        availablePresetUsers: PRESET_USERS,
      }}
    >
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
