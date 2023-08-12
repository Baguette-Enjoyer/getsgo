import { Op } from 'sequelize'
import db from '../models/index'
import userService from './userService'
import Sequelize from 'sequelize'
// import socketServiceTS from '../socket/socketServiceTS.js'
import { CreateUserIfNotExist } from '../services/userService'
import { SendMessageToQueue } from '../mq/createChannel'
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
        const is_scheduled = data.is_scheduled
        const scheduled_time = is_scheduled ? data.schedule_time : now
        //Check user role here
        const carType = data.carType
        const status = "Pending"
        const paymentMethod = data.paymentMethod
        const is_paid = false
        const price = data.price
        const trip = {
            start: JSON.stringify({
                place: place1,
                lat: lat1,
                lng: lng1
            }),
            end: JSON.stringify({
                place: place2,
                lat: lat2,
                lng: lng2
            }),
            user_id: user_id,
            is_scheduled: is_scheduled,
            scheduled_time: scheduled_time,
            status: status,
            type: carType,
            paymentMethod: paymentMethod,
            is_paid: is_paid,
            price: price,
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
        const scheduled_time = is_scheduled ? data.schedule_time : now
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
            scheduled_time: scheduled_time,
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

const GetAvailableTrip = async () => {
    return new Promise(async (resolve, reject) => {
        const trips = await db.Trip.findAll(
            // {
            //     where: {
            //         status:
            //             { [Op.eq]: "Waiting" }
            //     },
            // },
            {
                include: {
                    model: db.User,
                    as: 'user',
                    attributes: ['name', 'phone']
                }
            },

            {
                order: [
                    ['createdAt', 'ASC'],
                ]
            }
        )
        trips.forEach(trip => {
            trip.start = JSON.parse(trip.start)
            trip.end = JSON.parse(trip.end)
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
    const lat = data.start.lat
    const lng = data.start.lng
    const start = {
        place: data.start.place,
        lat: lat,
        lng: lng
    }
    let status = "Callcenter"
    if (lat != null && lng != null) {
        status = "Pending"
    } else {
        status = "Callcenter"
    }
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

    // console.log("send trip to callcenter trip queue")
    if (lat != null && lng != null) {
        SendMessageToQueue("callcenter-trip-queue", JSON.stringify(trip))
    }
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
    const trip = await db.Trip.findOne(
        {
            where: {
                id: trip_id
            },
            include: {
                model: db.User,
                as: 'user',
                attributes: ['name', 'phone'],
                required: true,
            }
        }
    )
    console.log(trip)
    const newTrip = {
        trip_id: trip.id,
        phone: trip.user.phone,
        start: start,
        // user_id: user_id,
        type: trip.type,
        status: trip.status
    }
    // trip.trip_id = newTrip.id

    console.log("send trip to callcenter trip queue")
    SendMessageToQueue("callcenter-trip-queue", JSON.stringify(newTrip))
    return trip
}

export const getAppointmentTrip = async () => {
    const result = await db.Trip.findAll({
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
            ['createdAt', 'ASC'],
        ]
    }
    )
    if (result) {
        return result
    }
    return []
}

export const GetTripS2 = async () => {
    const result = await db.Trip.findAll({
        where: {
            status: "Callcenter"
        },
        include: {
            model: db.User,
            as: 'user',
            attributes: ['name', 'phone'],
            required: true,
        },
        order: [
            ['createdAt', 'ASC'],
        ]
    }
    )
    if (result) {
        return result
    }
    return []
}

export const GetTripS3 = async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tmr = new Date(today)
    tmr.setDate(tmr.getDate() + 1);
    const result = db.Trip.findAll({
        where: {
            createdAt: {
                [Op.between]: [today, tmr]
            }
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
                attributes: ['name', 'phone']
            }
        ],
        order: [
            ['createdAt', 'ASC'],
        ]
    })
    if (result) {
        return result
    }
    return []
}

export default {
    CreateTrip,
    CreateTripForCallCenter,
    GetAvailableTrip,
    GetTripById,
    AcceptTrip,
    CancelTrip,
    UpdateTrip,
    DeleteTrip,
}