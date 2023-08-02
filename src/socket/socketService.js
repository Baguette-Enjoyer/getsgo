import locationServices from "../services/locationService"
import { getRedisCon } from '../config/connectRedis'
import initServer from "../services/initServer"
import driverServices from "../services/driverServices"
import userService from "../services/userService"
import tripService from "../services/tripService"

let io = initServer.io
let users = new Map()
let drivers = new Map()
let trips = new Map()
let callCenterTrips = new Map()
let current_intervals = new Map()

let rd = getRedisCon()

let initSocket = () => {
    io.on('connection', (socket) => {
        console.log("socket " + socket.id + " connected")
        handleUserLogin(socket)
        handleDriverLogin(socket)
        handleUserFindTrip(socket)
        //handleCallcenterFindTrip(socket)
        handleDriverResponseBooking(socket)
        handleDisconnect(socket)
    })
}

let deleteTripExceedTime = () => {
    setInterval(() => {
        let now = new Date().getTime();
        for ([trip_id, trip_data] of trips) {
            if (now - trip_data.date_reserved.getTime() >= 300000 && (trip_data.status == 'Waiting' || trip_data.status == 'Pending')) {
                let user_id = trip_data.user_id;
                let sockets = GetSocketByUserId(user_id)
                io.to(`/trip/${trip_id}`).emit('trip_cancelled', { message: "Trip cancelled due to not enough driver" })
                for (let i = 0; i < sockets.length; i++) {
                    users.get(sockets[i]).socket.leave(`/trip/${trip_id}`)
                }
            }
        }
    }, 300000);
}

let updateDriverLocation = () => {
    setInterval(() => {
        for ([trip_id, trip_value] in trips) {
            let user_id = trip_value.user_id
            let driver_id = trip_value.driver_id

        }
    }, 60000)
}

let notifyUserWhenDriverClosed = () => {
    setInterval(() => {

    }, 60000)
}
let handleUserLogin = (socket) => {
    socket.on('user-login', (data) => {
        let user_id = data.user_id
        let trip_id = getTripIfDisconnected(user_id)
        if (trip_id != null) {
            socket.join(`/trip/${trip_id}`)
            console.log(`User ${user_id} has rejoin trip ${trip_id}`)
        }
        users.set(socket.id, {
            socket: socket,
            user_id: user_id,
            socket_id: socket.id,
        })

    })
}
let handleDriverLogin = (socket) => {
    socket.on("driver-login", (data) => {
        let driver_id = data.driver_id
        let trip_id = getTripIfDisconnected(driver_id)
        if (trip_id != null) {
            socket.join(`/trip/${trip_id}`)
            console.log(`Driver ${driver_id} has rejoin trip ${trip_id}`)
        }
        drivers.set(socket.id, {
            socket: socket,
            user_id: driver_id,
            lat: data.lat,
            lng: data.lng,
            socket_id: socket.id,
            status: data.driver_status, // idle | offline | driving
            vehicle_type: data.vehicle_type_id
        })
        console.log("current drivers \n", Array.from(drivers))
    })
}

let handleUserFindTrip = (socket) => {
    socket.on('user-find-trip', async (data) => {
        console.log('dataddđ');
        console.log(data);
        //get user data first
        let trip_id = data.trip_id
        let place1 = data.start

        socket.join(`/trip/${trip_id}`)
        let user = getUserBySocket(socket)
        console.log(`User ${user.user_id} has joined trip ${trip_id}`)
        let userData = await userService.GetUserById(user.user_id)
        userData = JSON.stringify(userData)
        //if the trip is scheduled then just add to database and notify driver

        // let dat_ex = {
        //     trip_id: "123",
        //     start: {
        //         lat: 10.0,
        //         lng: 10.0,
        //         name: 'Address 1'
        //     },
        //     end: {
        //         lat: 10.0,
        //         lng: 10.0,
        //         name: 'Address 1'
        //     },
        //     price: 500.00,
        //     is_scheduled: false,
        //     schedule_time: new Date(),
        // }

        let data_response = {
            trip_id: data.trip_id,
            start: data.start,
            end: data.end,
            user: userData,
            user: user.user_id,
            price: data.price,
        }
        let possibleDrivers = locationServices.findPossibleDriver(drivers, place1)

        //broadcast for the first driver
        broadCastToDriver(possibleDrivers[0][1].socket, "user-trip", data_response)
        console.log(`broadcasting to driver ${possibleDrivers[0]}`)

        let i = 1;
        let new_interval = setInterval(() => {
            //
            broadCastToDriver(possibleDrivers[i][1].socket, "user-trip", data_response)
            console.log(`broadcasting to driver ${possibleDrivers[i]}`)
            i++
            if (i >= possibleDrivers.length) {
                setTimeout(async () => {
                    let dat = {
                        trip_id,
                        status: "Waiting"
                    }
                    await tripService.UpdateTrip(dat)
                    // clearInterval(new_interval)
                    // socket.leave(`/trip/${trip_id}`)
                    // trips.delete(trip_id)
                    // console.log(`User ${user.user_id} has left trip ${trip_id}`)
                }, 15000)

                //notify user that no driver has been found
            }
        }, 15000)
        let rdTripKey = `trip_id:${trip_id}`
        let TripData = {
            user_id: user.user_id,
            start: data.start,
            end: data.end,
            driver_id: null,
            date_reserved: new Date(),
            cancellable: true,
        }
        trips.set(trip_id, TripData)
        TripData = JSON.stringify(TripData)
        await rd.set(rdTripKey, TripData)
        console.log(TripData)
        current_intervals.set(trip_id, new_interval)
    })
}

let handleDriverResponseBooking = (socket) => {
    socket.on('driver-response-booking', async (data) => {
        const driver = getDriverBySocket(socket)
        const dat_ex = {
            trip_id: trip_id,
            agree_status: 'accept' || 'deny',
        }
        let trip_id = data.trip_id
        if (data.agree_status == 'deny') return //punish him??

        let driver_data = await driverServices.GetDriverInfoById(driver.user_id)
        let data_foundDriver = {
            trip_id: trip_id,
            driver: JSON.stringify(driver_data),
            message: "found driver",
        }
        if (data.agree_status == 'accept') {
            io.to(`/trip/${trip_id}`).emit('found-driver', data_foundDriver)
            //notify user
            socket.join(`/trip/${trip_id}`)
            let updatedTrip = trips.get(trip_id)
            updatedTrip.driver = socket.id
            trips.set(trip_id, updatedTrip)
            clearInterval(current_intervals.get(trip_id)) //stop broadcasting
            current_intervals.delete(trip_id)
            // let user = trips.get(data.trip_id).user // socket.id
            // broadCastToUser(user,)
        }
    })
}

let handleLocationUpdate = (socket) => {
    socket.on('driver-location-update', (data) => {
        let dat = {
            lat: data.lat,
            lng: data.lng,
        }
        let driver = getDriverBySocket(socket)
        let driver_id = driver.user_id
        let socket_ids = GetSocketByDriverId(driver_id)
        for (let i = 0; i < socket_ids.length; i++) {
            drivers.get(socket_ids[i])
        }


    })
}

let getTripIfDisconnected = (id) => {
    for (const [trip_id, value] of trips) {
        if (value.user_id == id || value.driver_id == id) {
            return trip_id;
        }
    }
    return null;
}

let getUserBySocket = (socket) => {
    
    let id = socket.id
    let socket_value = users.get(id)
    return socket_value
    // this will return a socket value { socket: socket for client, user_id, socket_id}
}
let getDriverBySocket = (socket) => {
    let id = socket.id
    let socket_value = drivers.get(id)
    return socket_value
    //similar to get user by socket
}

let broadCastToUser = (socket, event, data) => {
    let socket_value = users.get(socket.id)
    console.log(socket_value.socket)
    if (socket_value === null) {
        throw new Error("user socket error")
    }
    socket_value.socket.emit(event, data)
}

let GetSocketByUserId = (user_id) => {
    let socketArr = []
    for ([socket_id, socket_value] of users) {
        if (socket_value.user_id == user_id) {
            socketArr.push(socket_id)
        }
    }
    return socketArr
}
let GetSocketByDriverId = (driver_id) => {
    let socketArr = []
    for ([socket_id, socket_value] of drivers) {
        if (socket_value.user_id == driver_id) {
            socketArr.push(socket_id)
        }
    }
    return socketArr
}

let broadCastToDriver = (socket, event, data) => {
    let socket_value = drivers.get(socket.id)
    if (socket_value === null) {
        throw new Error("driver socket error")
    }
    socket_value.socket.emit(event, data)
}

let getUsersBySocket = (socket) => {
    if (users.get(socket.id) !== null) {
        return users.get(socket.id)
    }
    else return drivers.get(socket.id)
}


let handleTripUpdate = () => {

}

let handleDisconnect = (socket) => {
    socket.on('disconnect', () => {
        if (users.get(socket.id)) {
            users.delete(socket.id)
        }
        else {
            drivers.delete(socket.id)
        }
        // users.delete(socket.id)
        console.log("client disconnected " + socket.id)
    })
}

export default initSocket