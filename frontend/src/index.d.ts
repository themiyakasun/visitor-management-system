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

type Permisson = {
  id?: number;
  resource: string;
  action: string;
};

interface AuthStore {
  user: UserData | null;
  token: string | null;
  permissions: Permissions[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (values: LoginPayload) => Promise<any>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  changePassword: (values: ChangePasswordPayload) => Promise<any>;
}
