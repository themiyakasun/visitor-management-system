/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleApiError } from '@/lib/error-handle';
import { departmentSerives } from '@/services/department-services';
import { create } from 'zustand';
import type { DepartmentStore, ParamsPayload } from '..';

export const useDepartmentStore = create<DepartmentStore>((set) => ({
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
      });

      return response;
    } catch (error: any) {
      set({ isLoading: false });
      const message = handleApiError(error);
      console.log(message);
      throw new Error(message);
    }
  },
}));
