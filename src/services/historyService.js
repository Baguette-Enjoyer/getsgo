import db from '../models/index'

const GetHistoryOfUser = async (user_id) => {
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

export const GetHistoryOfUserByPhone = async (phone) => {
    const trips = await db.Trip.findAll({
        where: {
            phone: {
                [Op.eq]: phone,
            },
        },
        attributes: ['id', 'start', 'end', 'price', 'createdAt', 'status']
    })
    return trips
}

const GetHistoryOfDriver = async (driver_id) => {
    const trips = await db.Trip.findAll({
        where: { driver_id: driver_id },
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

const GetDriverStatics = (trips) => {
    let stars = 0
    let success = 0
    let cancelled = 0
    trips.forEach(item => {
        item.start = JSON.parse(item.start)
        item.end = JSON.parse(item.end)
        if (item.status != 'Done' || item.status != 'Cancelled') {
            if (item.status == 'Done') { success++; stars += item.Rate.star }
            else if (item.status == 'Cancelled') cancelled++;
        }
    })
    const starResult = stars / (success + cancelled)
    const successResult = Math.floor(success * 100 / (success + cancelled))
    const cancelledResult = 100 - successResult
    return {
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