import db from '../models/index'

let GetHistoryOfUser = async (user_id) => {
    let trips = await db.Trip.findAll({
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

let GetHistoryOfDriver = async (driver_id) => {
    let trips = await db.Trip.findAll({
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

let GetDriverStatics = (trips) => {
    let stars = 0
    let success = 0
    let cancelled = 0
    trips.forEach(item => {
        item.start = JSON.parse(item.start)
        item.end = JSON.parse(item.end)
        stars += item.Rate.star
        if (item.status == 'Done') success++;
        else if (item.status == 'Cancelled') cancelled++;
    })
    let starResult = stars / (success + cancelled)
    let successResult = Math.floor(success * 100 / (success + cancelled))
    let cancelledResult = 100 - successResult
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