'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    static associate({ Tenant, Person }) {
      this.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

      this.hasMany(Person, { foreignKey: 'departmentId', as: 'persons' });
    }
  }
  Department.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'departments',
      modelName: 'Department',
    }
  );
  return Department;
};
