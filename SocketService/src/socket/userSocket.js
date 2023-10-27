import { io } from "../service/initServer"

import { DriverInBroadcast, DriverMap, TripMap, UserMap } from './storage'
import { GetSocketByDriverId } from "./driverSocket"

import TripInfoClient from '../rabbitmq/trip/client'
import UserInfoClient from '../rabbitmq/user/userInfo/client'
import DriverInfoClient from '../rabbitmq/driverInfo/client'
import TripClient from '../rabbitmq/trip/client'
import UserCurrentTripClient from '../rabbitmq/user/userCurrentTrip/client'
import UserCurrentScheduleTripClient from '../rabbitmq/user/userCurrentSchedule/client'
import TripS2Client from '../rabbitmq/trip/tripS2/client'
import TripS3Client from '../rabbitmq/trip/tripS2/client'


export const handleUserLogin = (socket) => {
    socket.on('user-login', async (data) => {
        const { user_id } = data
        console.log("hú", user_id)
        socket.join(`/user/${user_id}`)
        const userData = await UserInfoClient.produce(user_id)
        // const userData = await userService.GetUserById(user_id)
        UserMap.getMap().set(socket.id, {
            user_id: user_id,
            token_fcm: userData.token_fcm
        })

        // const curTrips = await tripService.GetRunningTripOfUser(user_id)//hẹn giờ
        const curTrips = await UserCurrentScheduleTripClient.produce(user_id)
        const curTrip2 = await UserCurrentTripClient.produce(user_id)
        // const curTrip2 = await findCurrentTripOfUser(user_id)
        // curTrips.push(curTrip2);
        const ts = {
            active: curTrip2,
            schedule: curTrips
        }
        // curTrips.forEach((item: any) => {
        //     const driverInfo = GetDriverInfoById(item.driver_id)
        //     const driverDat = DriverMap.getMap().get(driverInfo!)
        //     curTrips.driver = driverDat
        // })

        io.in(`/user/${user_id}`).emit("user-reconnect", ts)
    })
}

export const findCurrentTripOfUser = async (user_id) => {
    for (const [trip_id, trip_value] of TripMap.getMap()) {
        if (trip_value.user_id == user_id && trip_value.driver_id != undefined) {
            const driverDat = await DriverInfoClient.produce(trip_value.driver_id)
            // const driverDat = await driverServices.GetDriverInfoById(trip_value.driver_id)
            const location = GetSocketByDriverId(trip_value.driver_id)
            const returnDat = trip_value
            driverDat['location'] = location
            returnDat["driver"] = driverDat
            return returnDat
        }
    }
    return null
}

export const broadcastCallcenter = (event, data) => {
    io.in("callcenter").emit(event, data)
}

export const sendMessageToS2 = (data) => {
    io.in("callcenter").emit("s2-update-trip", data)
}

export const sendMessageToS3 = (data) => {
    io.in("callcenter").emit("s3-update-trip", data)
}

export const handleCallCenterLogin = (socket) => {
    socket.on('callcenter-login', async () => {
        socket.join(`callcenter`)

        // const data = await tripService.GetTripS2()
        const data = await TripS2Client.produce("long")
        console.log("ok 1", data)
        io.in("callcenter").emit("s2-trip", data)

        const data2 = await TripS3Client.produce("long")
        console.log("ok 2", data2)
        io.in("callcenter").emit("s3-trip", data2)
    })
}

export const handleUserFindTrip = (socket) => {
    socket.on('user-find-trip', async (data) => {
        console.log("t chuyển này qua cái mq luôn r nha, có gì lỗi kiu t sửa")
    })
}

export const handleUserCancelTrip = (socket) => {
    socket.on('user-cancel-trip', async (data) => {
        // UserCancelTrip(data.trip_id)
        // const tripDat = TripMap.getMap().get(data.trip_id)
        const tripDat = await TripClient.produceTripInfo(data.trip_id)
        if (tripDat) {
            const driver_id = tripDat.driver_id
            io.in(`/driver/${driver_id}`).emit("user-cancel-trip", "user has cancelled the trip")
        }
        // await tripService.UpdateTrip({ trip_id: data.trip_id, status: "Cancelled" })
        const socketid = GetDriverInfoById(data.driver_id)
        if (socketid === null) { return }
        const driverData = DriverMap.getMap().get(socketid)
        if (driverData === undefined) { return }
        driverData.status = "Idle"
        driverData.client_id = undefined
        DriverMap.getMap().set(socketid, driverData)

        await TripClient.produceUpdateTrip({ trip_id: data.trip_id, status: "Cancelled" })
        // await tripService.UpdateTrip({ trip_id: data.trip_id, status: "Cancelled" })
    })
}

export const handleMessageFromDriver = (socket) => {
    socket.on("driver-message", async (data) => {
        const userData = await UserInfoClient.produce(data.user_id)
        console.log(userData)
        // const userData = await userService.GetUserById(data.user_id)
        await FirebaseMessageClient.produce(userData.token_fcm, 'Tài xế', data.message)
        // sendMessageFirebase(userData.token_fcm, 'Tài xế', data.message)
        // console.log(' usser id ở driver-message')
        // console.log(TripMap.getMap().get(data.trip_id)?.user_id)
        io.in(`/user/${data.user_id}`).emit("message-to-user", data.message)
    })
}
// export const UserGetLocationDriver = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
//     socket.on('user-cancel-trip', (data: { trip_id: number }) => {
//         UserCancelTrip(data.trip_id)
//     })
// }

export const handleTripUpdate = (socket) => {
    socket.on('trip-update', async (data) => {
        const trip = await TripClient.produce(data.trip_id)
        // const trip = TripMap.getMap().get(data.trip_id)
        if (data.status === "Done") {
            console.log("hehehehhehe")
            const driverData = DriverMap.getMap().get(socket.id)
            if (driverData === undefined) { return }
            const updatedDriverData = { ...driverData, status: 'Idle', client_id: undefined };
            DriverMap.getMap().set(socket.id, updatedDriverData)
            const driverData2 = DriverMap.getMap().get(socket.id)
            console.log("data driver sau update nè", driverData2)

            if (data.status != null && trip != null) {
                const updatedTripData = { ...trip, status: data.status }
                // trip.status = data.status
                // TripMap.getMap().set(trip.trip_id, updatedTripData)
                io.in(`/user/${trip.user_id}`).emit('trip-update', { status: data.status })
                io.in("callcenter").emit('trip-update', { status: data.status, trip_id: data.trip_id })
            }
            await TripClient.produceUpdateTrip({ trip_id: data.trip_id, status: "Done" })
            console.log("cập nhật thành công")
            // await tripService.UpdateTrip({ trip_id: data.trip_id, status: "Done" })
            // TripMap.getMap().delete(data.trip_id)
            // console.log("Đã xóa chuyển khỏi trip")
            // console.log("danh sách chuyến hiện tại")
            // console.log(TripMap.getMap());

        } else if (data.status != null && trip != null) {
            console.log("1231231231")
            // trip.status = data.status
            // const updatedTripData = { ...trip, status: data.status }
            // TripMap.getMap().set(trip.trip_id, updatedTripData)
            await TripClient.produceUpdateTrip({ trip_id: data.trip_id, status: data.status })
            console.log("cập nhật thành công")
            // await tripService.UpdateTrip({ trip_id: data.trip_id, status: data.status })
            io.in(`/user/${trip.user_id}`).emit('trip-update', { status: data.status, directions: data.directions })
            io.in("callcenter").emit('trip-update', { status: data.status, trip_id: data.trip_id })
        }
    })

}

const getTripIfDisconnected = (id) => {
    TripMap.getMap().forEach((trip_value, trip_id) => {
        if (trip_value.user_id == id || trip_value.driver_id == id) {
            return trip_id;
        }
    })
    return null;
}

const GetSocketByUserId = (user_id) => {
    let socketArr = []
    UserMap.getMap().forEach((socket_value, socket_id) => {
        if (socket_value.user_id == user_id) {
            socketArr.push(socket_id)
        }
    })
    return socketArr
}

const GetDriverInfoById = (driver_id) => {
    DriverMap.getMap().forEach((driverData, socketId) => {
        if (driverData.user_id === driver_id) {
            return socketId
        }
    })
    return null
}

export const broadCastToDriver = (socketid, event, data) => {
    let socket_value = DriverMap.getMap().get(socketid) || undefined
    if (socket_value === undefined) { return }
    if (socket_value === null) {
        throw new Error("driver socket error")
    }
    let driver_id = socket_value.user_id
    console.log(`/driver/${driver_id}`);
    io.in(`/driver/${driver_id}`).emit(event, data)
}
export const broadCastToDriverById = (driver_id, event, data) => {
    io.in(`/driver/${driver_id}`).emit(event, data)
}
export const broadCastToClientById = (user_id, event, data) => {
    io.in(`/user/${user_id}`).emit(event, data)
}
export const AddDriverToBroadCast = (driver_id) => {
    DriverInBroadcast.getDriverInBroadcast().push(driver_id)
    setTimeout(() => {
        const index = DriverInBroadcast.getDriverInBroadcast().indexOf(driver_id);
        if (index !== -1) {
            DriverInBroadcast.getDriverInBroadcast().splice(index, 1);
        }
    }, 15000)
}


