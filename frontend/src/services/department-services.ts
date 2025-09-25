import type { DepartmentPayload, ParamsPayload } from '..';
import { api } from './api';

export const departmentSerives = {
  getDepartments: async (params: ParamsPayload) => {
    const response = await api.get('/departments', {
      params,
    });
    return response;
  },

  getDepartmentReport: async (id: string) => {
    const response = await api.get(`/departments/report/${id}`);
    return response;
  },

  createDepartment: async (values: DepartmentPayload) => {
    const response = await api.post('/departments', {
      name: values.name,
      description: values.description,
    });
    return response;
  },
};
