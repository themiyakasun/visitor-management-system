'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Gatelog extends Model {
    static associate({ Person, Vehicle, Shift, Breaklog }) {
      this.belongsTo(Person, { foreignKey: 'personId', as: 'person' });

      this.belongsTo(Vehicle, { foreignKey: 'vehicleId', as: 'vehicle' });

      this.belongsTo(Shift, { foreignKey: 'shiftId', as: 'shift' });

      this.hasMany(Breaklog, {
        foreignKey: 'gateLogId',
        as: 'breakLogs',
      });
    }
  }
  Gatelog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      type: {
        type: DataTypes.ENUM('in', 'out', 'breakExit', 'breakReentry'),
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: 'gatelogs',
      modelName: 'Gatelog',
    }
  );
  return Gatelog;
};
