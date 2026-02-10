'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  token: string | null;
  login: (tokenInfo: { accessToken: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('accessToken');
    setToken(stored);
    setIsLoading(false);
  }, []);

  const login = (tokenInfo: { accessToken: string }) => {
    setToken(tokenInfo.accessToken);
    localStorage.setItem('accessToken', tokenInfo.accessToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
