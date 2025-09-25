import type { ChangePasswordPayload, LoginPayload } from '..';
import { api } from './api';

export const authService = {
  loginService: async (payload: LoginPayload) => {
    const response = await api.post('/auth/login', payload);
    return response.data;
  },

  changePasswordService: async (payload: ChangePasswordPayload) => {
    const response = await api.post('/auth/change-password', payload);
    return response.data;
  },

  setAuthToken: (token: string) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    }
  },

  removeAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  },

  initializeToken: () => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
};
