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
    let trips = [
        {
            "start": {
                "lat": 10.1,
                "lng": 10.2,
                "place": "random places"
            },
            "end": {
                "lat": 10.3,
                "lng": 10.4,
                "place": "2nd random places"
            },
            "is_scheduled": false,
            "price": 50000,
            "is_paid": false,
            "payment_method": "Cash"
        }
    ]
    users.forEach(item => {
        item.createdAt = Sequelize.literal("NOW()")
        item.updatedAt = Sequelize.literal("NOW()")
    })
    await db.User.bulkCreate(users)
}

export default {
    initTable,
    initSeed,
}