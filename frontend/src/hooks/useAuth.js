import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser, setLoading, setError } from '../redux/slices/authSlice';
import AuthService from '../services/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [authLoading, setAuthLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    dispatch(setLoading(true));
    
    try {
      const user = await AuthService.login(email, password);
      dispatch(setUser({ user, token: AuthService.getToken() }));
      return user;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }, [dispatch]);

  const register = useCallback(async (userData) => {
    setAuthLoading(true);
    dispatch(setLoading(true));
    
    try {
      const user = await AuthService.register(userData);
      dispatch(setUser({ user, token: AuthService.getToken() }));
      return user;
    } catch (err) {
      dispatch(setError(err.message));
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      dispatch(clearUser());
    }
  }, [dispatch]);

  const updateProfile = useCallback((updates) => {
    dispatch(updateUser(updates));
    // Update localStorage
    const currentUser = AuthService.getCurrentUser();
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updates }));
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading: loading || authLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };
};