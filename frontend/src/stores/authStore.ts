/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/auth-services';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/error-handle';
import type { AuthStore, ChangePasswordPayload, LoginPayload } from '..';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: false,

      login: async (values: LoginPayload) => {
        set({ isLoading: true });
        try {
          const data = await authService.loginService(values);

          const userObj = {
            id: data.data.user.id,
            name: data.data.user.name,
            email: data.data.user.email,
          };

          set({
            user: userObj,
            token: data.data.token,
            permissions: data.data.user.permissions,
            isLoading: false,
            isAuthenticated: true,
          });

          localStorage.setItem('token', data.data.token);
          authService.setAuthToken(data.data.token);

          toast.success(data.message);
          return data;
        } catch (error: any) {
          const message = handleApiError(error);
          toast.error(message);
          throw new Error(message);
        }
      },

      logout: async () => {
        set({
          user: null,
          token: null,
          permissions: [],
          isAuthenticated: false,
          isLoading: false,
        });

        localStorage.removeItem('token');
        authService.removeAuthToken();
      },

      initializeAuth: async () => {
        const token = localStorage.getItem('token');

        if (token) {
          authService.setAuthToken(token);
          set({ token, isLoading: true });
        }
      },

      changePassword: async (values: ChangePasswordPayload) => {
        set({ isLoading: true });
        try {
          const response = await authService.changePasswordService(values);

          set({
            isLoading: false,
          });

          toast.success(response.message);
          await get().logout();

          return response;
        } catch (error) {
          const message = handleApiError(error);
          toast.error(message);
          throw new Error(message);
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
