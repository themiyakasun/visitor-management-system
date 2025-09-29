const express = require('express');

const {
  createPermissions,
  getAllPermissions,
  deletePermission,
  updatePermission,
  assignPermissionToRole,
  assignPermissionToUser,
  unAssignPermissionFromRole,
  unAssignPermissionFromUser,
} = require('../controllers/permissionsController.js');

const router = express.Router();

router.post('/', createPermissions);
router.get('/', getAllPermissions);
router.delete('/:id', deletePermission);
router.put('/:id', updatePermission);
router.post('/role-permission', assignPermissionToRole);
router.post('/user-permission', assignPermissionToUser);
router.delete(
  '/remove-user-permission/:userId/:permissionId',
  unAssignPermissionFromUser
);
router.delete(
  '/remove-role-permission/:roleId/:permissionId',
  unAssignPermissionFromRole
);

module.exports = router;
