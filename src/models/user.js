'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Trip,
        {
          as: "user_trip",
          foreignKey: "user_id"
        }
      )
      User.hasMany(models.Trip,
        {
          as: "driver_trip",
          foreignKey: "driver_id"
        }
      )
      User.hasOne(models.Vehicle, {
        foreignKey: "driver_id",
        as: "driver_vehicle",
      })

    }
  }
  User.init({
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.ENUM('Male', 'Female'),
    birthday: DataTypes.DATE,
    avatar: DataTypes.STRING,
    type: DataTypes.ENUM('Admin', 'User', 'User_Vip', 'Driver', 'CallCenterS1', 'CallCenterS2', 'CallCenterS3'),
    active: DataTypes.BOOLEAN,
    accessToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: "Users",
    freezeTableName: true
  });
  return User;
};