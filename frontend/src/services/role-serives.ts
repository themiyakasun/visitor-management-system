import type { RolePayload } from '..';
import { api } from './api';

export const roleServices = {
  getAllRoles: async () => {
    const response = await api.get('/roles');
    return response;
  },
  getRolesById: async (id: string) => {
    const respone = await api.get(`/roles/${id}`);
    return respone;
  },
  createRole: async (payload: RolePayload) => {
    const response = await api.post('/roles', {
      name: payload.name,
    });
    return response;
  },
  updateRole: async ({ payload, id }: { payload: RolePayload; id: string }) => {
    const response = await api.put(`/roles/${id}`, {
      name: payload.name,
    });
    return response;
  },
  deleteRole: async (id: string) => {
    const response = await api.delete(`/roles/${id}`);
    return response;
  },
};
