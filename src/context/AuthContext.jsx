import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { signInWithGoogle } from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check token on startup
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('avon_token');
      const cachedUser = localStorage.getItem('avon_user');
      
      if (token && cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
          setIsAuthenticated(true);
        } catch (e) {
          console.warn('Failed to parse cached user settings:', e);
        }
      }

      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        localStorage.setItem('avon_user', JSON.stringify(userData));
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Invalid token or session expired', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('avon_token', data.token);
      localStorage.setItem('avon_user', JSON.stringify(data));
      setUser({
        id: data._id || data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        avatarUrl: data.avatarUrl
      });
      setIsAuthenticated(true);
      return { success: true, role: data.role };
    } catch (err) {
      console.error('Login service failure:', err);
      const errorMsg = err.response?.data?.message || 'Connection to authentication service failed.';
      return { success: false, message: errorMsg };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const data = await authService.register(name, email, password, role);
      localStorage.setItem('avon_token', data.token);
      localStorage.setItem('avon_user', JSON.stringify(data));
      setUser({
        id: data._id || data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        avatarUrl: data.avatarUrl
      });
      setIsAuthenticated(true);
      return { success: true, role: data.role };
    } catch (err) {
      console.error('Registration service failure:', err);
      const errorMsg = err.response?.data?.message || 'Registration failed.';
      return { success: false, message: errorMsg };
    }
  };

  const loginWithGoogle = async (selectedRole = 'Employee') => {
    try {
      const googleResult = await signInWithGoogle();
      if (!googleResult.success) {
        return { success: false, message: 'Google authentication was cancelled.' };
      }

      const payload = {
        name: googleResult.user.name,
        email: googleResult.user.email,
        googleId: googleResult.user.googleId,
        avatarUrl: googleResult.user.avatarUrl,
        role: selectedRole
      };

      const data = await authService.loginGoogle(payload);
      localStorage.setItem('avon_token', data.token);
      localStorage.setItem('avon_user', JSON.stringify(data));
      setUser({
        id: data._id || data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        avatarUrl: data.avatarUrl
      });
      setIsAuthenticated(true);
      return { success: true, role: data.role };
    } catch (err) {
      console.error('Google login backend sync failed:', err);
      const errorMsg = err.response?.data?.message || 'Failed to sync Google account details with server.';
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('avon_token');
    localStorage.removeItem('avon_user');
  };

  const updateUserProfile = (updatedData) => {
    const nextUser = user ? { ...user, ...updatedData } : updatedData;
    setUser(nextUser);
    localStorage.setItem('avon_user', JSON.stringify(nextUser));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, loginWithGoogle, logout, updateUserProfile, loading }}>
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
