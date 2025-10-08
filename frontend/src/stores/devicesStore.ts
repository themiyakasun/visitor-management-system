/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { toast } from 'sonner';
import { deviceServices } from '@/services/deviceServices';
import type { DeviceStore, Device } from '..';

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: [],
  allDevices: [],
  companies: [],
  areas: [],
  locations: [],
  zones: [],
  selectedDevices: [],
  paginator: { totalPages: 1, totalItems: 0, currentPage: 1 },
  currentPage: 1,
  selectedLimit: 10,

  getPaginatedDevices: async () => {
    const companyId = localStorage.getItem('companyId');
    try {
      const data = await deviceServices.getPaginatedDevices(
        get().currentPage,
        get().selectedLimit,
        companyId!
      );
      set({
        devices: data.devices,
        paginator: {
          totalPages: data.totalPages,
          totalItems: data.totalItems,
          currentPage: data.currentPage,
        },
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  getDevices: async () => {
    const companyId = localStorage.getItem('companyId');
    try {
      const data = await deviceServices.getDevices(companyId!);
      set({ devices: data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  getAllDevices: async () => {
    const companyId = localStorage.getItem('companyId');
    try {
      const response = await deviceServices.getAllDevices(companyId!);
      set({ allDevices: response });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  deleteDevice: async (id) => {
    try {
      await deviceServices.deleteDevice(id);
      toast.success('Device deleted successfully');
      get().getPaginatedDevices();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  getCompanies: async () => {
    try {
      const data = await deviceServices.getCompanies();
      set({ companies: data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  getAreas: async () => {
    try {
      const data = await deviceServices.getAreas();
      set({ areas: data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  getLocations: async () => {
    try {
      const data = await deviceServices.getLocations();
      set({ locations: data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  getZones: async () => {
    try {
      const data = await deviceServices.getZones();
      set({ zones: data });
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  getUserDataByDevSN: async (device: Device) => {
    try {
      await deviceServices.getUserDataByDevSN(device.DevSN);
      toast.success('User data fetched successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  rebootDeviceByDevSN: async (device: Device) => {
    const companyId = localStorage.getItem('companyId');
    try {
      await deviceServices.rebootDeviceByDevSN(device.DevSN, companyId!);
      toast.success('Device rebooted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  getDeviceInfoByDevSN: async (device: Device) => {
    try {
      await deviceServices.getDeviceInfoByDevSN(device.DevSN);
      toast.success('Device info fetched successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  getTransactionOfDeviceByDate: async (device: Device, content: string) => {
    try {
      await deviceServices.getTransactionOfDeviceByDate(device.DevSN, content);
      toast.success('Transactions fetched successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  issueCommand: async (device: Device, type: string, content: string) => {
    try {
      await deviceServices.issueCommand(device.DevSN, type, content);
      toast.success('Device command issued successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  isSelected: (device: Device) =>
    get().selectedDevices.some((d) => d.ID === device.ID),

  toggleDeviceSelection: (device: Device) => {
    const selected = get().selectedDevices;
    const isSelected = selected.some((d) => d.ID === device.ID);
    set({
      selectedDevices: isSelected
        ? selected.filter((d) => d.ID !== device.ID)
        : [...selected, device],
    });
  },

  incrementPage: () => {
    const { currentPage, paginator } = get();
    if (currentPage < paginator.totalPages) {
      set({ currentPage: currentPage + 1 });
      get().getPaginatedDevices();
    } else {
      toast.error('You are already on the last page');
    }
  },

  decrementPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      set({ currentPage: currentPage - 1 });
      get().getPaginatedDevices();
    } else {
      toast.error('You are already on the first page');
    }
  },
}));
