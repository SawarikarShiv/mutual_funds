import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getProfile, logout } from '../redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const {
    user,
    token,
    loading,
    error,
    isAuthenticated,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [token, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const hasRole = (role) => {
    return user?.roles?.includes(role) || user?.isAdmin;
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission);
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    logout: handleLogout,
    hasRole,
    hasPermission,
  };
};