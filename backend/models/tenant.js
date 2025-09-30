'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tenant extends Model {
    static associate({
      User,
      Department,
      Person,
      Vehicle,
      Gatelog,
      Breaklog,
      Appointment,
    }) {
      this.hasMany(Gatelog, { foreignKey: 'tenantId', as: 'gatelogs' });

      this.hasMany(Breaklog, { foreignKey: 'tenantId', as: 'breaklogs' });

      this.hasMany(User, { foreignKey: 'tenantId', as: 'users' });

      this.hasMany(Department, { foreignKey: 'tenantId', as: 'departments' });

      this.hasMany(Person, { foreignKey: 'tenantId', as: 'persons' });

      this.hasMany(Vehicle, { foreignKey: 'tenantId', as: 'vehicles' });

      this.hasMany(Appointment, { foreignKey: 'tenantId', as: 'appointments' });
    }
  }
  Tenant.init(
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
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      description: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      altPhone: DataTypes.STRING,
      fax: DataTypes.STRING,
      website: DataTypes.STRING,
      logo: DataTypes.STRING,
      businessId: DataTypes.STRING,
      taxId: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      state: DataTypes.STRING,
      zipCode: DataTypes.STRING,
      acPushPassword: DataTypes.STRING,
      acPushUrl: DataTypes.STRING,
      acPushUsername: DataTypes.STRING,
      registrationFee: DataTypes.DECIMAL(10, 2),
    },
    {
      sequelize,
      tableName: 'tenants',
      modelName: 'Tenant',
    }
  );
  return Tenant;
};
