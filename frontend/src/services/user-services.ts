import type { ParamsPayload, UserPayload } from '..';
import { api } from './api';

export const userServices = {
  getUsers: async (params: ParamsPayload) => {
    const response = await api.get('/users', {
      params,
    });
    return response;
  },
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response;
  },
  createUser: async (payload: UserPayload) => {
    const response = await api.post('/users', {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      roleNames: payload.roleNames,
    });
    return response;
  },
  updateUser: async ({ payload, id }: { payload: UserPayload; id: string }) => {
    const response = await api.put(`/users/update/${id}`, {
      name: payload.name,
      email: payload.email,
      roleNames: payload.roleNames,
    });
    return response;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response;
  },
};
