import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { io } from "../../services/initServer"
import userService from "../../services/userService"
import locationServices from "../../services/locationService"
import { DriverInBroadcast, DriverMap, TripMap, UserMap } from './storage'
import tripService from "../../services/tripService"
import driverServices from "../../services/driverServices"
import initRedis from "../../config/connectRedis"

interface Driver {
    user_id: number
    lat: number
    lng: number
    status: string
    vehicle_type: string
    hasResponded?: boolean
    response?: 'Accept' | 'Deny' | string
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
    status?: "Pending" | "Waiting" | "Confirmed" | "Driving" | "Arrived" | "Done" | "Cancelled" | string
    price: number
    is_paid: boolean
    paymentMethod: string
    is_scheduled: boolean
    createdAt: Date
    cancellable: boolean
    finished_date?: Date
    schedule_time?: Date
}

export const handleDriverLogin = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('driver-login', (data: Driver) => {
        const user_id = data.user_id
        socket.join(`/driver/${user_id}`)
        DriverMap.getMap().set(socket.id, {
            user_id: user_id,
            lat: data.lat,
            lng: data.lng,
            status: data.status,
            vehicle_type: data.vehicle_type,
        })
        console.log(data)
    })
}

export const handleDriverResponseBooking = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('driver-response-booking', async (data: { trip_id: number, status: 'Agree' | 'Deny' }) => {
        let driver = DriverMap.getMap().get(socket.id)
        if (driver == undefined) return
        let driver_id = driver?.user_id
        let trip_id = data.trip_id
        setDriverResponseStatus(driver_id, data.status)
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
            driver_value.hasResponded = true
            driver_value.response = status

            setTimeout(() => {
                driver_value.hasResponded = false,
                    driver_value.response = undefined
            }, 30000)
            return
        }
    })
}

export const getCurrentDriverInfoById = (id: number): { lat: number, lng: number } => {
    DriverMap.getMap().forEach((socket_value, socket_id) => {
        if (socket_value.user_id == id) {
            return {
                lat: socket_value.lat,
                lng: socket_value.lng
            }
        }
    })
    return { lat: 0, lng: 0 }
}

export const handleLocationUpdate = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('driver-location-update', (data: { lat: number, lng: number }) => {
        let driver = DriverMap.getMap().get(socket.id)
        if (driver == undefined) return
        let driver_id = driver?.user_id
        let socket_ids = GetSocketByDriverId(driver_id)

        for (let i = 0; i < socket_ids.length; i++) {
            let driver = DriverMap.getMap().get(socket_ids[i])
            if (driver == undefined) return
            driver!.lat = data.lat
            driver!.lng = data.lng
            DriverMap.getMap().set(socket_ids[i], driver)
        }
    })
}

const GetSocketByDriverId = (driver_id: number) => {
    let socketArr: string[] = []
    DriverMap.getMap().forEach((socket_value, socket_id) => {
        if (socket_value.user_id == driver_id) {
            socketArr.push(socket_id)
        }
    })
    return socketArr
}