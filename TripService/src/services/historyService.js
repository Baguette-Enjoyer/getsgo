import db from '../sequelize/models/index'
import UserInfoClient from '../rabbitmq/user/userInfo/client'
import DriverInfoClient from '../rabbitmq/driver/driverInfo/client'
const GetHistoryOfUser = async (user_id) => {
    const trips = await db.Trip.findAll({
        where: { user_id: user_id },
        include: [
            {
                model: db.Rate,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            },
            // {
            //     model: db.User,
            //     as: 'driver',
            //     attributes: ['id', 'name', 'phone', 'email', 'avatar'],
            //     include: [
            //         {
            //             model: db.Vehicle,
            //             as: "driver_vehicle",
            //             required: true,
            //             attributes: {
            //                 exclude: ['createdAt', 'updatedAt', "driver_id", "vehicle_type_id"],
            //             },
            //             include: [
            //                 {
            //                     model: db.Vehicle_Type,
            //                     as: "vehicle_type",
            //                     attributes: {
            //                         exclude: ['createdAt', 'updatedAt', 'id'],
            //                     },
            //                 }
            //             ]
            //         },
            //     ]
            // }
        ],
        attributes: ['id', 'start', 'end', 'price', 'createdAt', 'status']
    })
    for (const trip of trips) {
        trip.user = await UserInfoClient.produce(trip.user_id)
        if (trip.driver_id) {
            trip.driver = await DriverInfoClient.produce(trip.driver_id)
        }
        if (trip.start) {
            trip.start = JSON.parse(trip.start)

        }
        if (trip.end) {
            trip.end = JSON.parse(trip.end)
        }
    }
    return trips
}

// export const GetHistoryOfUserByPhone = async (phone) => {
//     const user = await db.User.findOne({
//         where: {
//             phone: {
//                 [Op.eq]: phone,
//             },
//         },
//         attributes: ['id']
//     })
//     const trips = await db.Trip.findAll({
//         where: {
//             user_id: user.id
//         },
//         attributes: ['id', 'start', 'end', 'price', 'createdAt', 'status']
//     })
//     return trips
// }

const GetHistoryOfDriver = async (driver_id) => {
    const trips = await db.Trip.findAll({
        where: { driver_id: driver_id },
        include: [
            {
                model: db.Rate,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                required: false,
            }
        ],
        attributes: ['id', 'start', 'end', 'price', 'createdAt', 'status'],
        raw: true,
        nest: true,
    })
    return trips
}

const GetDriverStatics = (trips) => {
    let stars = 0
    let success = 0
    let cancelled = 0
    trips.forEach(item => {
        item.start = JSON.parse(item.start)
        item.end = JSON.parse(item.end)
        if (item.status != 'Done' || item.status != 'Cancelled') {
            if (item.status == 'Done') { success++; stars += item.Rate.star || 0 }
            else if (item.status == 'Cancelled') cancelled++;
        }
    })
    const starResult = stars / (success + cancelled) || 0
    const successResult = Math.floor(success * 100 / (success + cancelled)) || 0
    const cancelledResult = 100 - successResult || 0
    return {
        number_of_trips: trips.length,
        starResult,
        successResult,
        cancelledResult,
    }
}

export default {
    GetHistoryOfUser,
    GetHistoryOfDriver,
    GetDriverStatics
}