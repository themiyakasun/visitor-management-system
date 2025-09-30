import type {
  AppointmentPayload,
  AppointmentUpdatePayload,
  ParamsPayload,
} from '..';
import { api } from './api';

export const appointmentServices = {
  getAllAppointments: async (params: ParamsPayload) => {
    const response = await api.get('/appointments', {
      params,
    });
    return response;
  },
  createAppointment: async (payload: AppointmentPayload) => {
    const response = await api.post('/appointments', {
      datetime: payload.datetime,
      purpose: payload.purpose,
      expectedDuration: payload.expectedDuration,
      visitorId: payload.visitorId,
      employeeId: payload.employeeId,
    });
    return response;
  },
  updateAppointment: async ({
    payload,
    id,
  }: {
    payload: AppointmentUpdatePayload;
    id: string;
  }) => {
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v != null && v !== '')
    );
    const response = await api.patch(`/appointments/${id}`, filteredPayload);
    return response;
  },
};
