import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY } from '../config/storageKeys';
import { validateAccessToken, refreshAccessToken, clearStoredTokens } from '../services/tokenService';

export type AuthUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  role?: string;
  [key: string]: any;
};

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export type AuthContextType = AuthState & {
  login: (accessToken: string, refreshToken: string, user: AuthUser) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      const at = localStorage.getItem(ACCESS_TOKEN_KEY);
      const rt = localStorage.getItem(REFRESH_TOKEN_KEY);
      const u = localStorage.getItem(USER_KEY);

      if (at) {
        const validation = await validateAccessToken(at);
        if (validation.valid) {
          setAccessToken(at);
          if (rt) setRefreshToken(rt);
          if (u) {
            try { setUser(JSON.parse(u)); } catch {}
          }
        } else if (rt) {
          const newTokens = await refreshAccessToken(rt);
          if (newTokens) {
            localStorage.setItem(ACCESS_TOKEN_KEY, newTokens.access_token);
            localStorage.setItem(REFRESH_TOKEN_KEY, newTokens.refresh_token);
            setAccessToken(newTokens.access_token);
            setRefreshToken(newTokens.refresh_token);
            if (u) {
              try { setUser(JSON.parse(u)); } catch {}
            }
          } else {
            clearStoredTokens();
          }
        } else {
          clearStoredTokens();
        }
      }
      setIsLoading(false);
    };

    init();
  }, []);

  useEffect(() => {
    const handleAuthLogout = () => {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    };
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, []);

  const login = (at: string, rt: string, u: AuthUser) => {
    setAccessToken(at);
    setRefreshToken(rt);
    setUser(u);
    localStorage.setItem(ACCESS_TOKEN_KEY, at);
    localStorage.setItem(REFRESH_TOKEN_KEY, rt);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const updateTokens = (at: string, rt: string) => {
    setAccessToken(at);
    setRefreshToken(rt);
    localStorage.setItem(ACCESS_TOKEN_KEY, at);
    localStorage.setItem(REFRESH_TOKEN_KEY, rt);
  };

  const setLoadingState = (loading: boolean) => {
    setIsLoading(loading);
  };

  const isAuthenticated = !!(accessToken && user);

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      updateTokens,
      setLoading: setLoadingState,
    }),
    [accessToken, refreshToken, user, isLoading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
