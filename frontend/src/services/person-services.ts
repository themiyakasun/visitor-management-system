import type { ParamsPayload, PersonPayload } from '..';
import { api } from './api';

export const personServices = {
  getAllPersons: async (params: ParamsPayload) => {
    const response = await api.get(`/persons/${params.type}`, {
      params,
    });
    return response;
  },
  createPerson: async (payload: PersonPayload) => {
    const response = await api.post('/persons', {
      name: payload.name,
      nic: payload.nic,
      type: payload.type,
      phone: payload.phone,
      email: payload.email,
      address: payload.address,
      departmentId: payload.departmentId,
      companyName: payload.companyName,
      purpose: payload.purpose,
      passType: payload.passType,
      passExpiryData: payload.passExpiryDate,
    });
    return response;
  },
  deletePerson: async (id: string) => {
    const response = await api.delete(`/persons/${id}`);
    return response;
  },
};
