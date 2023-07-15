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
          foreignKey:"user_id"
        }  
      )
      User.hasMany(models.Trip,
        {
          foreignKey:"driver_id"
        }  
      )

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
    type: DataTypes.ENUM('Admin', 'User', 'User_Vip', 'Driver'),
    active: DataTypes.BOOLEAN,
    accessToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};