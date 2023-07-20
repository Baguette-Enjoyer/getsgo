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
                star: 4,
                trip_id: 1,
            },
            {
                star: 5,
                trip_id: 2,
            },
            {
                star: 2,
                trip_id: 3,
            },
            {
                star: 5,
                trip_id: 4,
            },
            {
                star: 1,
                trip_id: 5,
            },
            {
                star: 4,
                trip_id: 6,
            },
        ]
        items.forEach(item => {
            item.createdAt = Sequelize.literal("NOW()")
            item.updatedAt = Sequelize.literal("NOW()")
        })
        return await queryInterface.bulkInsert('Rates', items)
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        return await queryInterface.bulkDelete("Rates", null, {});
    }
};
