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
        let start = {
            "lat": 10.1,
            "lng": 10.2,
            "place": "random places"
        }
        let end = {
            "lat": 10.3,
            "lng": 10.4,
            "place": "2nd random places"
        }
        let startJSON = JSON.stringify(start)
        let endJSON = JSON.stringify(end)
        let items = [
            {
                "user_id": 4,
                "driver_id": 2,
                "status": "Cancelled",
                "start": startJSON,
                "end": endJSON,
                "is_scheduled": false,
                "price": 50000,
                "is_paid": false,
                "paymentMethod": "Cash"
            },
            {
                "user_id": 4,
                "driver_id": 2,
                "status": "Done",
                "start": startJSON,
                "end": endJSON,
                "is_scheduled": false,
                "price": 50000,
                "is_paid": false,
                "paymentMethod": "Cash"
            },
            {
                "user_id": 5,
                "driver_id": 2,
                "status": "Cancelled",
                "start": startJSON,
                "end": endJSON,
                "is_scheduled": false,
                "price": 50000,
                "is_paid": false,
                "paymentMethod": "Cash"
            },
            {
                "user_id": 4,
                "driver_id": 3,
                "status": "Done",
                "start": startJSON,
                "end": endJSON,
                "is_scheduled": false,
                "price": 50000,
                "is_paid": false,
                "paymentMethod": "Cash"
            },
            {
                "user_id": 4,
                "driver_id": 3,
                "status": "Done",
                "start": startJSON,
                "end": endJSON,
                "is_scheduled": false,
                "price": 50000,
                "is_paid": false,
                "paymentMethod": "Cash"
            },
            {
                "user_id": 5,
                "driver_id": 3,
                "status": "Done",
                "start": startJSON,
                "end": endJSON,
                "is_scheduled": false,
                "price": 50000,
                "is_paid": false,
                "paymentMethod": "Cash"
            },
        ]
        items.forEach(item => {
            item.createdAt = Sequelize.literal("NOW()")
            item.updatedAt = Sequelize.literal("NOW()")
        })
        return await queryInterface.bulkInsert('Trips', items)
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        return await queryInterface.bulkDelete("Trips", null, {});
    }
};
