'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Tenant, Role, Permission }) {
      this.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

      this.belongsToMany(Role, {
        through: 'user_roles',
        foreignKey: 'userId',
        otherKey: 'roleId',
        as: 'roles',
      });

      this.belongsToMany(Permission, {
        through: 'user_permissions',
        foreignKey: 'userId',
        otherKey: 'permissionId',
        as: 'permissions',
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verificationToken: DataTypes.STRING,
      resetToken: DataTypes.STRING,
      resetTokenExpiry: DataTypes.DATE,
      otp: DataTypes.STRING,
      optExpiry: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
    }
  );
  return User;
};
