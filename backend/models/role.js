'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate({ User, Permission }) {
      this.belongsToMany(User, {
        through: 'user_roles',
        foreignKey: 'roleId',
        otherKey: 'userId',
        as: 'users',
      });

      this.belongsToMany(Permission, {
        through: 'role_permissions',
        foreignKey: 'roleId',
        otherKey: 'permissionId',
        as: 'permissions',
      });
    }
  }
  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'roles',
      modelName: 'Role',
    }
  );
  return Role;
};
