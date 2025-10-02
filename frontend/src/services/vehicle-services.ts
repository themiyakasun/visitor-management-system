import type { ParamsPayload, VehiclePayload } from '..';
import { api } from './api';

export const vehicleServices = {
  getAllVehicles: async (params: ParamsPayload) => {
    const response = await api.get('/vehicles', {
      params,
    });
    return response;
  },
  createVehicle: async (payload: VehiclePayload) => {
    const response = await api.post('/vehicles', {
      numberPlate: payload.numberPlate,
      type: payload.type,
      make: payload.make,
      model: payload.model,
      color: payload.color,
      driverId: payload.driverId,
    });
    return response;
  },
  deleteVehicle: async (id: string) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response;
  },
  updateVehicle: async ({
    id,
    payload,
  }: {
    id: string;
    payload: VehiclePayload;
  }) => {
    const response = await api.put(`/vehicles/${id}`, payload);
    return response;
  },
};
