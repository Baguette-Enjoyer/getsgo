import locationServices from "./locationService"
import initServer from "./initServer"

let io = initServer.io
let users = new Map()
let drivers = new Map()
let trips = new Map()
let current_intervals = new Map()

let initSocket = () => {
    io.on('connection', (socket) => {
        console.log("socket " + socket.id + " connected")
        handleUserLogin(socket)
        handleDriverLogin(socket)
        handleUserFindTrip(socket)
        handleDriverResponseBooking(socket)
        handleDisconnect(socket)
    })
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
            status: data.driver_status, // idle | offline | 
        })
        console.log("current drivers \n", Array.from(drivers))
    })
}

let handleUserFindTrip = (socket) => {
    socket.on('user-find-trip', (data) => {
        //get user data first
        let trip_id = data.trip_id
        let place1 = data.start

        socket.join(`/trip/${trip_id}`)
        let user = getUserBySocket(socket)
        console.log(`User ${user.user_id} has joined trip ${trip_id}`)
        // let userData = await userService.getUserById(user.user_id)

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
            // user: userData,
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
                setTimeout(() => {
                    clearInterval(new_interval)
                    socket.leave(`/trip/${trip_id}`)
                    console.log(`User ${user.user_id} has left trip ${trip_id}`)
                }, 15000)
                // socket.emit('no_driver_found', {
                //     trip_id: data.trip_id,
                //     message: "No driver found",
                // })
                //notify user that no driver has been found
            }
        }, 15000)
        trips.set(trip_id, {
            user: socket.id,
            user_id: user.user_id,
            driver: null,
            driver_id: null,
            date_reserved: new Date(),
            cancellable: true,
        })
        console.log(trips)
        current_intervals.set(trip_id, new_interval)
    })
}

let handleDriverResponseBooking = (socket) => {
    socket.on('driver-response-booking', async (data) => {
        const driver_id = getDriverBySocket(socket)
        const dat_ex = {
            trip_id: trip_id,
            agree_status: 'accept' || 'deny',
        }
        let trip_id = data.trip_id
        if (data.agree_status == 'deny') return //punish him??

        // let driver_data = await userService.getUserById(driver.user_id)
        let data_foundDriver = {
            trip_id: trip_id,
            driver: "123",
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

let getTripIfDisconnected = (id) => {
    for (const [trip_id, value] of trips) {
        if (value.user_id == id || value.driver_id == id) {
            return trip_id;
        }
    }
    return null;
}

let getUserBySocket = (socket) => {
    // for (const [user_id, user_socket] of users) {
    //     if (socket === user_socket) {
    //         return user_id
    //     }
    // }
    // return null
    let id = socket.id
    let socket_value = users.get(id)
    return socket_value
    // this will return a socket value { socket: socket for client, user_id, socket_id}
}
let getDriverBySocket = (socket) => {
    // for (const [socket_id, driver_socket] of drivers) {
    //     if (socket === driver_socket) {
    //         return driver_socket
    //     }
    // }
    // return null
    let id = socket.id
    let socket_value = drivers.get(id)
    return socket_value
    //similar to get user by socket
}

let broadCastToUser = (socket, event, data) => {
    // let user = users.get(user_id)
    // if (!user) {
    //     return null
    // }
    // user.socket.emit(event, data)
    let socket_value = users.get(socket.id)
    console.log(socket_value.socket)
    if (socket_value === null) {
        throw new Error("user socket error")
    }
    socket_value.socket.emit(event, data)
}

let broadCastToDriver = (socket, event, data) => {
    // let driver = drivers.get(user_id)
    // if (!driver) {
    //     return null
    // }
    // drivers.socket.emit(event, data)
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