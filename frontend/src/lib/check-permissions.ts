import type { Permission } from '..';

export const checkPermissions = async (
  requiredPermissions: Permission[],
  permissions: Permission[]
) => {
  return requiredPermissions.every((requiredPermission) =>
    permissions?.some(
      (permission: Permission) =>
        permission.resource === requiredPermission.resource &&
        permission.action === requiredPermission.action
    )
  );
};
