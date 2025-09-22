const getUserPermissions = (user) => {
  const userPermissions = user.Permissions || [];
  const rolePermissions = user.Roles?.flatMap((role) => role.Permissions) || [];
  const allPermissions = [...userPermissions, ...rolePermissions];
  return allPermissions;
};

const parseQueryParams = (reqQuery) => {
  const page = parseInt(reqQuery.page, 10) || 1;
  const limit = parseInt(reqQuery.limit, 10) || 10;
  const sortBy = reqQuery.sortBy || 'createdAt';
  const sortOrder = reqQuery.sortOrder === 'desc' ? 'DESC' : 'ASC';
  const search = reqQuery.search || '';

  const offset = (page - 1) * limit;

  return { page, limit, sortBy, sortOrder, search, offset };
};

module.exports = {
  getUserPermissions,
  parseQueryParams,
};
