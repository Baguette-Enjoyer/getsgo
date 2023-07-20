import db from '../models/index'

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
        let status = "Waiting"
        let paymentMethod = data.paymentMethod
        let is_paid = false
        let price = data.price
        let trip = {
            start: {
                name: place1,
                lat: lat1,
                lng: lng1
            },
            end: {
                name: place2,
                lat: lat2,
                lng: lng2
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
                include: {
                    model: db.User,
                    as: 'user',
                    attributes: ['name', 'phone']
                }
            },
            {
                where: { status: "Waiting" },
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
    return new Promise(async (resolve, reject) => {
        let trips = await db.Trip.findOne(
            {
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

            {
                where: { id: trip_id }
            }
        )
        trips.start = JSON.parse(trips.start)
        trips.end = JSON.parse(trips.end)
        return resolve({
            statusCode: 200,
            trips: trips
        })
    })
}

let UpdateTrip = async (data) => {
    return new Promise(async (resolve, reject) => {
        // let trip = await GetTripById(data.trip_id)
        let updateObj = {}
        if (data.driver_id != undefined) {
            updateObj.driver_id = data.driver_id
        }
        if (data.status != undefined) {
            updateObj.status = data.status
        }
        if (data.finished_date != undefined) {
            updateObj.finished_date = data.finished_date
        }
        // console.log(updateObj)
        // console.log(data.trip_id)
        try {
            const result = await db.Trip.update(
                updateObj,
                {
                    where: {
                        id: data.trip_id,
                    }
                }
            )
            let newTrip = await GetTripById(data.trip_id)
            return resolve(newTrip)
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }

    })
}
let GetAppointmentTrip = async () => {
    return new Promise((resolve, reject) => {

    })
}

export default {
    CreateTrip,
    GetAvailableTrip,
    GetTripById,
    UpdateTrip
}