'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Conversation.belongsTo(models.User, {
        as: "user",
        foreignKey: "user_id"
      })
      Conversation.belongsTo(models.User, {
        as: "driver",
        foreignKey: "driver_id"
      })
      Conversation.belongsTo(models.Trip, {
        foreignKey: "trip_id"
      })
      Conversation.hasMany(models.Message, {
        foreignKey: "conversation_id"
      })
    }
  }
  Conversation.init({
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};