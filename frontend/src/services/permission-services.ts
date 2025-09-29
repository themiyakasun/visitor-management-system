import type {
  PermissionPayload,
  RolePermissionPayload,
  UserPermissionPayload,
} from '..';
import { api } from './api';

export const permissionService = {
  createPermission: async (payload: PermissionPayload) => {
    const response = await api.post('/permissions', payload);
    return response;
  },
  getAllPermissions: async () => {
    const response = await api.get('/permissions');
    return response;
  },
  updatePermission: async ({
    id,
    payload,
  }: {
    id: number;
    payload: PermissionPayload;
  }) => {
    const response = await api.put(`/permissions/${id}`, {
      payload,
    });
    return response;
  },
  deletePermission: async (id: number) => {
    const response = await api.delete(`/permissions/${id}`);
    return response;
  },
  assignRolePermissions: async (payload: RolePermissionPayload) => {
    const response = await api.post('/permissions/role-permission', {
      roleId: payload.roleId,
      permissionId: payload.permissionId,
    });
    return response;
  },
  assignUserPermissions: async (payload: UserPermissionPayload) => {
    const response = await api.post('/permissions/user-permission', {
      userId: payload.userId,
      permissionId: payload.permissionId,
    });
    return response;
  },
  removeRolePermission: async (payload: RolePermissionPayload) => {
    const roleId = payload.roleId;
    const permissionId = payload.permissionId;
    const response = await api.delete(
      `/permissions/remove-role-permission/${roleId}/${permissionId}`
    );
    return response;
  },
  removeUserPermission: async (payload: UserPermissionPayload) => {
    const response = await api.delete(
      `/permissions/remove-user-permission/${payload.userId}/${payload.permissionId}`
    );
    return response;
  },
};
