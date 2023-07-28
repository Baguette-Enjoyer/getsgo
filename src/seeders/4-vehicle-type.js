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
                name: "Xe 4 Chỗ",
            },
            {
                name: "Xe 7 Chỗ",
            },
        ]
        items.forEach(item => {
            item.createdAt = Sequelize.literal("NOW()")
            item.updatedAt = Sequelize.literal("NOW()")
        })
        return await queryInterface.bulkInsert('Vehicle_Types', items)
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        return await queryInterface.bulkDelete("Vehicle_Types", null, {});
    }
};
