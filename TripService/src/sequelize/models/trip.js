'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Trip.hasOne(models.Rate, {
        foreignKey: "trip_id"
      })
    }
  }
  Trip.init({
    status: DataTypes.ENUM('Callcenter', 'Pending', 'Waiting', 'Confirmed', 'Driving', 'Arrived', 'Done', 'Cancelled'),
    start: DataTypes.JSON,
    end: DataTypes.JSON,
    finished_date: DataTypes.DATE,
    type: DataTypes.INTEGER,
    note: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    is_paid: DataTypes.BOOLEAN,
    paymentMethod: DataTypes.ENUM('Cash', 'Momo', 'IE'),
    is_scheduled: DataTypes.BOOLEAN,
    schedule_time: DataTypes.DATE,
    user_id: DataTypes.INTEGER,
    driver_id: DataTypes.INTEGER,
    is_callcenter: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Trip',
  });
  return Trip;
};