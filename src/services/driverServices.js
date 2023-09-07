import db from '../models/index'
import historyService from './historyService'
import { Op } from 'sequelize'
let GetHistoryOfUser = async (user_id) => {
    const trips = await db.Trip.findAll({
        where: { user_id: user_id },
        include: [
            {
                model: db.Rate,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        ],
        attributes: ['id', 'start', 'end', 'price', 'createdAt', 'status']
    })
    return trips
}


const GetDriverInfoById = async (driver_id) => {
    return new Promise(async (resolve, reject) => {
        console.log(driver_id)
        const driver = await db.User.findOne(
            {
                where: { id: driver_id, type: "Driver" },
                include: [
                    {
                        model: db.Vehicle,
                        as: "driver_vehicle",
                        required: true,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', "driver_id", "vehicle_type_id"],
                        },
                        include: [
                            {
                                model: db.Vehicle_Type,
                                as: "vehicle_type",
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt', 'id'],
                                },
                            }
                        ]
                    },
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'password', 'accessToken']
                },
                raw: true,
                nest: true
            },
        )
        if (driver == null) {
            return resolve(null)
        }
        const trips = await historyService.GetHistoryOfDriver(driver.id)
        const stats = historyService.GetDriverStatics(trips)
        console.log({
            "driver_info": driver,
            "statics": stats
        })
        return resolve({
            "driver_info": driver,
            "statics": stats
        })
    })
}

const GetProfitPlusTrip = async (driver_id, type) => {
    // type = 'Day' | 'Week' | 'Month'
    let startDate;
    let endDate
    let today = new Date()

    if (type === 'Day' || type === '') {

        today.setHours(0, 0, 0, 0);
        startDate = today
        endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    } else if (type === 'Week') {
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        startDate = firstDayOfWeek
        endDate = new Date(firstDayOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)

    } else if (type === 'Month') {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate = firstDayOfMonth
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1)

    }
    const trips = await db.Trip.findAll({
        where: {
            driver_id: driver_id,
            createdAt: {
                [Op.gte]: startDate,
                [Op.lt]: endDate
            }
        },
        include: [
            {
                model: db.Rate,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        ],
        attributes: ['id', 'start', 'end', 'price', 'createdAt', 'status']
    })
    let prof = 0
    trips.forEach(trip => {
        trip.start = JSON.parse(trip.start)
        trip.end = JSON.parse(trip.end)
        prof += parseFloat(trip.price)
    })
    return { trips, profit: prof }
}

export default {
    GetDriverInfoById,
    GetHistoryOfUser,
    GetProfitPlusTrip
}