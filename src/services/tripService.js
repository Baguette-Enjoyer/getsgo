import { Op } from 'sequelize'
import db from '../models/index'
import userService from './userService'
import Sequelize from 'sequelize'
// import socketServiceTS from '../socket/socketServiceTS.js'
import { CreateUserIfNotExist } from '../services/userService'
import { SendMessageToQueue } from '../mq/createChannel'
import { sendMessageToS2, sendMessageToS3 } from '../socket/JS/userSocket.js'
import historyService from './historyService'

const CreateTrip = async (data) => {
    return new Promise(async (resolve, reject) => {
        //location
        const lat1 = data.start.lat
        const lng1 = data.start.lng
        const place1 = data.start.place
        const lat2 = data.end.lat
        const lng2 = data.end.lng
        const place2 = data.end.place
        const now = new Date()

        //user_info
        const user_id = data.user_id
        const is_scheduled = data.is_scheduled;

        const schedule_time = is_scheduled ? new Date(data.schedule_time).toLocaleString() : new Date().toLocaleString();
        //Check user role here
        const carType = data.carType
        const status = "Pending"
        const paymentMethod = data.paymentMethod
        const is_paid = false
        const price = data.price
        const trip = {
            start: {
                place: place1,
                lat: lat1,
                lng: lng1
            },
            end: {
                place: place2,
                lat: lat2,
                lng: lng2
            },
            user_id: user_id,
            is_scheduled: is_scheduled,
            schedule_time: schedule_time,
            status: status,
            type: carType,
            paymentMethod: paymentMethod,
            is_paid: is_paid,
            price: price,
            is_callcenter: false,
        }
        // console.log(trip)
        const newTrip = await db.Trip.create(
            trip
        )
        trip.trip_id = newTrip.id
        trip.createdAt = newTrip.createdAt

        // socketServiceTS.AddToTrips(trip)
        console.log(trip)
        if (newTrip.id == null) {
            return resolve({
                statusCode: 500,
                error: new Error('error creating trip')
            })
        }
        console.log("send trip to normal trip queue")
        SendMessageToQueue("book-trip-queue", JSON.stringify(trip))
        return resolve({
            statusCode: 200,
            trip_info: trip,
        })
    })
}

const CreateTripForCallCenter = async (data) => {
    return new Promise(async (resolve, reject) => {
        // let lat1 = data.start.lat
        // let lng1 = data.start.lng
        const place1 = data.start
        // let lat2 = data.end.lat
        // let lng2 = data.end.lng
        // const place2 = data.end
        const now = new Date()
        const phone = data.phone

        const is_scheduled = data.is_scheduled
        const schedule_time = is_scheduled ? new Date(data.schedule_time).toLocaleString() : new Date().toLocaleString();
        const status = "Pending"
        const paymentMethod = data.paymentMethod
        const is_paid = false
        const price = data.price

        const user = await userService.CreateUserIfNotExist(phone);
        const user_id = user.id;

        console.log(user_id)

        let trip = {
            start: {
                place: place1
            },
            user_id: user_id,
            is_scheduled: is_scheduled,
            schedule_time: schedule_time,
            status: "Callcenter",
            paymentMethod: paymentMethod,
            is_paid: is_paid,
            price: price,
        }
        // console.log(trip)
        const newTrip = await db.Trip.create(
            trip
        )
        trip.trip_id = newTrip.id
        console.log(trip)
        if (newTrip.id == null) {
            return resolve({
                statusCode: 500,
                error: new Error('error creating trip')
            })
        }
        return resolve({
            statusCode: 200,
            trip_info: trip,
        })
    })
}

const getAppointmentTrip2 = async () => {
    return new Promise(async (resolve, reject) => {
        const trips = await db.Trip.findAll(
            {
                where: {
                    is_scheduled: true,
                    driver_id: null
                    // status:
                    //     { [Op.eq]: "Waiting" }
                },
                include: {
                    model: db.User,
                    as: 'user',
                    attributes: ['name', 'phone']
                },
                order: [
                    ['createdAt', 'DESC'],
                ]
            }
        )
        trips.forEach(trip => {
            trip.start = JSON.parse(trip.start)
            trip.end = JSON.parse(trip.end)
            trip.schedule_time = new Date(trip.schedule_time)
        })
        return resolve({
            statusCode: 200,
            trips: trips
        })
        // let trips = await db.sequelize.query("SELECT DISTINCT * FROM trips join users on users.id = trips.user_id")
        // resolve({ trips })
    })
}

let GetTripById = async (trip_id) => {
    const trips = await db.Trip.findOne(
        {
            where: { id: trip_id },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['name', 'phone']
                },
                {
                    model: db.User,
                    as: 'driver',
                    attributes: ['name', 'phone']
                }
            ]
        },


    )
    if (trips == null) throw new Error("Couldn't find trip")
    trips.start = JSON.parse(trips.start)
    trips.end = JSON.parse(trips.end)
    return (trips)
}

const AcceptTrip = async (data) => {
    try {

        const trip = await GetTripById(data.trip_id)
        // let driver_id = data.driver_id
        // if (trip.trips.id == null) throw new Error("Couldn't find trip")
        if (trip.status == "Cancelled") throw new Error("Trip has been cancelled")
        else if (trip.status == "Confirmed") {
            throw new Error("Trip has been confirmed by other driver")
        } else if (trip.status != "Waiting") throw new Error("Trip is not waiting")
    } catch (error) {
        throw error
    }
    const result = await db.Trip.update(
        { status: 'Confirmed', driver_id: data.driver_id },
        {
            where: {
                id: data.trip_id,
            }
        }
    )
    if (result != 1) {
        throw new Error("Something went wrong")
    }
    const newTrip = await GetTripById(data.trip_id)
    return newTrip
}

const CancelTrip = async (trip_id) => {
    try {
        let trip = await GetTripById(trip_id)
        // if (trip.id == null) throw new Error("Couldn't find trip")
        let now = new Date().getTime()
        let createdAt = new Date(trip.createdAt)
        if (now - createdAt.getTime() > 300000) {
            throw new Error("Overtime due")
        }
        // if (trip.status != "Waiting") throw new Error("Trip is not waiting")
    } catch (error) {
        throw error
    }
    let result = await db.Trip.update(
        { status: 'Cancelled' },
        {
            where: {
                id: trip_id,
            }
        }
    )
    if (result != 1) {
        throw new Error("Something went wrong")
    }
    let newTrip = await GetTripById(trip_id)
    return newTrip
}

export const UpdateTrip = async (data) => {
    let updateObj = {}
    if (data.driver_id != null) {
        updateObj.driver_id = data.driver_id
    }
    if (data.status != "Cancelled" && data.status != null) {
        updateObj.status = data.status
    }
    if (data.finished_date != null) {
        updateObj.finished_date = data.finished_date
    }
    // console.log(updateObj)
    // console.log(data.trip_id)
    try {
        const res = await db.Trip.update(updateObj, {
            where: { id: data.trip_id }
        })
        console.log(res)
        if (res != 1) {
            throw new Error("Something went wrong")
        }
        // return {
        //     "message": "success",
        // }
        let newTrip = await GetTripById(data.trip_id)
        return newTrip
    } catch (error) {
        throw error
    }
}

export const DeleteTrip = async (trip_id) => {
    try {
        await db.Trip.destroy({
            where: { id: trip_id }
        })
    } catch (error) {
        throw error
    }

}

export const initTripForCallcenter = async (data) => {
    const phone = data.phone
    const user = await CreateUserIfNotExist(phone)
    console.log("cout<<userid")
    console.log(user.id)
    const start = {
        place: data.start.place,
        lat: data.start.lat,
        lng: data.start.lng
    }
    const status = "Pending"
    const carType = data.carType
    const user_id = user.id
    const trip = {
        phone,
        start,
        user_id: user_id,
        type: carType,
        status
    }
    let newTrip = await db.Trip.create(trip)
    console.log(newTrip)
    trip.trip_id = newTrip.id

    console.log("send trip to callcenter trip queue")
    SendMessageToQueue("callcenter-trip-queue", JSON.stringify(trip))
    return trip

}

export const initTripCallCenterS1 = async (data) => {
    const phone = data.phone
    const user = await CreateUserIfNotExist(phone)
    console.log("cout<<userid")
    console.log(user.id)

    const is_scheduled = data.is_scheduled
    const schedule_time = is_scheduled ? new Date(data.schedule_time).toLocaleString() : new Date().toLocaleString();
    const lat = data.start.lat
    const lng = data.start.lng
    const start = {
        place: data.start.place,
        lat: lat,
        lng: lng
    }
    let status = "Callcenter"
    if (lat !== undefined && lng !== undefined) {
        console.log('Pending')
        status = "Pending"
    } else {
        console.log('Callcenter')
        status = "Callcenter"
    }
    const carType = data.carType
    const user_id = user.id
    const trip = {
        phone,
        start,
        user_id: user_id,
        type: carType,
        status,
        is_callcenter: true,
        is_scheduled: is_scheduled,
        schedule_time: schedule_time
    }
    console.log(trip)
    let newTrip = await db.Trip.create(trip)
    console.log('newTrip')
    console.log(newTrip)
    trip.trip_id = newTrip.id

    // console.log("send trip to callcenter trip queue")
    if (lat !== undefined && lng !== undefined) {
        const result = await db.Trip.findOne({
            where: {
                id: newTrip.id
            },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['name', 'phone'],
                    required: true,
                },
                {
                    model: db.User,
                    as: 'driver',
                    attributes: ['id', 'phone', 'email'],
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
                }
            ],
            attributes: {
                include: [[db.Sequelize.json('start.place'), 'startAddress'], [db.Sequelize.json('end.place'), 'endAddress']],
                exclude: ['createdAt', 'updatedAt', 'accessToken', "start", "end", "driver"]
            },
            raw: true,
            nest: true,
        })
        const a = await historyService.GetHistoryOfDriver(result.driver_id);
        console.log("cout<<data");
        console.log(a);
        result.driver_stats = historyService.GetDriverStatics(a);
        SendMessageToQueue("callcenter-trip-queue", JSON.stringify(trip))
        sendMessageToS3(result)
    }
    else {
        const trip2 = {
            id: trip.trip_id,
            user_phone: phone,
            startAddress: start.place,
            type: carType,
            trip_id: trip.trip_id,
            status: status,
            is_scheduled: is_scheduled,
            schedule_time: schedule_time
        }
        sendMessageToS2(trip2)
    }
    console.log('heeelllllllllll')
    return trip
}

export const initTripCallCenterS2 = async (data) => {
    const trip_id = data.trip_id
    const user_id = data.user_id
    // const user = await CreateUserIfNotExist(phone)
    console.log("cout<<userid")
    const start = {
        place: data.start.place,
        lat: data.start.lat,
        lng: data.start.lng
    }
    const status = "Pending"

    const updateObj = {
        start,
        status
    }
    await db.Trip.update(updateObj, {
        where: { id: trip_id }
    })
    ///
    const result = await db.Trip.findOne({
        where: {
            id: trip_id
        },
        include: [
            {
                model: db.User,
                as: 'user',
                attributes: ['name', 'phone'],
                required: true,
            },
            {
                model: db.User,
                as: 'driver',
                attributes: ['id', 'phone', 'email'],
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
            }
        ],
        attributes: {
            include: [[db.Sequelize.json('start.place'), 'startAddress'], [db.Sequelize.json('end.place'), 'endAddress']],
            exclude: ['createdAt', 'updatedAt', 'accessToken', "start", "end", "driver"]
        },
        raw: true,
        nest: true,
    })

    console.log("cout<<data");

    const a = await historyService.GetHistoryOfDriver(result.driver_id);
    console.log("cout<<data");
    console.log(a);
    result.driver_stats = historyService.GetDriverStatics(a);

    ///
    console.log(result)
    const newTrip = {
        id: result.id,
        trip_id: result.id,
        phone: result.user.phone,
        start: result,
        // user_id: user_id,
        type: result.type,
        status: result.status,
        is_scheduled: result.is_scheduled,
        schedule_time: result.schedule_time
    }
    result.trip_id = result.id
    sendMessageToS3(result)
    console.log("send trip to callcenter trip queue")
    SendMessageToQueue("callcenter-trip-queue", JSON.stringify(newTrip))
    return result
}

export const GetAppointmentTrip = async () => {
    const trips = await db.Trip.findAll({
        where: {
            is_scheduled: true,
            driver_id: null,
        },
        include: {
            model: db.User,
            as: 'user',
            attributes: ['name', 'phone'],
            required: true,
        },
        order: [
            ['createdAt', 'DESC'],
        ]
    }
    )
    if (trips) {
        trips.forEach(trip => {
            trip.start = JSON.parse(trip.start)
            trip.end = JSON.parse(trip.end)
            trip.schedule_time = new Date(trip.schedule_time)
        })
        return trips
    }
    return []
}

export const GetTripS2 = async () => {
    const result = await db.Trip.findAll({
        where: {
            status: "Callcenter",
            // is_callcenter: true,
        },
        include: {
            model: db.User,
            as: 'user',
            attributes: ['name', 'phone'],
            required: true,
        },
        attributes: ["id", "type", 'createdAt', [db.Sequelize.col('user.phone'), 'user_phone'], [db.Sequelize.json('start.place'), 'startAddress'],],
        order: [
            ['createdAt', 'DESC'],
        ],
        raw: true,
        nest: true,
    }
    )
    if (result) {
        return result
    }
    return []
    //phone,place,carType,trip_id
}

export const GetTripS3 = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tmr = new Date(today)
    tmr.setDate(tmr.getDate() + 1);

    const result = await db.Trip.findAll({
        where: {
            status: {
                [Op.ne]: "Callcenter"
            },
            // createdAt: {
            //     [Op.between]: [today, tmr]
            // },
            is_callcenter: true
        },
        include: [
            {
                model: db.User,
                as: 'user',
                attributes: ['name', 'phone'],
                required: true,
            },
            {
                model: db.User,
                as: 'driver',
                attributes: ['id', 'phone', 'email'],
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
            }
        ],
        attributes: {
            include: [[db.Sequelize.json('start.place'), 'startAddress'], [db.Sequelize.json('end.place'), 'endAddress']],
            exclude: ['createdAt', 'updatedAt', 'accessToken', "start", "end", "driver"]
        },
        order: [
            ['createdAt', 'DESC'],
        ],
        raw: true,
        nest: true,
    })
    if (result) {
        // console.log(result)
        for (const item of result) {
            console.log(item.driver_id);
            const data = await historyService.GetHistoryOfDriver(item.driver_id);
            console.log("cout<<data");
            console.log(data);
            item["driver_stats"] = historyService.GetDriverStatics(data);
        }
        return result
    }
    return []
}
export const CreateRating = async (trip_id, star) => {
    await db.Rate.create({
        trip_id: trip_id,
        star: star,
    })
}
export default {
    CreateTrip,
    CreateTripForCallCenter,
    GetTripById,
    AcceptTrip,
    CancelTrip,
    CreateRating,
    UpdateTrip,
    DeleteTrip,
    GetTripS2,
    GetTripS3
}