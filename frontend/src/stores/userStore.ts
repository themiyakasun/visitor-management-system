import { create } from 'zustand';
import type { ParamsPayload, UserPayload, UserStore } from '..';
import { handleApiError } from '@/lib/error-handle';
import { userServices } from '@/services/user-services';
import { toast } from 'sonner';

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  getUsers: async (params: ParamsPayload) => {
    set({ isLoading: true });
    try {
      const response = await userServices.getUsers(params);

      set({
        users: response.data.users,
        pagination: {
          page: response.data.page,
          total: response.data.total,
          limit: response.data.pageSize,
          totalPages: response.data.totalPages,
        },
      });

      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      console.log(message);
      console.error('Full API error:', error);
      throw new Error(message);
    }
  },
  getUserById: async (id: string) => {
    set({ isLoading: true });

    try {
      const response = await userServices.getUserById(id);

      set({
        users: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      console.log(message);
      throw new Error(message);
    }
  },
  createUser: async (payload: UserPayload) => {
    set({ isLoading: true });
    try {
      const response = await userServices.createUser(payload);

      set({
        isLoading: false,
      });
      toast.success(response.data.message);
      get().getUsers({ page: 1, limit: 10, search: '' });
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  updateUser: async ({ id, payload }: { id: string; payload: UserPayload }) => {
    set({ isLoading: true });

    try {
      const response = await userServices.updateUser({ id, payload });

      set({
        isLoading: false,
      });
      toast.success(response.data.message);
      get().getUsers({ page: 1, limit: 10, search: '' });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  deleteUser: async (id: string) => {
    set({ isLoading: true });

    try {
      const response = await userServices.deleteUser(id);

      set({
        isLoading: false,
      });
      toast.success(response.data.message);
      get().getUsers({ page: 1, limit: 10, search: '' });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
}));
