import { create } from 'zustand';
import type { ParamsPayload, VehiclePayload, VehicleStore } from '..';
import { handleApiError } from '@/lib/error-handle';
import { vehicleServices } from '@/services/vehicle-services';
import { toast } from 'sonner';

export const useVehicleStore = create<VehicleStore>((set, get) => ({
  vehicles: [],
  isLoading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  getAllVehicles: async (params: ParamsPayload) => {
    set({ isLoading: true });

    try {
      const response = await vehicleServices.getAllVehicles(params);
      set({
        vehicles: response.data.vehicles,
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
  createVehicle: async (payload: VehiclePayload) => {
    set({ isLoading: true });

    try {
      const response = await vehicleServices.createVehicle(payload);

      set({ isLoading: false });
      toast.success(response.data.message);
      get().getAllVehicles({ page: 1, limit: 10, search: '' });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  deleteVehicle: async (id: string) => {
    set({ isLoading: true });

    try {
      const response = await vehicleServices.deleteVehicle(id);
      set({ isLoading: false });
      get().getAllVehicles({ page: 1, limit: 10, search: '' });
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
