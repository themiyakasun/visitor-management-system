'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate({ Role, User }) {
      this.belongsToMany(Role, {
        through: 'role_permissions',
        foreignKey: 'permissionId',
        otherKey: 'roleId',
        as: 'roles',
      });

      this.belongsToMany(User, {
        through: 'user_permissions',
        foreignKey: 'permissionId',
        otherKey: 'userId',
        as: 'users',
      });
    }
  }
  Permission.init(
    {
      resource: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Permission',
    }
  );
  return Permission;
};
