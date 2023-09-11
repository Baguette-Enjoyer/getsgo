import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { io } from "../../services/initServer"
import userService from "../../services/userService"
import locationServices from "../../services/locationService"
import { initConvo, addChatMessage, dropConvo } from "../../services/chatService"
import { DriverInBroadcast, DriverMap, TripMap, UserMap } from './storage'
import tripService, { GetRunningTripOfDriver } from "../../services/tripService"
import driverServices from "../../services/driverServices"
import initRedis from "../../config/connectRedis"
import { sendMessageToS3 } from "./userSocket"
import { sendMessageFirebase } from '../../firebase/firebaseApp.js'

interface Driver {
    user_id: number
    lat: number
    lng: number
    heading: number
    status: string
    vehicle_type: string
    hasResponded?: boolean
    client_id?: number | undefined
    rating: number | 0
    response?: 'Accept' | 'Deny' | string
    token_fcm: string
}

interface TripValue {
    trip_id: number
    user_id: number
    driver_id?: number
    driver?: any
    user?: any
    start: {
        lat: number
        lng: number
        place: string
    }
    end?: {
        lat: number
        lng: number
        place: string
    }
    status?: "Pending" | "Waiting" | "Confirmed" | "Arrived" | "Driving" | "Done" | "Cancelled" | string
    price?: number
    is_paid?: boolean
    paymentMethod?: string
    is_scheduled: boolean
    createdAt: Date
    cancellable: boolean
    finished_date?: Date
    schedule_time?: Date
    is_callcenter: boolean
    duration?: string
    distance?: number
}

export const handleDriverLogin = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('driver-login', async (data: Driver) => {
        const user_id = data.user_id

        const d = DriverMap.getMap().get(user_id.toString())

        let driver_data: Driver
        if (d) {
            console.log('thèn có trip nhen')
            driver_data = {
                user_id: user_id,
                status: "Driving",
                vehicle_type: d.vehicle_type,
                rating: d.rating,
                client_id: d.client_id,
                token_fcm: d.token_fcm,
                lat: data.lat,
                lng: data.lng,
                heading: data.heading,
            }
            DriverMap.getMap().set(socket.id, driver_data)
            DriverMap.getMap().delete(user_id.toString())
        }
        else {
            console.log('thèn này k có trip nhen')
            const driver_info = await driverServices.GetDriverInfoById(user_id)
            console.log(driver_info)
            driver_data = {
                user_id: user_id,
                lat: data.lat,
                lng: data.lng,
                status: data.status,
                heading: data.heading,
                vehicle_type: driver_info.driver_info.driver_vehicle.vehicle_type.id,
                rating: Math.round((driver_info.statics.starResult) * 100) / 100,
                client_id: undefined,
                token_fcm: driver_info.driver_info.token_fcm,
            }
            DriverMap.getMap().set(socket.id, driver_data)
        }
        const currentTrip = await getDriverCurrentTrip(user_id)
        console.log(currentTrip)
        socket.join(`/driver/${user_id}`)
        if (currentTrip != null)
            io.in(`/driver/${user_id}`).emit("driver-reconnect", currentTrip)
        console.log(driver_data);

        // console.log(data)
    })
}

export const getDriverCurrentTrip = async (driver_id: number) => {
    console.log(TripMap.getMap())
    console.log('xin chào')
    for (const [trip_id, trip_value] of TripMap.getMap()) {
        // console.log(trip_value)
        if (trip_value?.driver_id != undefined && trip_value?.driver_id == driver_id) {
            const userInfo = await userService.getBasicUserInfo(trip_value.user_id)
            const returnDat = trip_value
            returnDat["user"] = userInfo
            return {
                'trip_info': trip_value,
                'user_info': userInfo
            }
        }
    }
    return null
}

const senDriver = async (trip: TripValue, driver: Driver, socket_id: any) => {
    await tripService.UpdateTrip({ trip_id: trip.trip_id, status: "Confirmed", driver_id: driver.user_id })
    let driverData = await driverServices.GetDriverInfoById(driver.user_id);
    let responseData = {
        trip_id: trip.trip_id,
        driver_info: driverData,
        lat: driver.lat,
        lng: driver.lng,
        heading: driver.heading,
        message: "coming",
        status: "Confirmed",
        is_scheduled: trip.is_scheduled
    }
    // const user = userService.getUserBySocket(trip.user_id);
    // const stringifiedResponse = JSON.stringify(responseData);
    console.log('555555555555');
    console.log(responseData.driver_info);
    console.log(responseData.driver_info.User);
    console.log(responseData);
    console.log("gửi user đã tìm thấy tài xế",trip.user_id)
    io.in(`/user/${trip.user_id}`).emit('found-driver', responseData)
    io.in("callcenter").emit('found-driver', responseData)
    // khi driver chấp nhận thì set lại client_id cho tài xế đó
    driver.client_id = trip.user_id
    DriverMap.getMap().set(socket_id, driver)
    // await initConvo(trip.trip_id, trip.user_id, driver.user_id)
}
export const handleDriverResponseBooking = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('driver-response-booking', async (data: { trip: TripValue, status: 'Accept' | 'Deny' }) => {
        // console.log(data)
        console.log('driver response nè')
        const driver = DriverMap.getMap().get(socket.id)
        if (driver == undefined) return
        if (data.status == "Accept") {
            const trip = TripMap.getMap().get(data.trip.trip_id)
            if (trip !== undefined && trip.driver_id === undefined) {
                trip.driver_id = driver.user_id
                trip.status = 'Confirmed'
                driver.response = "Accept"
                driver.status = "Driving"
                // const newTrip = trip
                // trip.status = 'Confirmed'
                // trip.driver_id = driver.user_id
                console.log("chuyến hiện tại nè >< :")
                console.log(trip)
                TripMap.getMap().set(trip.trip_id, trip)
                DriverMap.getMap().set(socket.id, driver)

                senDriver(trip, driver, socket.id);

                //thông báo cho driver nhận chuyến ok
                io.in(`/driver/${driver.user_id}`).emit("receive-trip-success", "successfully received trip")
                console.log("cập nhật chuyến đi thành confirmed do có driver nhận")
                // await tripService.UpdateTrip({trip_id: trip.trip_id,status:"Confirmed"})
                //ádasdasdada
            }
            else {
                //thông báo driver user đã có chuyến
                console.log("nhận chuyến fail nè")
                io.in(`/driver/${driver.user_id}`).emit("received-trip-fail", "user in another trip")
            }
        }
        else {
            driver.response = "Deny"
            DriverMap.getMap().set(socket.id, driver)
            console.log("thằng này mới deny: ", DriverMap.getMap().get(socket.id))
        }
        // let driver_id = driver?.user_id
        // let trip_id = data.trip_id
        // setDriverResponseStatus(driver_id, data.status)
        // console.log(DriverMap.getMap().get(socket.id))

        //long
        // console.log(data)
        // let driver = DriverMap.getMap().get(socket.id)
        // if (driver == undefined) return
        // let driver_id = driver?.user_id
        // let trip_id = data.trip_id
        // setDriverResponseStatus(driver_id, data.status)
        // console.log(DriverMap.getMap().get(socket.id))


        // if (data.status == 'Deny' ) return 

        // driver.status = 'Driving'
        // drivers.set(socket.id,driver)
        // await tripService.UpdateTrip({trip_id:trip_id,status:"Confirmed",driver_id: driver_id})
        // let driverData = await driverServices.GetDriverInfoById(driver_id)

        // let responseData = {
        //     trip_id: trip_id,
        //     driver_info: driverData,
        //     message: "found driver"
        // }
        // let stringifiedResponse = JSON.stringify(responseData)
        // let trip = trips.get(trip_id)
        // let user_id = trip?.user_id

        // // io.to(`/trip/${trip_id}`).emit('found-driver', stringifiedResponse)
        // // socket.join(`/trip/${trip_id}`)
        // io.in(`/user/${user_id}`).emit('found-driver', stringifiedResponse)

        // let updatedTrip = trips.get(trip_id)
        // updatedTrip!.driver_id = driver_id
        // if (updatedTrip === undefined) return
        // trips.set(trip_id, updatedTrip)
        // clearInterval(current_intervals.get(trip_id))
        // current_intervals.delete(trip_id)
    })
}

export const setDriverStatus = (driver_id: number, status: string) => {
    DriverMap.getMap().forEach((driver_value, socketid) => {
        if (driver_value.user_id === driver_id) {
            driver_value.status = status
            return
        }
    })
}

export const setDriverResponseStatus = (driver_id: number, status: string) => {
    if (status == undefined) return
    DriverMap.getMap().forEach((driver_value, socketid) => {
        if (driver_value.user_id === driver_id) {
            // driver_value.hasResponded = true
            driver_value.response = status

            setTimeout(() => {
                // driver_value.hasResponded = false,
                driver_value.response = undefined
            }, 30000)
            return
        }
    })
}

export const getCurrentDriverInfoById = (id: number): Driver => {
    for (const [socket_id, socket_value] of DriverMap.getMap()) {
        if (socket_value.user_id == id) {
            return socket_value
        }
    }
    return { user_id: 0, status: "", lat: 0, lng: 0, heading: 0, rating: 0, token_fcm: "000", vehicle_type: "1" }
}

export const handleLocationUpdate = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('driver-location-update', (data: { lat: number, lng: number, heading: number, directions: string }) => {
        let driver = DriverMap.getMap().get(socket.id)
        if (driver == undefined) return
        // let driver_id = driver?.user_id
        // let socket_ids = GetSocketByDriverId(driver_id)

        // for (let i = 0; i < socket_ids.length; i++) {
        //     let driver = DriverMap.getMap().get(socket_ids[i])
        //     if (driver == undefined) return
        //     driver!.lat = data.lat
        //     driver!.lng = data.lng
        //     driver!.heading = data.heading
        //     DriverMap.getMap().set(socket_ids[i], driver)
        // } 
        driver!.lat = data.lat
        driver!.lng = data.lng
        console.log('update location driver')
        driver!.heading = data.heading
        if (driver.client_id !== undefined) {
            io.in(`/user/${driver.client_id}`).emit('get-location-driver', data)
        }
    })
}

export const handleMessageFromUser = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on("user-message", async (data: { trip_id: number, user_id: number, message: string }) => {
        const driverData = await driverServices.GetDriverInfoById(data.user_id)
        console.log('driver data nef');
        console.log(driverData);
        sendMessageFirebase(driverData.driver_info.token_fcm, 'khách hàng', data.message)
        io.in(`/driver/${data.user_id}`).emit("message-to-driver", data.message)
    })
}

export const GetSocketByDriverId = (driver_id: any) => {
    for (const [socket_id, socket_value] of DriverMap.getMap()) {
        if (socket_value.user_id == driver_id) {
            return socket_value
        }
    }
    return null
}

export const BroadcastIdleDrivers = (event: string, data: any) => {
    DriverMap.getMap().forEach((socket_value, socket_id) => {
        if (socket_value.status == "Idle") {
            console.log("thằng này rãnh t broadcast nè", socket_value.user_id)
            io.in(`/driver/${socket_value.user_id}`).emit(event, data)
        }
    })
}