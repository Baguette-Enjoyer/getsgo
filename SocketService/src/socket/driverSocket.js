import { io } from "../service/initServer"
import { DriverInBroadcast, DriverMap, TripMap, UserMap } from './storage'
import UserInfoClient from '../rabbitmq/user/userInfo/client'
import DriverInfoClient from '../rabbitmq/driverInfo/client'
import DriverCurrentTripClient from '../rabbitmq/driver/driverCurrentTrip/client'
import TripClient from '../rabbitmq/trip/client'
import { FirebaseMessageClient } from "../rabbitmq/firebaseMessage/client"

export const handleDriverLogin = (socket) => {
    socket.on('driver-login', async (data) => {
        const user_id = data.user_id

        const d = DriverMap.getMap().get(user_id.toString())

        let driver_data
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
            console.log(driver_data)
        }
        else {
            console.log('thèn này k có trip nhen')
            const driver_info = await DriverInfoClient.produce(user_id)

            // const driver_info = await driverServices.GetDriverInfoById(user_id)
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
            console.log(driver_data)
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

export const getDriverCurrentTrip = async (driver_id) => {
    // console.log(TripMap.getMap())
    const trip = await DriverCurrentTripClient.produce(driver_id)
    const userInfo = await UserInfoClient.produce(trip.user_id)
    if (trip != null && userInfo != null) {
        return {
            "trip_info": trip,
            "user_info": userInfo
        }
    }
    // for (const [trip_id, trip_value] of TripMap.getMap()) {
    //     console.log(trip_value)
    //     console.log('xin chào')
    //     if (trip_value?.driver_id != undefined && trip_value?.driver_id == driver_id) {
    //         const userInfo = await userService.getBasicUserInfo(trip_value.user_id)
    //         const returnDat = trip_value
    //         returnDat["user"] = userInfo
    //         return {
    //             'trip_info': trip_value,
    //             'user_info': userInfo
    //         }
    //     }
    // }
    else return null
}

const senDriver = async (trip, driver, socket_id) => {
    await TripClient.produceUpdateTrip({ trip_id: trip.trip_id, status: "Confirmed", driver_id: driver.user_id })
    // await tripService.UpdateTrip({ trip_id: trip.trip_id, status: "Confirmed", driver_id: driver.user_id })
    const driverData = await DriverInfoClient.produce(driver.user_id)
    // let driverData2 = await driverServices.GetDriverInfoById(driver.user_id);
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
    io.in(`/user/${trip.user_id}`).emit('found-driver', responseData)
    if (trip.is_callcenter) {
        io.in("callcenter").emit('found-driver', responseData)
    }
    // khi driver chấp nhận thì set lại client_id cho tài xế đó
    driver.client_id = trip.user_id
    DriverMap.getMap().set(socket_id, driver)
    // await initConvo(trip.trip_id, trip.user_id, driver.user_id)
}
export const handleDriverResponseBooking = (socket) => {
    socket.on('driver-response-booking', async (data) => {
        // console.log(data)
        console.log('nè mâfafasf')
        const driver = DriverMap.getMap().get(socket.id)
        if (driver == undefined) return
        if (data.status == "Accept") {
            const trip = await TripClient.produceTripInfo(data.trip.trip_id)
            // const trip = TripMap.getMap().get(data.trip.trip_id)
            if (trip !== undefined && trip.driver_id === undefined) {
                trip.driver_id = driver.user_id
                trip.status = 'Confirmed'
                driver.response = "Accept"
                driver.status = "Driving"

                DriverMap.getMap().set(socket.id, driver)

                senDriver(trip, driver, socket.id);

                //thông báo cho driver nhận chuyến ok
                io.in(`/driver/${driver.user_id}`).emit("receive-trip-success", "successfully received trip")
                console.log("cập nhật chuyến đi thành confirmed do có driver nhận")

            }
            else {
                //thông báo driver user đã có chuyến
                io.in(`/driver/${driver.user_id}`).emit("received-trip-fail", "user in another trip")
            }
        }
        else {
            driver.response = "Deny"
            DriverMap.getMap().set(socket.id, driver)
            console.log("thằng này mới deny: ", DriverMap.getMap().get(socket.id))
        }
    })
}

export const setDriverStatus = (driver_id, status) => {
    DriverMap.getMap().forEach((driver_value, socketid) => {
        if (driver_value.user_id === driver_id) {
            driver_value.status = status
            return
        }
    })
}

export const setDriverResponseStatus = (driver_id, status) => {
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

export const getCurrentDriverInfoById = (id) => {
    for (const [socket_id, socket_value] of DriverMap.getMap()) {
        if (socket_value.user_id == id) {
            return socket_value
        }
    }
    return { user_id: 0, status: "", lat: 0, lng: 0, heading: 0, rating: 0, token_fcm: "000", vehicle_type: "1" }
}

export const handleLocationUpdate = (socket) => {
    socket.on('driver-location-update', (data) => {
        let driver = DriverMap.getMap().get(socket.id)
        if (driver == undefined) return
        driver.lat = data.lat
        driver.lng = data.lng
        console.log('update location driver')
        driver.heading = data.heading
        if (driver.client_id !== undefined) {
            io.in(`/user/${driver.client_id}`).emit('get-location-driver', data)
        }
    })
}

export const handleMessageFromUser = (socket) => {
    socket.on("user-message", async (data) => {
        const driverData = await DriverInfoClient.produce(data.user_id)
        // const driverData = await driverServices.GetDriverInfoById(data.user_id)
        console.log('driver data nef');
        console.log(driverData);
        await FirebaseMessageClient.produce(driverData.driver_info.token_fcm, 'khách hàng', data.message)
        // sendMessageFirebase(driverData.driver_info.token_fcm, 'khách hàng', data.message)
        io.in(`/driver/${data.user_id}`).emit("message-to-driver", data.message)
    })
}

export const GetSocketByDriverId = (driver_id) => {
    for (const [socket_id, socket_value] of DriverMap.getMap()) {
        if (socket_value.user_id == driver_id) {
            return socket_value
        }
    }
    return null
}

export const BroadcastIdleDrivers = (event, data) => {
    DriverMap.getMap().forEach((socket_value, socket_id) => {
        if (socket_value.status == "Idle") {
            console.log("thằng này rãnh t broadcast nè", socket_value.user_id)
            io.in(`/driver/${socket_value.user_id}`).emit(event, data)
        }
    })
}