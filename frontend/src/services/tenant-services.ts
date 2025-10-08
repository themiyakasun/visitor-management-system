import { api } from './api';
import type { TenantPayload, ParamsPayload } from '..';

export const tenantServices = {
  getTenants: async (params: ParamsPayload) => {
    const response = await api.get('/tenants', { params });
    return response;
  },

  createTenant: async (values: TenantPayload) => {
    const response = await api.post('/tenants', values);
    return response;
  },

  updateTenant: async ({
    id,
    payload,
  }: {
    id: string;
    payload: TenantPayload;
  }) => {
    const response = await api.put(`/tenants/update/${id}`, payload);
    return response;
  },

  deleteTenant: async (id: string) => {
    const response = await api.delete(`/tenants/${id}`);
    return response;
  },

  getTenantById: async (id: string) => {
    const response = await api.get(`/tenants/${id}`);
    return response;
  },
};
