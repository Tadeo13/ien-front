import { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { Usuario } from '../types/api.types';
import { authService } from '../services/auth.service';
import { clearSession } from '../services/api';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function saveUser(user: Usuario) {
  localStorage.setItem('usuario', JSON.stringify(user));
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const sessionRevision = useRef(0);

  const setUserData = useCallback((userData: Usuario | null) => {
    setUser(userData);
    if (userData) {
      saveUser(userData);
    }
  }, []);

  useEffect(() => {
    const onExpired = () => {
      sessionRevision.current += 1;
      setUser(null);
      setIsAuthenticated(false);
    };
    window.addEventListener('ien:session-expired', onExpired);
    return () => window.removeEventListener('ien:session-expired', onExpired);
  }, []);

  useEffect(() => {
    let active = true;
    const revision = sessionRevision.current;
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            await authService.refresh();
          } else {
            setIsLoading(false);
            return;
          }
        }
        try {
          const profile = await authService.getProfile();
          if (active && revision === sessionRevision.current) setUserData(profile);
        } catch (error: any) {
          if (error.response?.status === 401 || !localStorage.getItem('access_token')) throw error;
          const storedUser = localStorage.getItem('usuario');
          if (storedUser) {
            if (active && revision === sessionRevision.current) setUser(JSON.parse(storedUser));
          } else {
            throw new Error('No user data');
          }
        }
        if (active && revision === sessionRevision.current && localStorage.getItem('access_token')) setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth initialization error', error);
        if (active && revision === sessionRevision.current) clearSession();
      } finally {
        if (active) setIsLoading(false);
      }
    };

    checkAuth();
    return () => { active = false; };
  }, [setUserData]);

  const login = async (data: any) => {
    sessionRevision.current += 1;
    const response = await authService.login(data);
    if (response.usuario) {
      setUserData(response.usuario);
    }
    setIsAuthenticated(true);
  };

  const register = async (data: any) => {
    sessionRevision.current += 1;
    const response = await authService.register(data);
    if (response.usuario) {
      setUserData(response.usuario);
    }
    setIsAuthenticated(true);
  };

  const logout = async () => {
    sessionRevision.current += 1;
    setUser(null);
    setIsAuthenticated(false);
    try {
      await authService.logout();
    } catch (e) {
      console.error(e);
    }
  };

  const isAdmin = user?.rol === 'admin_general' || user?.rol === 'admin_negocio' || user?.rol === 'moderador_tienda';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, isAdmin, login, register, logout }}>
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
