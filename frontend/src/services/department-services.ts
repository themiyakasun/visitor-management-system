import type { ParamsPayload } from '..';
import { api } from './api';

export const departmentSerives = {
  getDepartments: async (params: ParamsPayload) => {
    const response = await api.get('/departments', {
      params,
    });
    return response;
  },
};
