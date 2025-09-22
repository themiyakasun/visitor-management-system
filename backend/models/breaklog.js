'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Breaklog extends Model {
    static associate({ Gatelog }) {
      this.belongsTo(Gatelog, { foreignKey: 'gateLogId', as: 'gateLog' });
    }
  }
  Breaklog.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('tea', 'lunch'),
      },
      exitTime: DataTypes.DATE,
      reentryTime: DataTypes.DATE,
      duration: DataTypes.INTEGER, // in minutes
      isLate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: 'breaklogs',
      modelName: 'Breaklog',
    }
  );
  return Breaklog;
};
