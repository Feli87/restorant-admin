import { useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';
import { disconnectSocket } from '../socket/socket';

export const useAuth = () => {
  const { user, token, isAuthenticated, login: setAuth, logout: clearAuth } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authService.login({ email, password });
      setAuth(
        { ...response.user, isActive: true, createdAt: '', updatedAt: '' },
        response.access_token,
      );
      return response;
    },
    [setAuth],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await authService.register({ name, email, password });
      setAuth(
        { ...response.user, isActive: true, createdAt: '', updatedAt: '' },
        response.access_token,
      );
      return response;
    },
    [setAuth],
  );

  const logout = useCallback(() => {
    disconnectSocket();
    clearAuth();
  }, [clearAuth]);

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  };
};
