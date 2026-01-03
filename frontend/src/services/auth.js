import { authAPI } from './api';
import { setUser, clearUser } from '../redux/slices/authSlice';
import store from '../redux/store';

class AuthService {
  static async login(email, password) {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response;
      
      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update Redux store
      store.dispatch(setUser({ user, token }));
      
      return user;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  static async register(userData) {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response;
      
      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update Redux store
      store.dispatch(setUser({ user, token }));
      
      return user;
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  static async logout() {
    try {
      await authAPI.logout();
    } finally {
      this.clearAuth();
    }
  }

  static clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    store.dispatch(clearUser());
  }

  static getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static async verifyToken() {
    try {
      const response = await authAPI.verifyToken();
      return response.valid;
    } catch (error) {
      this.clearAuth();
      return false;
    }
  }

  static async forgotPassword(email) {
    try {
      await authAPI.forgotPassword(email);
      return true;
    } catch (error) {
      throw new Error(error.message || 'Password reset request failed');
    }
  }

  static async resetPassword(token, password) {
    try {
      await authAPI.resetPassword({ token, password });
      return true;
    } catch (error) {
      throw new Error(error.message || 'Password reset failed');
    }
  }
}

export default AuthService;