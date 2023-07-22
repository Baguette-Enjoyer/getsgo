'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let items = [
      {
        name: "Admin",
        phone: "+84111111111",
        password: "$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee",
        type: "Admin",
      },
      {
        name: "Driver",
        phone: "+84222222222",
        password: "$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee",
        type: "Driver",
      },
      {
        name: "Driver",
        phone: "+84333333333",
        password: "$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee",
        type: "Driver",
      },
      {
        name: "User_vip",
        phone: "+84444444444",
        password: "$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee",
        type: "User_Vip",
      },
      {
        name: "User",
        phone: "+84555555555",
        password: "$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee",
        type: "User",
      },
      {
        name: "CallCenter",
        phone: "+84666666666",
        password: "$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee",
        type: "CallCenter",
      },
    ]
    items.forEach(item => {
      item.createdAt = Sequelize.literal("NOW()")
      item.updatedAt = Sequelize.literal("NOW()")
    })
    return await queryInterface.bulkInsert('Users', items)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return await queryInterface.bulkDelete("Users", null, {});
  }
};
