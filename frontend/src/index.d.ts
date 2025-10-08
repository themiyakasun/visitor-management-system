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
  employeeCount: DepartmentEmployeeCount[];
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
  updateDepartment: ({
    id,
    payload,
  }: {
    id: string;
    payload: DepartmentPayload;
  }) => Promise<any>;
  getDepartmentEmployeeCount: () => Promise<any>;
}

interface RoleStore {
  roles: Role[];
  isLoading: boolean;
  getAllRoles: () => Promise<any>;
  getRoleById: (id: string) => Promise<any>;
  createRole: (values: RolePayload) => Promise<any>;
  updateRole: ({
    values,
    id,
  }: {
    values: RolePayload;
    id: string;
  }) => Promise<any>;
  deleteRole: (id: string) => Promise<any>;
}

interface UserStore {
  users: User[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  getUsers: (params: ParamsPayload) => Promise<any>;
  getUserById: (id: string) => Promise<any>;
  createUser: (payload: UserPayload) => Promise<any>;
  updateUser: ({
    id,
    payload,
  }: {
    id: string;
    payload: UserPayload;
  }) => Promise<any>;
  deleteUser: (id: string) => Promise<any>;
}

interface PermissionStore {
  permissions: Permission[];
  isLoading: boolean;
  createPermission: (payload: PermissionPayload) => Prmoise<any>;
  getAllPermissions: () => Promise<any>;
  updatePermission: ({
    id,
    payload,
  }: {
    id: number;
    payload: PermissionPayload;
  }) => Promise<any>;
  deletePermission: (id: number) => Promise<any>;
  assignRolePermissions: (payload: RolePermissionPayload) => Promise<any>;
  assignUserPermissions: (payload: UserPermissionPayload) => Promise<any>;
  removeUserPermissions: (payload: UserPermissionPayload) => Promise<any>;
  removeRolePermissions: (payload: RolePermissionPayload) => Promise<any>;
}

interface PersonStore {
  persons: Person[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search: string;
    type: string;
  };
  getAllPersons: (params?: ParamsPayload) => Promise<any>;
  createPerson: (payload: PersonPayload) => Promise<any>;
  deletePerson: (id: string) => Promise<any>;
  bulkUploadPersons: (file: File) => Promise<any>;
  updatePerson: ({
    id,
    payload,
  }: {
    id: string;
    payload: PersonPayload;
  }) => Promise<any>;
}

interface VehicleStore {
  vehicles: Vehicle[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  getAllVehicles: (params: ParamsPayload) => Promise<any>;
  createVehicle: (payload: VehiclePayload) => Promise<any>;
  deleteVehicle: (id: string) => Promise<any>;
  updateVehicle: ({
    id,
    payload,
  }: {
    id: string;
    payload: VehiclePayload;
  }) => Promise<any>;
}

interface AppointmentStore {
  appointments: Appointment[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  getAllAppointments: (params: ParamsPayload) => Promise<any>;
  createAppointment: (payload: AppointmentPayload) => Promise<any>;
  updateAppointment: ({
    payload,
    id,
  }: {
    payload: AppointmentUpdatePayload;
    id: string;
  }) => Promise<any>;
  generateAppointmentsReport: (params: ActiveTimeParamsPayload) => Promise<any>;
}

interface GatelogStore {
  gatelogs: GateLog[];
  inOutReport: InOutGate[];
  dashboardSummary: DashboardSummary;
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  recordGateAction: (payload: GateActionPayload) => Promise<any>;
  getTodayActivity: (params: ParamsPayload) => Promise<any>;
  getAllActivity: (params: ParamsPayload) => Promise<any>;
  generateActiveReport: (params: ActiveTimeParamsPayload) => Promise<any>;
  generateInOutReport: (params: ActiveTimeParamsPayload) => Promise<any>;
  getDashboardSummary: () => Promise<any>;
}

type ParamsPayload = {
  page: number;
  limit: number;
  sortBy?: any;
  sortOrder?: any;
  search: string;
  offset?: number;
  type?: string;
};

type ActiveTimeParamsPayload = {
  fromDate?: string;
  toDate?: string;
  type?: string;
  personId?: string;
  vehicleId?: string;
  timeGap?: string;
  format?: string;
  page?: number;
  limit?: number;
};

type Department = {
  id: string;
  name: string;
  description: string;
};

type DepartmentPayload = {
  id?: string;
  name: string;
  description?: string;
};

type DepartmentEmployeeCount = {
  id: string;
  name: string;
  employeeCount: number;
};

type RolePayload = {
  id?: string;
  name: string;
};

type Role = {
  id: string;
  name: string;
  permissions: Permission[];
};

type UserPayload = {
  id?: string;
  name: string;
  email: string;
  password?: string;
  roleNames?: string[];
  roles?: Role[];
};

type User = {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
};

type PermissionPayload = {
  id?: number;
  resource: string;
  action: string;
};

type RolePermissionPayload = {
  roleId: string;
  permissionId: number;
};

type UserPermissionPayload = {
  userId: string;
  permissionId: number;
};

export type PersonType = 'employee' | 'driver' | 'helper' | 'visitor';

export type PassType = 'employee' | 'driverPass' | 'helperPass' | 'visitorPass';

type Person = {
  id: string;
  name: string;
  type?: PersonType | null;
  passType?: PassType | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  photoUrl?: string | null;
  passExpiryDate?: Date | null;
  isActive?: boolean;
  companyName?: string | null;
  purpose?: string | null;
  nic?: string | null;
};

export type PersonPayload = {
  id?: string;
  name: string;
  email?: string;
  type: PersonType;
  departmentId?: string;
  phone?: string;
  address?: string;
  nic: string;
  companyName?: string;
  purpose?: string;
  passExpiryDate?: string;
  passType?: string;
  vehicleData?: VehiclePayload[];
};

export type Vehicle = {
  id: string;
  numberPlate: string;
  type?: string;
  make?: string;
  model?: string;
  color?: string;
  passExpiryDate?: string;
  isActive: boolean;
  driver: Person;
};

export type VehiclePayload = {
  id?: string;
  numberPlate: string;
  type?: string;
  make?: string;
  model?: string;
  color?: string;
  passExpiryDate?: string;
  driverId?: string;
};

export type Appointment = {
  id: string;
  datetime: string;
  purpose: string;
  expectedDuration: number;
  actualArrival: string;
  actualDeparture: string;
  visitorId: string;
  employeeId?: string;
  visitor: Person;
  employee: Person;
  status: string;
};

export type AppointmentPayload = {
  id?: string;
  datetime: string;
  purpose: string;
  expectedDuration: number;
  visitorId?: string;
  employeeId?: string;
  visitorDetails?: Person;
};

export type AppointmentUpdatePayload = {
  id?: string;
  datetime?: string;
  status?: string;
  purpose?: string;
  expectedDuration?: string;
};

export type GateLog = {
  id: string;
  personId: string;
  vehicleId?: string;
  type: string;
  timestamp: string;
  vehicle: Vehicle;
  person: Person;
};

export type InOutGate = {
  person: string;
  inTime: string;
  outTime?: string;
  vehicle?: string;
};

export type GateActionPayload = {
  personId: string;
  vehicleId?: string;
  gateId: string;
  action: string;
  breakType?: string;
};

export type DashboardSummary = {
  totalLogs: number;
  totalEmployees: number;
  totalVisitors: number;
  totalVehicles: number;
};

interface Device {
  ID: string;
  DevSN: string;
  [key: string]: any;
}

interface Paginator {
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

interface DeviceStore {
  devices: Device[];
  allDevices: Device[];
  companies: any[];
  areas: any[];
  locations: any[];
  zones: any[];
  selectedDevices: Device[];
  paginator: Paginator;
  currentPage: number;
  selectedLimit: number;

  getPaginatedDevices: () => Promise<void>;
  getDevices: () => Promise<void>;
  getAllDevices: () => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;

  getCompanies: () => Promise<void>;
  getAreas: () => Promise<void>;
  getLocations: () => Promise<void>;
  getZones: () => Promise<void>;

  getUserDataByDevSN: (device: Device) => Promise<void>;
  rebootDeviceByDevSN: (device: Device) => Promise<void>;
  getDeviceInfoByDevSN: (device: Device) => Promise<void>;
  getTransactionOfDeviceByDate: (
    device: Device,
    content: string
  ) => Promise<void>;
  issueCommand: (
    device: Device,
    type: string,
    content: string
  ) => Promise<void>;

  isSelected: (device: Device) => boolean;
  toggleDeviceSelection: (device: Device) => void;

  incrementPage: () => void;
  decrementPage: () => void;
}

export interface TenantPayload {
  id: any;
  name: string;
  slug: string;
  description?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  altPhone?: string;
  fax?: string;
  website?: string;
  logo?: string;
  businessId?: string;
  taxId?: string;
  acPushUsername?: string;
  acPushPassword?: string;
  acPushUrl?: string;
  registrationFee?: number;
}

export interface TenantStore {
  tenants: TenantPayload[];
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  getAllTenants: (params: ParamsPayload) => Promise<any>;
  createTenant: (values: TenantPayload) => Promise<any>;
  updateTenant: (args: { id: string; payload: TenantPayload }) => Promise<any>;
  deleteTenant: (id: string) => Promise<any>;
  getTenantById: (id: string) => Promise<any>;
}
