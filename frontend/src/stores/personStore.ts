import { create } from 'zustand';
import type { ParamsPayload, PersonPayload, PersonStore } from '..';
import { handleApiError } from '@/lib/error-handle';
import { personServices } from '@/services/person-services';
import { toast } from 'sonner';

export const usePersonStore = create<PersonStore>((set, get) => ({
  persons: [],
  isLoading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  getAllPersons: async (params: ParamsPayload) => {
    set({ isLoading: true });

    try {
      const response = await personServices.getAllPersons(params);
      set({
        persons: response.data.persons,
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
      throw new Error(message);
    }
  },
  createPerson: async (payload: PersonPayload) => {
    set({ isLoading: true });
    try {
      const response = await personServices.createPerson(payload);
      set({
        isLoading: false,
      });
      toast.success(response.data.message);
      get().getAllPersons({ page: 1, limit: 10, search: '' });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  deletePerson: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await personServices.deletePerson(id);
      set({
        isLoading: false,
      });
      toast.success(response.data.message);
      get().getAllPersons({ page: 1, limit: 10, search: '' });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
}));
