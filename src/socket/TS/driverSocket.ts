import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { io } from "../../services/initServer"
import userService from "../../services/userService"
import locationServices from "../../services/locationService"
import { initConvo, addChatMessage, dropConvo } from "../../services/chatService"
import { DriverInBroadcast, DriverMap, TripMap, UserMap } from './storage'
import tripService from "../../services/tripService"
import driverServices from "../../services/driverServices"
import initRedis from "../../config/connectRedis"
import { sendMessageToS3 } from "./userSocket"

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
    is_callcenter: boolean
}

export const handleDriverLogin = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('driver-login', async (data: Driver) => {
        const user_id = data.user_id

        const driver_info = await driverServices.GetDriverInfoById(user_id)

        const driver_data: Driver = {
            user_id: user_id,
            lat: data.lat,
            lng: data.lng,
            status: data.status,
            heading: data.heading,
            vehicle_type: driver_info.driver_info.driver_vehicle.id,
            rating: driver_info.statics.starResult,
            client_id: undefined,
        }

        const currentTrip = getDriverCurrentTrip(user_id)

        if (currentTrip != null) {
            driver_data.client_id = TripMap.getMap().get(currentTrip)?.user_id
        }
        console.log(driver_data);
        socket.join(`/driver/${user_id}`)
        DriverMap.getMap().set(socket.id, driver_data)
        // console.log(data)
    })
}

export const getDriverCurrentTrip = (driver_id: number): number | null => {
    TripMap.getMap().forEach((trip_value, trip_id) => {
        if (trip_value.driver_id == driver_id) {
            return trip_id
        }
    })
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
        status: "Confirmed"
    }
    // const user = userService.getUserBySocket(trip.user_id);
    // const stringifiedResponse = JSON.stringify(responseData);
    console.log('555555555555');
    console.log(responseData.driver_info);
    console.log(responseData.driver_info.User);
    console.log(responseData);
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
        console.log('nè mâfafasf')
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

                console.log(trip)
                TripMap.getMap().set(trip.trip_id, trip)
                DriverMap.getMap().set(socket.id, driver)

                senDriver(trip, driver, socket.id);

                //thông báo cho driver nhận chuyến ok
                io.in(`/driver/${driver.user_id}`).emit("receive-trip-success", "successfully received trip")

                //ádasdasdada
            }
            else {
                //thông báo driver user đã có chuyến
                io.in(`/driver/${driver.user_id}`).emit("received-trip-fail", "user in another trip")
            }
        }
        else {
            driver.response = "Deny"
            DriverMap.getMap().set(socket.id, driver)
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

export const getCurrentDriverInfoById = (id: number): { user_id:number,status:string,lat: number, lng: number } => {
    DriverMap.getMap().forEach((socket_value, socket_id) => {
        if (socket_value.user_id == id) {
            return {
                user_id: socket_value.user_id,
                status: socket_value.status,
                lat: socket_value.lat,
                lng: socket_value.lng
            }
        }
    })
    return { user_id:0,status:"",lat: 0, lng: 0 }
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

export const broadcastScheduleTrip = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    
}

export const handleMessageFromUser = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on("user-message", (data: { conversation_id: number, user_id: number, message: string }) => {
        socket.to(`/driver/${data.user_id}`).emit("message-to-driver", data.message)
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

export const BroadcastIdleDrivers = (data:{trip_info:TripValue,user_info:any}) => {
    DriverMap.getMap().forEach((socket_value,socket_id)=>{
        if(socket_value.status == "Idle"){
            io.in(`/driver/${socket_value.user_id}`).emit("new-scheduled",data)
        }
    })
}