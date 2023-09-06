import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { io } from "../../services/initServer"
import userService from "../../services/userService"
import locationServices from "../../services/locationService"
import { DriverInBroadcast, DriverMap, TripMap, UserMap } from './storage'
import tripService from "../../services/tripService"
import driverServices from "../../services/driverServices"
import initRedis from "../../config/connectRedis"
let rd = initRedis()
interface User {
    user_id: number
    token_fcm: string
}

interface TripValue {
    trip_id: number
    user_id: number
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
    status?: "Pending" | "Waiting" | "Confirmed" | "Arrived" | "Driving" | "Done" | "Cancelled" | string
    price: number
    is_paid: boolean
    paymentMethod: string
    is_scheduled: boolean
    createdAt: Date
    cancellable: boolean
    finished_date?: Date
    schedule_time?: Date
    is_callcenter: boolean
    duration: string
    distance: number
}
// const users = new Map<string, User>()


export const handleUserLogin = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('user-login', async (data: User) => {
        const { user_id, token_fcm } = data
        socket.join(`/user/${user_id}`)

        UserMap.getMap().set(socket.id, {
            user_id: user_id,
            token_fcm: token_fcm
        })
        console.log('user đã đăng nhập')

        const curTrips = await tripService.GetRunningTripOfUser(user_id)
        curTrips.forEach((item: any) => {
            const driverInfo = GetDriverInfoById(item.driver_id)
            const driverDat = DriverMap.getMap().get(driverInfo!)
            curTrips.driver = driverDat
        })

        io.in(`/user/${user_id}`).emit("user-reconnect", curTrips)
    })
}

export const sendMessageToS2 = (data) => {
    io.in("callcenter").emit("s2-update-trip", data)
}

export const sendMessageToS3 = (data) => {
    io.in("callcenter").emit("s3-update-trip", data)
}

export const handleCallCenterLogin = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('callcenter-login', async () => {
        socket.join(`callcenter`)

        const data = await tripService.GetTripS2()
        io.in("callcenter").emit("s2-trip", data)

        const data2 = await tripService.GetTripS3()
        io.in("callcenter").emit("s3-trip", data2)
    })
}

export const handleUserFindTrip = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('user-find-trip', async (data: TripValue) => {
        console.log("t chuyển này qua cái mq luôn r nha, có gì lỗi kiu t sửa")
        // const dat: TripValue = JSON.parse(data)
        // console.log(data);
        // const trip_id = data.trip_id
        // const place1 = data.start
        // // let user = getUserBySocket(socket)
        // // let user_id = user?.user_id

        // let userData = await userService.GetUserById(data.user_id)
        // TripMap.getMap().set(data.trip_id, data);
        // let DataResponse = {
        //     user_info: userData,
        //     trip_info: data
        // }
        // // let DataResponseStringified = JSON.stringify(DataResponse)
        // let timesUp = false
        // let loopsBroken = false
        // setTimeout(async () => {
        //     if (!loopsBroken) {
        //         timesUp = true
        //         io.in(`/user/${data.user_id}`).emit("no-driver-found", "no drivers have been found")
        //         await tripService.DeleteTrip(trip_id)
        //     }
        // }, 60000)
        // while (timesUp == false) {
        //     console.log(DriverMap.getMap());
        //     console.log('hehehhehe');
        //     const possibleDrivers = locationServices.requestRide(DriverMap.getMap(), place1, DriverInBroadcast.getDriverInBroadcast())
        //     console.log(possibleDrivers);
        //     for (let i = 0; i < possibleDrivers.length; i++) {
        //         console.log('driver');
        //         console.log(DataResponse);
        //         const driver = possibleDrivers[i];
        //         console.log(driver.socketId)
        //         AddDriverToBroadCast(driver.user_id);
        //         //
        //         broadCastToDriver(driver.socketId, "user-trip", DataResponse);
        //     }
        //     await new Promise((resolve) => setTimeout(resolve, 11000));
        //     const trip = TripMap.getMap().get(trip_id);
        //     console.log('11111111111')
        //     console.log(trip)
        //     if (trip !== undefined && trip.driver_id !== undefined) {
        //         loopsBroken = true
        //         break;
        //     }
        // }
        // 1 phút không có emit (no-driver-found)


        // let possibleDrivers = locationServices.getFiveNearestDriver(DriverMap.getMap(), place1, DriverInBroadcast.getDriverInBroadcast())
        // console.log(possibleDrivers);

        // let isResponded = false
        // điều kiện thứ 1 thằng đó  k bosh
        // điều kiện rảnh
        // điều kiện phạm vị 3 km
        // điều kiện thứ 4 là đó nãy k hủy

        // 5 đứa đang trong vòng ưu điểm được gửi
        // 5 đứa k chấp nhận
        //tìm lại tròng phạm vi đó có bao nhiêu người => 5 đứa+ 1 đứa mới chạy xe vô
        // đứa lên đầu và 4 đứa còn lại // 5 đứa

        //long ======
        // for (let i = 0; i < possibleDrivers.length; i++) {
        //     console.log('driver');
        //     console.log(DataResponseStringified);
        //     const driver = possibleDrivers[i];
        //     AddDriverToBroadCast(driver.user_id);
        //     //
        //     broadCastToDriver(driver.socketId, "user-trip", DataResponseStringified);


        //     await new Promise((resolve) => setTimeout(resolve, 15000));
        //     // await delay(15000)

        //     let d = DriverMap.getMap().get(driver.socketId);
        //     if (TripMap.getMap().get(trip_id)?.status == 'Cancelled') {
        //         if (d?.hasResponded && d?.status == 'Accept') {
        //             broadCastToDriver(driver.socketId, 'trip-cancelled', "User has canceled")
        //         }
        //         await tripService.CancelTrip(trip_id)
        //         TripMap.getMap().delete(trip_id)

        //         break;
        //     }

        //     if (d?.hasResponded) {
        //         if (d.response == 'Accept') {
        //             isResponded = true

        //             await tripService.UpdateTrip({ trip_id: trip_id, status: "Confirmed", driver_id: driver.user_id })
        //             let driverData = await driverServices.GetDriverInfoById(driver.user_id);
        //             let responseData = {
        //                 trip_id: trip_id,
        //                 driver_info: driverData,
        //                 message: "found driver"
        //             }
        //             const stringifiedResponse = JSON.stringify(responseData);

        //             io.in(`/user/${data.user_id}`).emit('found-driver', stringifiedResponse)
        //             let newTrip = data
        //             newTrip.status = 'Confirmed'
        //             newTrip.driver_id = driver.user_id
        //             TripMap.getMap().set(trip_id, newTrip)

        //             // khi driver chấp nhận thì set lại client_id cho tài xế đó
        //             d.client_id = data.user_id
        //             DriverMap.getMap().set(driver.socketId, d)
        //             isResponded = true
        //             break

        //             //handle

        //         } else if (d.response == 'Deny') {
        //             continue;
        //         }
        //     } else {
        //         console.log('ko vô');
        //     }

        // }
        // if (isResponded == false) {
        //     let dat = {
        //         trip_id,
        //         status: "Waiting"
        //     }
        //     //
        //     await tripService.UpdateTrip(dat)
        // }

        // let rdTripKey = `trip_id:${trip_id}`
        // TripMap.getMap().set(trip_id, data)
        // let TripDataStringified = JSON.stringify(data)
        // await rd.set(rdTripKey, TripDataStringified)

        // AddDriverToBroadCast(possibleDrivers[0].user_id)
        // broadCastToDriver(io,possibleDrivers[0].socketId, "user-trip", DataResponseStringified)

        // console.log(`broadcasting to driver ${possibleDrivers[0].user_id}`)

        // let i = 1;
        // let new_interval = setInterval(() => {
        //     if (i >= possibleDrivers.length) {
        //         setTimeout(async () => {
        //             let dat = {
        //                 trip_id,
        //                 status: "Waiting"
        //             }
        //             await tripService.UpdateTrip(dat)
        //             clearInterval(new_interval)

        //         }, 15000)
        //     }
        //     else {
        //         AddDriverToBroadCast(possibleDrivers[i].user_id)
        //         broadCastToDriver(io,possibleDrivers[i][0], "user-trip", DataResponseStringified)
        //         i++
        //     }
        // }, 15000)


        // current_intervals.set(trip_id, new_interval)
    })
}

export const handleUserCancelTrip = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('user-cancel-trip', async (data: { trip_id: number }) => {
        UserCancelTrip(data.trip_id)
        const tripDat = TripMap.getMap().get(data.trip_id)
        const driver_id = tripDat?.driver_id!
        io.in(`/driver/${driver_id}`).emit("user-cancel-trip", "user has cancelled the trip")
        await tripService.UpdateTrip({ trip_id: data.trip_id, status: "Cancelled" })
        const socketid = GetDriverInfoById(driver_id)
        if (socketid === null) { return }
        const driverData = DriverMap.getMap().get(socketid)
        if (driverData === undefined) { return }
        driverData.status = "Idle"
        driverData.client_id = undefined
        DriverMap.getMap().set(socketid, driverData)
        await tripService.UpdateTrip({ trip_id: data.trip_id, status: "Cancelled" })
    })
}

export const handleMessageFromDriver = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on("driver-message", (data: { conversation_id: number, user_id: number, message: string }) => {
        socket.to(`/user/${data.user_id}`).emit("message-to-user", data.message)
    })
}
// export const UserGetLocationDriver = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
//     socket.on('user-cancel-trip', (data: { trip_id: number }) => {
//         UserCancelTrip(data.trip_id)
//     })
// }

export const handleTripUpdate = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('trip-update', async (data: { trip_id: number, status: string, directions: string }) => {
        const trip = TripMap.getMap().get(data.trip_id)
        if (data.status === "Done") {
            console.log("hehehehhehe")
            // const tripDat = TripMap.getMap().get(data.trip_id)
            // const driver_id = tripDat?.driver_id!
            // const socketid = GetDriverInfoById(driver_id) 
            // if (socketid === null) { return}
            const driverData = DriverMap.getMap().get(socket.id)
            if (driverData === undefined) { return }
            const updatedDriverData = { ...driverData, status: 'Idle', client_id: undefined };
            // driverData.status = "Idle"
            // driverData.client_id = undefined
            DriverMap.getMap().set(socket.id, updatedDriverData)

            if (data.status != null && trip != null) {
                const updatedTripData = { ...trip, status: data.status }
                // trip.status = data.status
                TripMap.getMap().set(trip.trip_id, updatedTripData)
                io.in(`/user/${trip.user_id}`).emit('trip-update', { status: data.status })
                io.in("callcenter").emit('trip-update', { status: data.status, trip_id: data.trip_id })
            }
            await tripService.UpdateTrip({ trip_id: data.trip_id, status: "Done" })
        } else if (data.status != null && trip != null) {
            console.log("1231231231")
            // trip.status = data.status
            const updatedTripData = { ...trip, status: data.status }
            TripMap.getMap().set(trip.trip_id, updatedTripData)
            await tripService.UpdateTrip({ trip_id: data.trip_id, status: data.status })
            io.in(`/user/${trip.user_id}`).emit('trip-update', { status: data.status, directions: data.directions })
            io.in("callcenter").emit('trip-update', { status: data.status, trip_id: data.trip_id })
        }
    })

}

const getTripIfDisconnected = (id: number) => {
    TripMap.getMap().forEach((trip_value, trip_id) => {
        if (trip_value.user_id == id || trip_value.driver_id == id) {
            return trip_id;
        }
    })
    return null;
}

const GetSocketByUserId = (user_id: number) => {
    let socketArr: string[] = []
    UserMap.getMap().forEach((socket_value, socket_id) => {
        if (socket_value.user_id == user_id) {
            socketArr.push(socket_id)
        }
    })
    return socketArr
}

const GetDriverInfoById = (driver_id: number): string | null => {
    DriverMap.getMap().forEach((driverData, socketId) => {
        if (driverData.user_id === driver_id) {
            return socketId
        }
    })
    return null
}

export const broadCastToDriver = (socketid: string, event: string, data: Object) => {
    let socket_value = DriverMap.getMap().get(socketid) || undefined
    if (socket_value === undefined) { return }
    if (socket_value === null) {
        throw new Error("driver socket error")
    }
    let driver_id = socket_value.user_id
    console.log(`/driver/${driver_id}`);
    io.in(`/driver/${driver_id}`).emit(event, data)
}
export const broadCastToDriverById = (driver_id: string, event: string, data: Object) => {
    io.in(`/driver/${driver_id}`).emit(event, data)
}
export const broadCastToClientById = (user_id: string, event: string, data: Object) => {
    io.in(`/user/${user_id}`).emit(event, data)
}
export const AddDriverToBroadCast = (driver_id: number) => {
    // const socketid = GetDriverInfoById(driver_id) 
    // if (socketid === null) { return}
    // const driverData = DriverMap.getMap().get(socketid)
    // if (driverData === undefined) { return}
    // driverData.status = "Broadcasting"
    // DriverMap.getMap().set(socketid, driverData)
    DriverInBroadcast.getDriverInBroadcast().push(driver_id)
    setTimeout(() => {
        const index = DriverInBroadcast.getDriverInBroadcast().indexOf(driver_id);
        if (index !== -1) {
            DriverInBroadcast.getDriverInBroadcast().splice(index, 1);
        }
        // const socketid = GetDriverInfoById(driver_id)
        // if (socketid === null) { return}
        // const driverData = DriverMap.getMap().get(socketid)
        // if (driverData === undefined) { return}

        // if (driverData.client_id == null) {
        //     driverData.status = "Idle"
        //     DriverMap.getMap().set(socketid, driverData)
        // }
    }, 15000)
}


const UserCancelTrip = (id: number) => {
    // if (status == undefined) return
    TripMap.getMap().forEach((trip_value, trip_id) => {
        if (trip_id == id) {
            trip_value.status = "Cancelled"
            return
        }
    })
}

