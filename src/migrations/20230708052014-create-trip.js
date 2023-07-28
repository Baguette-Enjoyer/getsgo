'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trips', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('Pending', 'Waiting', 'Confirmed', 'Driving', 'Arrived', 'Done', 'Cancelled')
      },
      start: {
        type: Sequelize.JSON
      },
      end: {
        type: Sequelize.JSON
      },
      finished_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL
      },
      is_paid: {
        type: Sequelize.BOOLEAN
      },
      paymentMethod: {
        type: Sequelize.ENUM('Cash', 'Momo', 'IE')
      },
      is_scheduled: {
        type: Sequelize.BOOLEAN,
      },
      schedule_time: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable('Trips');
  }
};