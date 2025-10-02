import { create } from 'zustand';
import type {
  ActiveTimeParamsPayload,
  AppointmentPayload,
  AppointmentStore,
  AppointmentUpdatePayload,
  ParamsPayload,
} from '..';
import { appointmentServices } from '@/services/appointment-services';
import { handleApiError } from '@/lib/error-handle';
import { toast } from 'sonner';

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: [],
  isLoading: false,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  getAllAppointments: async (params: ParamsPayload) => {
    set({ isLoading: true });

    try {
      const response = await appointmentServices.getAllAppointments(params);
      set({
        appointments: response.data.appointments,
        isLoading: false,
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
  createAppointment: async (payload: AppointmentPayload) => {
    set({ isLoading: true });
    try {
      const response = await appointmentServices.createAppointment(payload);

      set({
        isLoading: false,
      });
      toast.success(response.data.message);
      get().getAllAppointments({ page: 1, limit: 10, search: '' });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  updateAppointment: async ({
    id,
    payload,
  }: {
    payload: AppointmentUpdatePayload;
    id: string;
  }) => {
    set({ isLoading: true });

    try {
      const response = await appointmentServices.updateAppointment({
        payload,
        id,
      });
      set({
        isLoading: false,
      });
      toast.success(response.data.message);
      get().getAllAppointments({ page: 1, limit: 10, search: '' });
      return response;
    } catch (error) {
      set({ isLoading: false });
      const message = handleApiError(error);
      toast.error(message);
      throw new Error(message);
    }
  },
  generateAppointmentsReport: async (params: ActiveTimeParamsPayload) => {
    set({ isLoading: true });

    try {
      const response = await appointmentServices.generateAppointmentsReport(
        params
      );
      if (params.format === 'json') {
        set({
          isLoading: false,
          appointments: response.data.appointments,
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
