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
      Trip.belongsTo(models.User, {
        as: "user",
        foreignKey: "user_id"
      })
      Trip.belongsTo(models.User, {
        as: "driver",
        foreignKey: "driver_id"
      })
      Trip.hasOne(models.Conversation, {
        foreignKey: "trip_id"
      })
    }
  }
  Trip.init({
    status: DataTypes.ENUM('Callcenter', 'Pending', 'Waiting', 'Confirmed', 'Driving', 'Arrived', 'Done', 'Cancelled'),
    start: DataTypes.TEXT,
    end: DataTypes.TEXT,
    finished_date: DataTypes.DATE,
    type: DataTypes.INTEGER,
    note: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    is_paid: DataTypes.BOOLEAN,
    paymentMethod: DataTypes.ENUM('Cash', 'Momo', 'IE'),
    is_scheduled: DataTypes.BOOLEAN,
    schedule_time: DataTypes.DATE,
    is_callcenter: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Trip',
    tableName: "Trips",
    freezeTableName: true
  });
  return Trip;
};