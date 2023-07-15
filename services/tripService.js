import db from '../models/index'

let CreateTrip = async (data)=>{
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
        let payment_method = data.payment_method
        let is_paid = false
        let price = data.price
        let trip = {
                start: {
                    name:place1,
                    lat:lat1,
                    lng: lng1
                },
                end: {
                    name:place2,
                    lat:lat2,
                    lng: lng2
                },
                user_id: user_id,
                is_scheduled: is_scheduled,
                scheduled_time: scheduled_time,
                status: status,
                paymentMethod: payment_method,
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
            resolve({
                statusCode:500,
                error:new Error('error creating trip')
            })
        }
        resolve({
            statusCode:200,
            trip_info: trip,
        })
     })
}

let GetAvailableTrip = async () => {
    return new Promise(async (resolve, reject) => { 
        let trips = await db.Trip.findAll(
            {
                where: {status:"Waiting"},
            },
            {
                include: db.User,
            },
            {
                order: [
                    ['createdAt','ASC'],
                ]
            }
        )
        resolve({
            statusCode:200,
            trips : trips
        })

    })
}

let GetAppointmentTrip = async () =>{
    return new Promise((resolve, reject) => { 

     })
}

export default {
    CreateTrip,
    GetAvailableTrip
}