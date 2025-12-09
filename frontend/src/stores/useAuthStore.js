import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  fetchUser: async () => {
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    set({ user: response.data, isAuthenticated: true });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    set({ user: response.data, isAuthenticated: true });
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    set({ user: response.data });
    return response.data;
  },
}));

export default useAuthStore;
