'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Person extends Model {
    static associate({ Tenant, Department, Vehicle, Gatelog, Appointment }) {
      this.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

      this.belongsTo(Department, {
        foreignKey: 'departmentId',
        as: 'department',
      });

      this.hasMany(Vehicle, { foreignKey: 'driverId', as: 'vehicles' });

      this.hasMany(Appointment, {
        foreignKey: 'visitorId',
        as: 'appointments',
      });

      this.hasMany(Gatelog, { foreignKey: 'personId', as: 'gateLogs' });
    }
  }
  Person.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nic: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: DataTypes.ENUM('employee', 'driver', 'helper', 'visitor'),
      },
      passType: {
        type: DataTypes.ENUM(
          'employee',
          'driverPass',
          'helperPass',
          'visitorPass'
        ),
      },
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.TEXT,
      photoUrl: DataTypes.STRING,
      passExpiryDate: DataTypes.DATE,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      companyName: DataTypes.STRING, // for visitors/contractors
      purpose: DataTypes.STRING, // for visitors
    },
    {
      sequelize,
      tableName: 'persons',
      modelName: 'Person',
    }
  );
  return Person;
};
