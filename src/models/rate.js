'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rate.belongsTo(models.Trip, {
        foreignKey: "trip_id"
      })
    }
  }
  Rate.init({
    star: DataTypes.FLOAT,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Rate',
    tableName: "Rates",
    freezeTableName: true
  });
  return Rate;
};