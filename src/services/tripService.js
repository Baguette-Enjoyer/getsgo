import { Op } from 'sequelize'
import db from '../models/index'
import userService from './userService'
import socketServiceTS from '../socket/socketServiceTS.js'
let CreateTrip = async (data) => {
    return new Promise(async (resolve, reject) => {
        //location
        let lat1 = data.start.lat
        let lng1 = data.start.lng
        let place1 = data.start.place
        let lat2 = data.end.lat
        let lng2 = data.end.lng
        let place2 = data.end.place
        let now = new Date()

        //user_info
        let user_id = data.user_id
        let is_scheduled = data.is_scheduled
        let scheduled_time = is_scheduled ? data.schedule_time : now
        //Check user role here
        let status = "Pending"
        let paymentMethod = data.paymentMethod
        let is_paid = false
        let price = data.price
        let trip = {
            start: JSON.stringify({
                name: place1,
                lat: lat1,
                lng: lng1
            }),
            end: JSON.stringify({
                name: place2,
                lat: lat2,
                lng: lng2
            }),
            user_id: user_id,
            is_scheduled: is_scheduled,
            scheduled_time: scheduled_time,
            status: status,
            paymentMethod: paymentMethod,
            is_paid: is_paid,
            price: price,
        }
        // console.log(trip)
        let newTrip = await db.Trip.create(
            trip
        )
        trip.trip_id = newTrip.id
        socketServiceTS.AddToTrips(trip)
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

let CreateTripForCallCenter = async (data) => {
    return new Promise(async (resolve, reject) => {
        // let lat1 = data.start.lat
        // let lng1 = data.start.lng
        let place1 = data.start
        // let lat2 = data.end.lat
        // let lng2 = data.end.lng
        let place2 = data.end
        let now = new Date()
        let phone = data.phone

        let is_scheduled = data.is_scheduled
        let scheduled_time = is_scheduled ? data.schedule_time : now
        let status = "Pending"
        let paymentMethod = data.paymentMethod
        let is_paid = false
        let price = data.price

        let user = await userService.CreateUserIfNotExist(phone);
        let user_id = user.id;

        console.log(user_id)

        let trip = {
            start: {
                name: place1
            },
            end: {
                name: place2
            },
            user_id: user_id,
            is_scheduled: is_scheduled,
            scheduled_time: scheduled_time,
            status: status,
            paymentMethod: paymentMethod,
            is_paid: is_paid,
            price: price,
        }
        // console.log(trip)
        let newTrip = await db.Trip.create(
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

let GetAvailableTrip = async () => {
    return new Promise(async (resolve, reject) => {
        let trips = await db.Trip.findAll(
            {
                where: {
                    status:
                        { [Op.eq]: "Waiting" }
                },
            },
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
    let trips = await db.Trip.findOne(
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

let AcceptTrip = async (data) => {
    try {

        let trip = await GetTripById(data.trip_id)
        // let driver_id = data.driver_id
        // if (trip.trips.id == null) throw new Error("Couldn't find trip")
        if (trip.status == "Cancelled") throw new Error("Trip has been cancelled")
        else if (trip.status == "Confirmed") {
            throw new Error("Trip has been confirmed by other driver")
        } else if (trip.status != "Waiting") throw new Error("Trip is not waiting")
    } catch (error) {
        throw error
    }
    let result = await db.Trip.update(
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
    let newTrip = await GetTripById(data.trip_id)
    return newTrip
}

let CancelTrip = async (trip_id) => {
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

let UpdateTrip = async (data) => {
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
        let res = await db.Trip.update(updateObj, {
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

let DeleteTrip = async (trip_id) => {
    try {
        await db.Trip.destroy({
            where: { id: trip_id }
        })
    } catch (error) {
        throw error
    }

}
let GetAppointmentTrip = async () => {
    return new Promise((resolve, reject) => {

    })
}

export default {
    CreateTrip,
    CreateTripForCallCenter,
    GetAvailableTrip,
    GetTripById,
    AcceptTrip,
    CancelTrip,
    UpdateTrip,
    DeleteTrip
}