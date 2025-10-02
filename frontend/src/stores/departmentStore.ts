/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleApiError } from '@/lib/error-handle';
import { departmentSerives } from '@/services/department-services';
import { create } from 'zustand';
import type { DepartmentPayload, DepartmentStore, ParamsPayload } from '..';
import { toast } from 'sonner';

export const useDepartmentStore = create<DepartmentStore>((set, get) => ({
  departments: [],
  isLoading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  getAllDepartments: async (params: ParamsPayload) => {
    set({ isLoading: true });

    try {
      const response = await departmentSerives.getDepartments(params);
      set({
        departments: response.data.departments,
        pagination: {
          page: response.data.page,
          total: response.data.total,
          limit: response.data.pageSize,
          totalPages: response.data.totalPages,
        },
        isLoading: false,
      });

      return response;
    } catch (error: any) {
      set({ isLoading: false });
      const message = handleApiError(error);
      console.log(message);
      throw new Error(message);
    }
  },

  getDepartmentReport: async (id: string) => {
    set({ isLoading: true });

    try {
      const response = await departmentSerives.getDepartmentReport(id);
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      throw new Error(message);
    }
  },

  getAllDepartmentsReport: async () => {
    set({ isLoading: true });
    try {
      const response = await departmentSerives.getAllDepartmentReports();
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      throw new Error(message);
    }
  },

  createDepartment: async (values: DepartmentPayload) => {
    set({ isLoading: true });

    try {
      const response = await departmentSerives.createDepartment(values);
      toast.success(response.data.message);
      get().getAllDepartments({ page: 1, limit: 10, search: '' });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },

  deleteDepartment: async (id: string) => {
    set({ isLoading: true });

    try {
      const response = await departmentSerives.deleteDepartment(id);
      toast.success(response.data.message);
      get().getAllDepartments({ page: 1, limit: 10, search: '' });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },

  updateDepartment: async ({
    id,
    payload,
  }: {
    id: string;
    payload: DepartmentPayload;
  }) => {
    set({ isLoading: true });
    try {
      const response = await departmentSerives.updateDepartment({
        id,
        payload,
      });
      toast.success(response.data.message);
      get().getAllDepartments({ page: 1, limit: 10, search: '' });
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
}));
