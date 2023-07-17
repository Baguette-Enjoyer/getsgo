'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vehicle.belongsTo(models.Vehicle_Type,{
        foreignKey:"vehicle_type_id",
      })
      Vehicle.belongsTo(models.User,{
        foreignKey:"driver_id",
      })
    }
  }
  Vehicle.init({
    driver_license: DataTypes.STRING,
    vehicle_registration: DataTypes.STRING,
    license_plate: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Vehicle',
  });
  return Vehicle;
};