'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    static associate({ Tenant, Person, Gatelog }) {
      this.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });

      this.belongsTo(Person, { foreignKey: 'driverId', as: 'driver' });

      this.hasMany(Gatelog, { foreignKey: 'vehicleId', as: 'gateLogs' });
    }
  }
  Vehicle.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      numberPlate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: DataTypes.STRING,
      make: DataTypes.STRING,
      model: DataTypes.STRING,
      color: DataTypes.STRING,
      year: DataTypes.INTEGER,
      passExpiryDate: DataTypes.DATE,
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'vehicles',
      modelName: 'Vehicle',
    }
  );
  return Vehicle;
};
