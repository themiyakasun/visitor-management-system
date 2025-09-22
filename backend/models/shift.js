'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shift extends Model {
    static associate({ Gatelog }) {
      this.hasMany(Gatelog, { foreignKey: 'shiftId', as: 'gateLogs' });
    }
  }
  Shift.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      name: DataTypes.STRING,
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME,
    },
    {
      sequelize,
      tableName: 'shifts',
      modelName: 'Shift',
    }
  );
  return Shift;
};
