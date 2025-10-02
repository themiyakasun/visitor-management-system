import { create } from 'zustand';
import type { RolePayload, RoleStore } from '..';
import { handleApiError } from '@/lib/error-handle';
import { roleServices } from '@/services/role-serives';
import { toast } from 'sonner';

export const useRoleStore = create<RoleStore>((set, get) => ({
  roles: [],
  isLoading: false,
  getAllRoles: async () => {
    set({ isLoading: true });

    try {
      const response = await roleServices.getAllRoles();

      set({
        roles: response.data,
        isLoading: false,
      });

      return response;
      set({});
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      console.log(message);
      throw new Error(message);
    }
  },
  createRole: async (values: RolePayload) => {
    set({ isLoading: true });
    try {
      const response = await roleServices.createRole(values);

      set({
        isLoading: false,
      });
      get().getAllRoles();
      toast.success(response.data.message);
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  getRoleById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await roleServices.getRolesById(id);

      set({
        isLoading: false,
        roles: response.data.role,
      });

      return response;
    } catch (error) {
      set({ isLoading: true });
      const message = handleApiError(error);
      throw new Error(message);
    }
  },
  updateRole: async ({ values, id }: { values: RolePayload; id: string }) => {
    set({ isLoading: true });
    try {
      const response = await roleServices.updateRole({
        payload: values,
        id: id,
      });

      set({
        isLoading: false,
      });
      toast.success(response.data.message);
      get().getAllRoles();
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      throw new Error(message);
    }
  },
  deleteRole: async (id: string) => {
    set({ isLoading: true });

    try {
      const response = await roleServices.deleteRole(id);

      set({
        isLoading: false,
      });

      get().getAllRoles();
      toast.success(response.data.message);
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      throw new Error(message);
    }
  },
}));
