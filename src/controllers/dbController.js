import db from '../models/index'

let initTable = async (req, res) => {
    // console.log(db.sequelize)
    await db.sequelize.sync({
        force: true,
        logging: false
    }).then(() => {
        res.send("Success!")
    })
}

let initSeed = async (req, res) => {
    let users = [
        {
            name: "Admin",
            phone: "+84111111111",
            password: "$2a$10$P3nKAg0XDgWKu5G96hhnjuYqmVsWkkmfUT4WDVMGEgWTI9/pDggxO",
            type: "Admin",
        },
        {
            name: "Driver",
            phone: "+84222222222",
            password: "$2a$10$P3nKAg0XDgWKu5G96hhnjuYqmVsWkkmfUT4WDVMGEgWTI9/pDggxO",
            type: "Driver",
        },
        {
            name: "Driver",
            phone: "+84333333333",
            password: "$2a$10$P3nKAg0XDgWKu5G96hhnjuYqmVsWkkmfUT4WDVMGEgWTI9/pDggxO",
            type: "Driver",
        },
        {
            name: "User_vip",
            phone: "+84444444444",
            password: "$2a$10$P3nKAg0XDgWKu5G96hhnjuYqmVsWkkmfUT4WDVMGEgWTI9/pDggxO",
            type: "User_Vip",
        },
        {
            name: "User",
            phone: "+84555555555",
            password: "$2a$10$P3nKAg0XDgWKu5G96hhnjuYqmVsWkkmfUT4WDVMGEgWTI9/pDggxO",
            type: "User",
        },
    ]
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
    let trips = [
        {
            "user_id": 4,
            "driver_id": 2,
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
            "start": startJSON,
            "end": endJSON,
            "is_scheduled": false,
            "price": 50000,
            "is_paid": false,
            "paymentMethod": "Cash"
        },
    ]
    let rates = [
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

    users.forEach(item => {
        item.createdAt = Sequelize.literal("NOW()")
        item.updatedAt = Sequelize.literal("NOW()")
    })
    trips.forEach(item => {
        item.createdAt = Sequelize.literal("NOW()")
        item.updatedAt = Sequelize.literal("NOW()")
    })
    rates.forEach(item => {
        item.createdAt = Sequelize.literal("NOW()")
        item.updatedAt = Sequelize.literal("NOW()")
    })
    await db.User.bulkCreate(users).then(() => {
        console.log("seeded users")
    })
    await db.Trip.bulkCreate(trips).then(() => {
        console.log("seeded trips")
    })
    await db.Rate.bulkCreate(rates).then(() => {
        console.log("seeded rates")
    })
}

export default {
    initTable,
    initSeed,
}