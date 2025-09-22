const getUserPermissions = (user) => {
  const userPermissions = user.Permissions || [];
  const rolePermissions = user.Roles?.flatMap((role) => role.Permissions) || [];
  const allPermissions = [...userPermissions, ...rolePermissions];
  return allPermissions;
};

module.exports = {
  getUserPermissions,
};
