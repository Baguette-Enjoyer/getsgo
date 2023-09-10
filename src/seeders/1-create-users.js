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
        avatar: "https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-nam-53-28-16-28-17.jpg"
      },
      {
        name: "Driver",
        phone: "+84222222222",
        password: "$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee",
        type: "Driver",
        avatar: "https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-nam-53-28-16-28-17.jpg"
      },
      {
        name: "Driver",
        phone: "+84333333333",
        password: "$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee",
        type: "Driver",
        avatar: "https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-nam-53-28-16-28-17.jpg"
      },
      {
        name: "User_vip",
        phone: "+84444444444",
        password: "$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee",
        type: "User_Vip",
        avatar: "https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-nam-53-28-16-28-17.jpg"
      },
      {
        name: "User",
        phone: "+84555555555",
        password: "$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee",
        type: "User",
        avatar: "https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-nam-53-28-16-28-17.jpg"

      },
      {
        name: "CallCenterS1",
        phone: "+84666666666",
        password: "$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee",
        type: "CallCenterS1",
        avatar: "https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-nam-53-28-16-28-17.jpg"
      },
      {
        name: "CallCenterS2",
        phone: "+84777777777",
        password: "$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee",
        type: "CallCenterS2",
        avatar: "https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-nam-53-28-16-28-17.jpg"
      },
      {
        name: "CallCenterS3",
        phone: "+84888888888",
        password: "$2a$10$Ficn2IbPjW2xSwbjIkkC0u6LmJNGCJmEAqT4Iuw0srI/GfXL/Aeee",
        type: "CallCenterS3",
        avatar: "https://inkythuatso.com/uploads/thumbnails/800/2022/03/anh-dai-dien-facebook-dep-cho-nam-53-28-16-28-17.jpg"
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
