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
}
const io2: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = io
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
// const users = new Map<string, User>()


export const handleUserLogin = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('user-login', async (data: User) => {
        const user_id = data.user_id
        socket.join(`/user/${user_id}`)

        UserMap.getMap().set(socket.id, {
            user_id: user_id,
        })
    })
}

export const handleUserFindTrip = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('user-find-trip', async (data: TripValue) => {
        // const dat: TripValue = JSON.parse(data)
        const trip_id = data.trip_id
        const place1 = data.start
        // let user = getUserBySocket(socket)
        // let user_id = user?.user_id

        let userData = await userService.GetUserById(data.user_id)

        let DataResponse = {
            user_info: userData,
            trip_info: data
        }
        let DataResponseStringified = JSON.stringify(DataResponse)

        let possibleDrivers = locationServices.getFiveNearestDriver(DriverMap.getMap(), place1, DriverInBroadcast.getDriverInBroadcast())
        console.log(possibleDrivers);

        let isResponded = false
        // điều kiện thứ 1 thằng đó  k bosh
        // điều kiện rảnh
        // điều kiện phạm vị 3 km
        // điều kiện thứ 4 là đó nãy k hủy

        // 5 đứa đang trong vòng ưu điểm được gửi
        // 5 đứa k chấp nhận
        //tìm lại tròng phạm vi đó có bao nhiêu người => 5 đứa+ 1 đứa mới chạy xe vô
        // đứa lên đầu và 4 đứa còn lại // 5 đứa
        for (let i = 0; i < possibleDrivers.length; i++) {
            console.log('driver');
            console.log(DataResponseStringified);
            const driver = possibleDrivers[i];
            AddDriverToBroadCast(driver.user_id);
            //
            broadCastToDriver(driver.socketId, "user-trip", DataResponseStringified);


            await new Promise((resolve) => setTimeout(resolve, 15000));
            // await delay(15000)

            let d = DriverMap.getMap().get(driver.socketId);
            if (TripMap.getMap().get(trip_id)?.status == 'Cancelled') {
                if (d?.hasResponded && d?.status == 'Accept') {
                    broadCastToDriver(driver.socketId, 'trip-cancelled', "User has canceled")
                }
                await tripService.CancelTrip(trip_id)
                TripMap.getMap().delete(trip_id)

                break;
            }

            if (d?.hasResponded) {
                if (d.response == 'Accept') {
                    isResponded = true

                    await tripService.UpdateTrip({ trip_id: trip_id, status: "Confirmed", driver_id: driver.user_id })
                    let driverData = await driverServices.GetDriverInfoById(driver.user_id);
                    let responseData = {
                        trip_id: trip_id,
                        driver_info: driverData,
                        message: "found driver"
                    }
                    const stringifiedResponse = JSON.stringify(responseData);
                   
                    io.in(`/user/${data.user_id}`).emit('found-driver', stringifiedResponse)
                    let newTrip = data
                    newTrip.status = 'Confirmed'
                    newTrip.driver_id = driver.user_id
                    TripMap.getMap().set(trip_id, newTrip)
                    
                    // khi driver chấp nhận thì set lại client_id cho tài xế đó
                    d.client_id=data.user_id
                    DriverMap.getMap().set(driver.socketId,d)
                    isResponded = true
                    break

                    //handle

                } else if (d.response == 'Deny') {
                    continue;
                }
            } else {
                console.log('ko vô');
            }

        }
        // if (isResponded == false) {
        //     let dat = {
        //         trip_id,
        //         status: "Waiting"
        //     }
        //     //
        //     await tripService.UpdateTrip(dat)
        // }

        let rdTripKey = `trip_id:${trip_id}`
        TripMap.getMap().set(trip_id, data)
        let TripDataStringified = JSON.stringify(data)
        await rd.set(rdTripKey, TripDataStringified)

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
    socket.on('user-cancel-trip', (data: { trip_id: number }) => {
        UserCancelTrip(data.trip_id)
    })
}

// export const UserGetLocationDriver = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
//     socket.on('user-cancel-trip', (data: { trip_id: number }) => {
//         UserCancelTrip(data.trip_id)
//     })
// }
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

const broadCastToDriver = (socketid: string, event: string, data: string) => {
    let socket_value = DriverMap.getMap().get(socketid) || undefined
    if (socket_value === undefined) { return }
    if (socket_value === null) {
        throw new Error("driver socket error")
    }
    let driver_id = socket_value.user_id
    io.in(`/driver/${driver_id}`).emit(event, data)
}

const AddDriverToBroadCast = (driver_id: number) => {
    DriverInBroadcast.getDriverInBroadcast().push(driver_id)
    setTimeout(() => {
        const index = DriverInBroadcast.getDriverInBroadcast().indexOf(driver_id);
        if (index !== -1) {
            DriverInBroadcast.getDriverInBroadcast().splice(index, 1);
        }
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

const GetSocketInRoom = (id: number) => {
    const room = io.sockets.adapter.rooms.get("/users")

}