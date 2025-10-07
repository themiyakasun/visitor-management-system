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
    const response = await api.post('/persons', payload);
    return response;
  },
  deletePerson: async (id: string) => {
    const response = await api.delete(`/persons/${id}`);
    return response;
  },
  updatePerson: async ({
    id,
    payload,
  }: {
    id: string;
    payload: PersonPayload;
  }) => {
    const response = await api.put(`/persons/${id}`, payload);
    return response;
  },
  bulkUpload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/persons/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },
};
