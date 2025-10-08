import { create } from 'zustand';
import { toast } from 'sonner';
import { tenantServices } from '@/services/tenant-services';
import { handleApiError } from '@/lib/error-handle';
import type { TenantPayload, ParamsPayload, TenantStore } from '..';

export const useTenantStore = create<TenantStore>((set, get) => ({
  tenants: [],
  isLoading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  getAllTenants: async (params: ParamsPayload) => {
    set({ isLoading: true });
    try {
      const response = await tenantServices.getTenants(params);
      set({
        tenants: response.data.tenants,
        pagination: {
          page: response.data.page,
          total: response.data.total,
          limit: response.data.pageSize,
          totalPages: response.data.totalPages,
        },
        isLoading: false,
      });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },

  createTenant: async (values: TenantPayload) => {
    set({ isLoading: true });
    try {
      const response = await tenantServices.createTenant(values);
      toast.success(response.data.message);
      get().getAllTenants({ page: 1, limit: 10, search: '' });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },

  updateTenant: async ({
    id,
    payload,
  }: {
    id: string;
    payload: TenantPayload;
  }) => {
    set({ isLoading: true });
    try {
      const response = await tenantServices.updateTenant({ id, payload });
      toast.success(response.data.message);
      get().getAllTenants({ page: 1, limit: 10, search: '' });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },

  deleteTenant: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await tenantServices.deleteTenant(id);
      toast.success(response.data.message);
      get().getAllTenants({ page: 1, limit: 10, search: '' });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },

  getTenantById: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await tenantServices.getTenantById(id);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      throw new Error(message);
    }
  },
}));
