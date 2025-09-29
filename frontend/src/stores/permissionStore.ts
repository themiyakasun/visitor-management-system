import { create } from 'zustand';
import type {
  PermissionPayload,
  PermissionStore,
  RolePermissionPayload,
  UserPermissionPayload,
} from '..';
import { handleApiError } from '@/lib/error-handle';
import { toast } from 'sonner';
import { permissionService } from '@/services/permission-services';

export const usePermissionStore = create<PermissionStore>((set, get) => ({
  permissions: [],
  isLoading: false,
  getAllPermissions: async () => {
    set({ isLoading: true });
    try {
      const response = await permissionService.getAllPermissions();
      set({ permissions: response.data, isLoading: false });
      console.log(response);
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  createPermission: async (payload: PermissionPayload) => {
    set({ isLoading: true });
    try {
      const response = await permissionService.createPermission(payload);
      toast.success(response.data.message);
      get().getAllPermissions();
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  updatePermission: async ({
    id,
    payload,
  }: {
    id: number;
    payload: PermissionPayload;
  }) => {
    set({ isLoading: true });
    try {
      const response = await permissionService.updatePermission({
        id,
        payload,
      });
      toast.success(response.data.message);
      get().getAllPermissions();
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  deletePermission: async (id: number) => {
    set({ isLoading: true });
    try {
      const response = await permissionService.deletePermission(id);
      toast.success(response.data.message);
      get().getAllPermissions();
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  assignRolePermissions: async (payload: RolePermissionPayload) => {
    set({ isLoading: true });
    try {
      const response = await permissionService.assignRolePermissions(payload);
      set({ isLoading: false });
      toast.success(response.data.message);
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  assignUserPermissions: async (payload: UserPermissionPayload) => {
    set({ isLoading: true });
    try {
      const response = await permissionService.assignUserPermissions(payload);
      set({ isLoading: false });
      toast.success(response.data.message);
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  removeUserPermissions: async (payload: UserPermissionPayload) => {
    set({ isLoading: true });
    try {
      const response = await permissionService.removeUserPermission(payload);
      set({ isLoading: false });
      toast.success(response.data.message);
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  removeRolePermissions: async (payload: RolePermissionPayload) => {
    set({ isLoading: true });
    try {
      const response = await permissionService.removeRolePermission(payload);
      set({ isLoading: false });
      toast.success(response.data.message);
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
}));
