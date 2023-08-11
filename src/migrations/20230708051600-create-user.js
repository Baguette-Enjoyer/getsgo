'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female')
      },
      birthday: {
        type: Sequelize.DATE
      },
      avatar: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM('Admin', 'User', 'User_Vip', 'Driver', 'CallCenterS1', 'CallCenterS2', 'CallCenterS3')
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      accessToken: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};