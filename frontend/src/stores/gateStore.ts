import { create } from 'zustand';
import type {
  ActiveTimeParamsPayload,
  GateActionPayload,
  GatelogStore,
  ParamsPayload,
} from '..';
import { handleApiError } from '@/lib/error-handle';
import { toast } from 'sonner';
import { gateServices } from '@/services/gate-serivces';

export const useGateStore = create<GatelogStore>((set, get) => ({
  gatelogs: [],
  inOutReport: [],
  isLoading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  recordGateAction: async (payload: GateActionPayload) => {
    set({ isLoading: false });
    try {
      const response = await gateServices.recordGateAction(payload);
      set({ isLoading: true });
      get().getTodayActivity({ page: 1, limit: 10, search: '' });
      toast.success(response.data.message);
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  getTodayActivity: async (params: ParamsPayload) => {
    set({ isLoading: true });
    try {
      const response = await gateServices.getTodayActivity(params);
      set({
        isLoading: false,
        gatelogs: response.data.activity,
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
  getAllActivity: async (params: ParamsPayload) => {
    set({ isLoading: true });

    try {
      const response = await gateServices.getAllActivity(params);
      set({
        gatelogs: response.data.activity,
        pagination: {
          page: response.data.page,
          total: response.data.total,
          limit: response.data.pageSize,
          totalPages: response.data.totalPages,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      console.log(message);
      throw new Error(message);
    }
  },
  generateActiveReport: async (params: ActiveTimeParamsPayload) => {
    set({ isLoading: true });

    try {
      const response = await gateServices.generateActiveReport(params);
      if (params.format === 'json') {
        set({
          isLoading: false,
          gatelogs: response.data.gateLogs,
          pagination: {
            page: response.data.page,
            total: response.data.total,
            limit: response.data.pageSize,
            totalPages: response.data.totalPages,
          },
        });
      } else if (params.format === 'pdf') {
        set({ isLoading: false });
      }

      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      console.log(message);
      throw new Error(message);
    }
  },
  generateInOutReport: async (params: ActiveTimeParamsPayload) => {
    set({ isLoading: true });
    try {
      const response = await gateServices.generateInOutReport(params);
      console.log(response);
      if (params.format === 'json') {
        set({
          isLoading: false,
          inOutReport: response.data.report,
          pagination: {
            page: response.data.page,
            total: response.data.total,
            limit: response.data.pageSize,
            totalPages: response.data.totalPages,
          },
        });
      } else if (params.format === 'pdf') {
        set({ isLoading: false });
      }

      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      console.log(message);
      throw new Error(message);
    }
  },
}));
