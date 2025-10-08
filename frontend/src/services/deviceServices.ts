import { deviceApi } from './deviceApi';

export const deviceServices = {
  getPaginatedDevices: async (
    page: number,
    limit: number,
    companyId: string
  ) => {
    const role = localStorage.getItem('role');
    const path = role === 'admin' ? '/admin/device/count' : '/device/count';
    const response = await deviceApi.get(path, {
      params: { page, limit, companyid: companyId },
    });
    return response.data;
  },

  getDevices: async (companyId: string) => {
    const role = localStorage.getItem('role');
    const path = role === 'admin' ? '/admin/device' : '/device';
    const response = await deviceApi.get(path, {
      params: { companyid: companyId },
    });
    return response.data;
  },

  getAllDevices: async (companyId: string) => {
    const path = '/admin/device';
    const response = await deviceApi.get(path, {
      params: { companyid: companyId },
    });

    console.log(response);
    return response.data;
  },

  deleteDevice: async (id: string) => {
    const role = localStorage.getItem('role');
    const path = role === 'admin' ? '/admin/device' : '/device';
    const response = await deviceApi.delete(`${path}/${id}`);
    return response.data;
  },

  getCompanies: async () => {
    const role = localStorage.getItem('role');
    const path = role === 'admin' ? '/admin/company' : '/company';
    const response = await deviceApi.get(path);
    return response.data;
  },

  getAreas: async () => {
    const role = localStorage.getItem('role');
    const path = role === 'admin' ? '/admin/area' : '/area';
    const response = await deviceApi.get(path);
    return response.data;
  },

  getLocations: async () => {
    const role = localStorage.getItem('role');
    const path = role === 'admin' ? '/admin/location' : '/location';
    const response = await deviceApi.get(path);
    return response.data;
  },

  getZones: async () => {
    const role = localStorage.getItem('role');
    const path = role === 'admin' ? '/admin/zone' : '/zone';
    const response = await deviceApi.get(path);
    return response.data;
  },

  getUserDataByDevSN: async (DevSN: string) => {
    const role = localStorage.getItem('role');
    const path = role === 'admin' ? '/admin/devicecmd' : '/devicecmd';
    const response = await deviceApi.post(path, {
      DevSN,
      Type: 'General',
      Content: 'DATA QUERY USERINFO *',
    });
    return response.data;
  },

  rebootDeviceByDevSN: async (DevSN: string, companyId: string) => {
    const role = localStorage.getItem('role');
    const path =
      role === 'admin' ? '/admin/devicecmd/reboot' : '/devicecmd/reboot';
    const response = await deviceApi.post(path, {
      DevSN,
      Type: 'General',
      companyid: companyId,
    });
    return response.data;
  },

  getDeviceInfoByDevSN: async (DevSN: string) => {
    const role = localStorage.getItem('role');
    const path = role === 'admin' ? '/admin/devicecmd' : '/devicecmd';
    const response = await deviceApi.post(path, {
      DevSN,
      Type: 'General',
      Content: 'INFO',
    });
    return response.data;
  },

  issueCommand: async (DevSN: string, type: string, content: string) => {
    const role = localStorage.getItem('role');
    const path = role === 'admin' ? '/admin/devicecmd' : '/devicecmd';
    const response = await deviceApi.post(path, {
      DevSN,
      Type: type,
      Content: content,
    });
    return response.data;
  },

  getTransactionOfDeviceByDate: async (DevSN: string, content: string) => {
    const role = localStorage.getItem('role');
    const path = role === 'admin' ? '/admin/devicecmd' : '/devicecmd';
    const response = await deviceApi.post(path, {
      DevSN,
      Type: 'General',
      Content: content,
    });
    return response.data;
  },
};
