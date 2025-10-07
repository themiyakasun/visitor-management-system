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
    const response = await api.get(`/departments/report/${id}`, {
      responseType: 'arraybuffer',
    });
    return response;
  },

  getAllDepartmentReports: async () => {
    const response = await api.get('/departments/full-report', {
      responseType: 'arraybuffer',
    });
    return response;
  },

  createDepartment: async (values: DepartmentPayload) => {
    const response = await api.post('/departments', {
      name: values.name,
      description: values.description,
    });
    return response;
  },

  deleteDepartment: async (id: string) => {
    const response = await api.delete(`/departments/${id}`);
    return response;
  },

  updateDepartment: async ({
    id,
    payload,
  }: {
    id: string;
    payload: DepartmentPayload;
  }) => {
    const response = await api.put(`/departments/update/${id}`, {
      name: payload.name,
      description: payload.description,
    });
    return response;
  },

  getDepartmentEmployeeCount: async () => {
    const response = await api.get('/departments/employee-count');
    return response;
  },
};
