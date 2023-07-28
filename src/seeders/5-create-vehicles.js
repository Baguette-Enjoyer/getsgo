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
                "driver_license": "0964155097",
                "vehicle_registration": "123456",
                "license_plate": "30D-206.32",
                "name": "Honda 4 Chỗ Vip",
                "vehicle_type_id": 1,
                "driver_id": 2,
            },
            {
                "driver_license": "0964155097",
                "vehicle_registration": "123456",
                "license_plate": "30D-206.32",
                "name": "Honda 7 Chỗ Vip",
                "vehicle_type_id": 2,
                "driver_id": 3,
            },
        ]
        items.forEach(item => {
            item.createdAt = Sequelize.literal("NOW()")
            item.updatedAt = Sequelize.literal("NOW()")
        })
        return await queryInterface.bulkInsert('Vehicles', items)
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        return await queryInterface.bulkDelete("Vehicles", null, {});
    }
};
