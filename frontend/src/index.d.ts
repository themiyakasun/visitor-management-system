/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosRequestConfig } from 'axios';

type UseAxiosReturn<T> = {
  data: T | null;
  error: string | null;
  loading: boolean;
  request: (config: AxiosRequestConfig) => Promise<T | null>;
};

type UserData = {
  id: string;
  name: string;
  email: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type ChangePasswordPayload = {
  newPassword: string;
  oldPassword: string;
};

type Permission = {
  id?: number;
  resource: string;
  action: string;
};

interface AuthStore {
  user: UserData | null;
  token: string | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (values: LoginPayload) => Promise<any>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  changePassword: (values: ChangePasswordPayload) => Promise<any>;
}

interface DepartmentStore {
  departments: Department[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  getAllDepartments: (params: ParamsPayload) => Promise<any>;
  getDepartmentReport: (id: string) => Promise<any>;
  createDepartment: (values: DepartmentPayload) => Promise<any>;
  getAllDepartmentsReport: () => Promise<any>;
  deleteDepartment: (id: string) => Promise<any>;
}

type ParamsPayload = {
  page: number;
  limit: number;
  sortBy?: any;
  sortOrder?: any;
  search: string;
  offset?: number;
};

type Department = {
  id: string;
  name: string;
  description: string;
};

type DepartmentPayload = {
  name: string;
  description?: string;
};
