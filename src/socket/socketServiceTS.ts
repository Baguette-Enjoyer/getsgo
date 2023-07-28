import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import locationServices from "../services/locationService"
import { getRedisCon } from '../config/connectRedis'
import initServer from "../services/initServer"
import driverServices from "../services/driverServices"
import userService from "../services/userService"
import tripService from "../services/tripService"
import ggMapService from "./ggMapService.js"
// let io = initServer.getIO()
let rd = getRedisCon()

interface User {
    user_id: number
    socket_id: string
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
}

interface Driver {
    user_id: number
    socket_id: string
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap,any>
    lat: number
    lng: number
    status: string
    vehicle_type: string
}

interface TripValue {
    trip_id: number
    user_id?: number
    driver_id?: number 
    start: {
        lat: number
        lng: number
        place: string
    }
    end: {
        lat: number
        lng: number
        place: string
    }
    status?: "Pending" | "Waiting" | "Confirmed" | "Driving" | "Arrived" | "Done" | "Cancelled"
    price: number
    is_paid: boolean
    paymentMethod: string
    is_scheduled: boolean
    createdAt: Date
    cancellable: boolean
    finished_date?: Date
    schedule_time?: Date
}


let users = new Map<string,User>()
let drivers = new Map<string, Driver>()
let trips = new Map<number,TripValue>()
let callcenterTrips = new Map<number, TripValue>()
let current_intervals = new Map<number,NodeJS.Timer>()

let updateLocationLoop = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {   
    // for (const [trip_id, trip_value] of trips) {
    //     let driver_id = trip_value.driver_id
    //     if (driver_id === undefined) return 
    //     // let socketDriver = GetSocketByDriverId(driver_id)
    //     let driver_info = getCurrentDriverInfoById(driver_id)
    //     let stringifiedResponse = JSON.stringify(driver_info)
    //     io.to(`/trip/${trip_id}`).emit('location-update',stringifiedResponse)
    // }
    trips.forEach((trip_value, trip_id) => {
        let driver_id = trip_value.driver_id
        if (driver_id === undefined) return 
        // let socketDriver = GetSocketByDriverId(driver_id)
        let driver_info = getCurrentDriverInfoById(driver_id)
        let stringifiedResponse = JSON.stringify(driver_info)
        io.to(`/trip/${trip_id}`).emit('location-update',stringifiedResponse)
    })
    setTimeout(() => updateLocationLoop(io),60000)
}

let deleteTripExceeded = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    setInterval(()=>{
        let now = new Date().getTime()
        // for (const [trip_id,trip_value] of trips){
        //     if (now - trip_value.createdAt.getTime() >= 300000 && trip_value.status === 'Pending' && trip_value.driver_id == null){
        //         io.in(`/trip/${trip_id}`).emit('trip-cancelled',{message:"trip cancelled due to lack of driver"})
        //         io.in(`/trip/${trip_id}`).socketsLeave(`/trip/${trip_id}`)
        //     }
        // }
        trips.forEach((trip_value,trip_id) => {
            if (now - trip_value.createdAt.getTime() >= 300000 && trip_value.status === 'Pending' && trip_value.driver_id == null){
                io.in(`/trip/${trip_id}`).emit('trip-cancelled',{message:"trip cancelled due to lack of driver"})
                io.in(`/trip/${trip_id}`).socketsLeave(`/trip/${trip_id}`)
            }
        })
    },300000)
}

let notifyIfClose = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    // for (const [trip_id,trip_value] of trips){
    //     if(locationServices.getDistance(trip_value.start.lat,trip_value.start.lng,trip_value.end.lat,trip_value.end.lng) <= 1){
    //         io.in(`/trip/${trip_id}`).emit('driver-close', {message:"driver is close"})
    //     }
    // }
    trips.forEach((trip_value, trip_id) =>{
        if(locationServices.getDistance(trip_value.start.lat,trip_value.start.lng,trip_value.end.lat,trip_value.end.lng) <= 1){
            io.in(`/trip/${trip_id}`).emit('driver-close', {message:"driver is close"})
        }
    })
    setTimeout(()=>notifyIfClose(io),15000)
}

let runSocketService = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    initSocket(io);
    initSocketService(io);
    console.log("socket service started")
}

let initSocketService = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    updateLocationLoop(io)
    deleteTripExceeded(io)
    notifyIfClose(io)
}

let initSocket = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    io.on('connection', (socket) => {
        console.log("socket " + socket.id + " connected")
        handleUserLogin(socket)
        handleDriverLogin(socket)
        handleUserFindTrip(socket)
        //handleCallcenterFindTrip(socket)
        handleDriverResponseBooking(io,socket)
        handleDisconnect(socket)
    })
}


let handleUserLogin = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap,any> ) =>{
    socket.on('user-login',(data:User) =>{
        let user_id = data.user_id
        let trip_id = GetCurrentTripOfUser(user_id)
        if(trip_id!=null){
            socket.join(`/trip/${trip_id}`)
            socket.emit('user-rejoin',{message:"user rejoin trip"})
        }
        users.set(socket.id, {
            user_id: user_id,
            socket: socket,
            socket_id: socket.id,
        })
    })
}

let handleDriverLogin = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap,any> ) =>{
    socket.on('driver-login',(data:Driver) =>{
        let user_id = data.user_id
        let trip_id = GetCurrentTripOfUser(user_id)
        if(trip_id!=null){
            socket.join(`/trip/${trip_id}`)
            socket.emit('user-rejoin',{message:"driver rejoin trip"})
        }
        drivers.set(socket.id, {
            user_id: user_id,
            socket: socket,
            socket_id: socket.id,
            lat: data.lat,
            lng: data.lng,
            status: data.status,
            vehicle_type:data.vehicle_type,
        })
    })
}

let handleUserFindTrip = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap,any>) => {
    socket.on('user-find-trip',async (data:TripValue) =>{
        let trip_id = data.trip_id
        let place1 = data.start

        let user = getUserBySocket(socket)
        let user_id = user?.user_id

        let userData = await userService.GetUserById(user_id)
        // let userDataStringified = JSON.stringify(userData)
        socket.join(`/trip/${trip_id}`)
        let DataResponse = {
            user_info: userData,
            trip_info:data
        }
        let DataResponseStringified = JSON.stringify(DataResponse)

        let possibleDrivers = locationServices.findPossibleDriver(drivers, place1)
        broadCastToDriver(possibleDrivers[0][1].socket, "user-trip", DataResponseStringified)
        console.log(`broadcasting to driver ${possibleDrivers[0]}`)

        let i = 1;
        let new_interval = setInterval(() => {
            //
            broadCastToDriver(possibleDrivers[i][1].socket, "user-trip", DataResponseStringified)
            console.log(`broadcasting to driver ${possibleDrivers[i]}`)
            i++
            if (i >= possibleDrivers.length) {
                setTimeout(async () => {
                    let dat = {
                        trip_id,
                        status: "Waiting"
                    }
                    await tripService.UpdateTrip(dat)
                    clearInterval(new_interval)
                    // socket.leave(`/trip/${trip_id}`)
                    // trips.delete(trip_id)
                    // console.log(`User ${user.user_id} has left trip ${trip_id}`)
                }, 15000)

                //notify user that no driver has been found
            }
        }, 15000)
        let rdTripKey = `trip_id:${trip_id}`
        trips.set(trip_id, data)
        let TripDataStringified = JSON.stringify(data)
        await rd.set(rdTripKey, TripDataStringified)
        current_intervals.set(trip_id, new_interval)
    })
}

let handleCallcenterFindTrip = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap,any>) =>{
    socket.on('callcenter-find-trip', async(data:TripValue) =>{
        let trip_id = data.trip_id
        let place1 = data.start

        // khong can dung toi user
        // let user_id = data.user_id
        // let user = await userService.GetUserById(user_id)
        let DataResponse = {
            trip_info:data
        }
        let DataResponseStringified = JSON.stringify(DataResponse)
        let possibleDrivers = locationServices.findPossibleDriver(drivers,place1)
        broadCastToDriver(possibleDrivers[0][1].socket, "user-trip", DataResponseStringified)
        console.log(`broadcasting to driver ${possibleDrivers[0]}`)
        let i = 1;
        let new_interval = setInterval(() => {
            //
            broadCastToDriver(possibleDrivers[i][1].socket, "user-trip", DataResponseStringified)
            console.log(`broadcasting to driver ${possibleDrivers[i]}`)
            i++
            if (i >= possibleDrivers.length) {
                setTimeout(async () => {
                    let dat = {
                        trip_id,
                        status: "Waiting"
                    }
                    await tripService.UpdateTrip(dat)
                    clearInterval(new_interval)
                    // socket.leave(`/trip/${trip_id}`)
                    // trips.delete(trip_id)
                    // console.log(`User ${user.user_id} has left trip ${trip_id}`)
                }, 15000)

                //notify user that no driver has been found
            }
        }, 15000)
    })
}

let handleDriverResponseBooking = (io:Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap,any>) =>{
    socket.on('driver-response-booking', async (data: {trip_id:number,status: 'Agree'|'Deny'})=>{
        let driver = getDriverBySocket(socket)
        let driver_id = driver?.user_id
        let trip_id = data.trip_id
        if (data.status == 'Deny' ) return 
        await tripService.UpdateTrip({trip_id:trip_id,status:"Confirmed",driver_id: driver_id})
        let driverData = await driverServices.GetDriverInfoById(driver_id)
        let responseData = {
            trip_id: trip_id,
            driver_info: driverData,
            message: "found driver"
        }
        let stringifiedResponse = JSON.stringify(responseData)
        io.to(`/trip/${trip_id}`).emit('found-driver', stringifiedResponse)
        socket.join(`/trip/${trip_id}`)
        let updatedTrip = trips.get(trip_id)
        updatedTrip!.driver_id = driver_id
        if (updatedTrip === undefined) return
        trips.set(trip_id, updatedTrip)
        clearInterval(current_intervals.get(trip_id))
        current_intervals.delete(trip_id)
    })
}

let handleLocationUpdate = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap,any>) => {
    socket.on('driver-location-update', (data: {lat:number,lng:number}) => {
        let driver = getDriverBySocket(socket)
        let driver_id = driver?.user_id 
        if (driver_id == undefined) return
        let socket_ids = GetSocketByDriverId(driver_id)
        
        for (let i = 0; i < socket_ids.length; i++) {
            let driver = drivers.get(socket_ids[i])
            if (driver == undefined) return
            driver!.lat = data.lat 
            driver!.lng = data.lng 
            drivers.set(socket_ids[i], driver)
        }
    })
    
}

let getTripIfDisconnected = (id:number) => {
    // for (const [trip_id, value] of trips) {
        
    // }
    trips.forEach((trip_value, trip_id) => {
        if (trip_value.user_id == id || trip_value.driver_id == id) {
            return trip_id;
        }
    })
    return null;
}

let getUserBySocket = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap,any>) => {
    let id = socket.id
    let socket_value = users.get(id)
    return socket_value
    // this will return a socket value { socket: socket for client, user_id, socket_id}
}
let getDriverBySocket = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap,any>) => {
    let id = socket.id
    let socket_value = drivers.get(id)
    return socket_value
    //similar to get user by socket
}

let broadCastToUser = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap,any>, event:string, data:string) => {
    let socket_value = users.get(socket.id) || undefined
    if (socket_value === undefined ){return}
    // console.log(socket_value.socket)
    if (socket_value === null) {
        throw new Error("user socket error")
    }
    socket_value.socket.emit(event, data)
}

let GetSocketByUserId = (user_id:number) => {
    let socketArr:string[] = []
    // for (const [socket_id, socket_value] of users) {
    //     if (socket_value.user_id == user_id) {
    //         socketArr.push(socket_id)
    //     }
    // }
    users.forEach((socket_value,socket_id)=>{
        if (socket_value.user_id == user_id) {
            socketArr.push(socket_id)
        }
    })
    return socketArr
}
let GetSocketByDriverId = (driver_id:number) => {
    let socketArr:string[] = []
    drivers.forEach((socket_value,socket_id)=>{
        if (socket_value.user_id == driver_id) {
            socketArr.push(socket_id)
        }
    })
    return socketArr
}

let broadCastToDriver = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap,any>, event:string, data:string) => {
    let socket_value = drivers.get(socket.id) || undefined
    if (socket_value === undefined ){return}
    if (socket_value === null) {
        throw new Error("driver socket error")
    }
    socket_value.socket.emit(event, data)
}

let getUsersBySocket = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap,any>) => {
    if (users.get(socket.id) !== null) {
        return users.get(socket.id)
    }
    else return drivers.get(socket.id)
}

let getCurrentDriverInfoById = (id:number): {lat:number,lng:number} => {
    // for (const [driver_id,driver_value] of drivers) {
    //     if (driver_value.user_id === id ) {
    //         return {
    //             lat: driver_value.lat,
    //             lng: driver_value.lng
    //         }
    //     }
    // }
    drivers.forEach((socket_value,socket_id)=>{
        if (socket_value.user_id == id) {
            return {
                lat: socket_value.lat,
                lng: socket_value.lng
            }
        }
    })
    return {lat:0,lng:0}
}

let GetCurrentTripOfUser = (id:number): string|null => {
    trips.forEach((trip_value,trip_id)=>{
        if (trip_value.user_id == id || trip_value.driver_id == id) {
            return trip_id;
        }
    })
    return null;
}

let GetDriversAround3KM = (data: {lat:number,lng:number}) => {
    let lat1 = data.lat;
    let lng1 = data.lng;
    let posDrivers: {lat:number,lng:number}[] = []
    // for (const [driver_id,driver_value] of drivers) {
    //     if (locationServices.getDistance(lat1,lng1,driver_value.lat,driver_value.lng) <= 3){
    //         posDrivers.push({lat:driver_value.lat,lng:driver_value.lng})
    //     }
    // }
    drivers.forEach((driver_value,driver_id)=>{
        if (locationServices.getDistance(lat1,lng1,driver_value.lat,driver_value.lng) <= 3){
            posDrivers.push({lat:driver_value.lat,lng:driver_value.lng})
        }
    })
    return posDrivers
}

let handleDisconnect = (socket:Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap,any>) => {
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

let test = () =>{
    console.log(1)
}

export default {
    runSocketService,
    GetDriversAround3KM,
    test,
}
