'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate({ Person, Tenant }) {
      this.belongsTo(Person, { foreignKey: 'visitorId', as: 'visitor' });
      this.belongsTo(Person, {
        foreignKey: 'employeeId',
        as: 'employee',
      });
      this.belongsTo(Tenant, { foreignKey: 'tenantId', as: 'tenant' });
    }
  }
  Appointment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      datetime: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('scheduled', 'completed', 'cancelled'),
        defaultValue: 'scheduled',
      },
      purpose: DataTypes.STRING,
      expectedDuration: DataTypes.INTEGER, // in minutes
      actualArrival: DataTypes.DATE,
      actualDeparture: DataTypes.DATE,
      notificationSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'appointments',
      modelName: 'Appointment',
    }
  );
  return Appointment;
};
