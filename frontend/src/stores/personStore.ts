/* eslint-disable @typescript-eslint/no-explicit-any */
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
  filters: {
    search: '',
    type: 'all',
  },

  getAllPersons: async (params?: ParamsPayload) => {
    const { pagination, filters } = get();
    set({ isLoading: true });

    const query: ParamsPayload = {
      page: params?.page ?? pagination.page,
      limit: params?.limit ?? pagination.limit,
      search: params?.search ?? filters.search,
      type: params?.type ?? filters.type,
    };

    set({ isLoading: true });

    try {
      const response = await personServices.getAllPersons(query);

      set({
        persons: response.data.persons,
        pagination: {
          page: response.data.page,
          total: response.data.total,
          limit: response.data.pageSize,
          totalPages: response.data.totalPages,
        },
        filters: {
          search: query.search ?? '',
          type: query.type ?? 'all',
        },
        isLoading: false,
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
      toast.success(response.data.message);
      get().getAllPersons();
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
      toast.success(response.data.message);
      get().getAllPersons();
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  updatePerson: async ({
    id,
    payload,
  }: {
    id: string;
    payload: PersonPayload;
  }) => {
    set({ isLoading: true });
    try {
      const response = await personServices.updatePerson({ id, payload });
      toast.success(response.data.message);
      get().getAllPersons();
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  bulkUploadPersons: async (file: File) => {
    set({ isLoading: true });

    try {
      const response = await personServices.bulkUpload(file);

      if (response.data.errors && response.data.errors.length > 0) {
        response.data.errors.forEach(
          (error: { row: number; error: string }) => {
            toast.error(`Row ${error.row}: ${error.error}`);
          }
        );
      }
      toast.success(response.data.message);
      get().getAllPersons();
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
}));
