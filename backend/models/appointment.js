'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate({ Person }) {
      this.belongsTo(Person, { foreignKey: 'visitorId', as: 'visitor' });
      this.belongsTo(Person, {
        foreignKey: 'employeeId',
        as: 'employee',
      });
    }
  }
  Appointment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
