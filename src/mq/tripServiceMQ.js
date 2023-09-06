import { conn, channel } from './createChannel.js'
import { DriverMap, TripMap, DriverInBroadcast } from '../socket/JS/storage.js'
import locationServices from '../services/locationService.js'
import userService from '../services/userService.js'
import { AddDriverToBroadCast, broadCastToDriver, broadCastToDriverById, broadCastToClientById } from '../socket/JS/userSocket.js'
import { io } from '../services/initServer.js'
import tripService, { DeleteTrip } from '../services/tripService.js'
import { BroadcastIdleDrivers, getCurrentDriverInfoById, getDriverCurrentTrip } from '../socket/JS/driverSocket.js'
import { sendMessageFirebase } from '../firebase/firebaseApp.js'
export const ConsumerCallcenterTrip = async (message) => {
    // console.log(message)
    const data = JSON.parse(message.content.toString())
    console.log("This is data")
    console.log(data);
    const trip_id = data.trip_id
    const place1 = data.start

    TripMap.getMap().set(data.trip_id, data);
    let DataResponse = {
        user_info: data.phone,
        trip_info: data
    }
    // let DataResponseStringified = JSON.stringify(DataResponse)
    let timesUp = false
    let loopsBroken = false
    setTimeout(async () => {
        if (!loopsBroken) {
            timesUp = true
            await DeleteTrip(trip_id)
            TripMap.getMap().delete(trip_id)
            // io.in(`/user/${data.user_id}`).emit("no-driver-found", "no drivers have been found")
        }
    }, 70000)
    while (timesUp == false) {
        console.log(DriverMap.getMap());
        console.log('hehehhehe');
        const possibleDrivers = locationServices.requestRide(DriverMap.getMap(), place1, DriverInBroadcast.getDriverInBroadcast())
        console.log(possibleDrivers);
        for (let i = 0; i < possibleDrivers.length; i++) {
            console.log('driver');
            console.log(DataResponse);
            const driver = possibleDrivers[i];
            console.log(driver.socketId)
            if (timesUp != true && loopsBroken == false) {
                AddDriverToBroadCast(driver.user_id);
                //
                broadCastToDriver(driver.socketId, "user-trip", DataResponse);
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 11000));
        const trip = TripMap.getMap().get(trip_id);
        console.log('11111111111')
        console.log(trip)
        if (trip !== undefined && trip.driver_id !== undefined) {
            loopsBroken = true
            break;
        }
    }
}
const handleFind = async (data, userData) => {
    const place1 = data.start
    const trip_id = data.trip_id
    // TripMap.getMap().set(data.trip_id, data);
    // TripMap.getMap().set(data.trip_id, data);
    let DataResponse = {
        user_info: userData,
        trip_info: data
    }
    // let DataResponseStringified = JSON.stringify(DataResponse)
    let timesUp = false
    let loopsBroken = false
    setTimeout(async () => {
        if (!loopsBroken) {
            timesUp = true
            TripMap.getMap().delete(trip_id)
            await DeleteTrip(trip_id)
            io.in(`/user/${data.user_id}`).emit("no-driver-found", "no drivers have been found")
        }
    }, 70000)
    while (timesUp == false && loopsBroken == false) {
        console.log(DriverMap.getMap());
        console.log('hehehhehe');
        const possibleDrivers = locationServices.requestRide(DriverMap.getMap(), place1, DriverInBroadcast.getDriverInBroadcast())
        console.log(possibleDrivers);
        for (let i = 0; i < possibleDrivers.length; i++) {
            console.log('driver');
            console.log(DataResponse);
            const driver = possibleDrivers[i];
            console.log(driver.socketId)
            if (timesUp != true && loopsBroken == false) {
                AddDriverToBroadCast(driver.user_id);
                //


                broadCastToDriver(driver.socketId, "user-trip", DataResponse);
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 18000));
        const trip = TripMap.getMap().get(trip_id);
        console.log('11111111111')
        console.log(trip)
        if (trip !== undefined && trip.driver_id !== undefined) {
            loopsBroken = true
            console.log("break break break")
            break;
        }
    }
}
export const ConsumerNormalTrip = async (message) => {
    // console.log(message)
    const data = JSON.parse(message.content.toString())
    console.log(data);
    const trip_id = data.trip_id
    // const place1 = data.start


    const userData = await userService.GetUserById(data.user_id)
    let DataResponse = {
        user_info: userData,
        trip_info: data
    }
    if (data.is_scheduled) {
        BroadcastIdleDrivers("new-scheduled-trip", DataResponse)
        const now = new Date()
        const scheduledTime = new Date(data.schedule_time)
        const notificationTime = new Date(scheduledTime - 15 * 60000)
        const delay = notificationTime - now
        setTimeout(async () => {
            // kiểm tra lại chuyến đi
            const t = await tripService.GetTripById(trip_id)
            //nếu chưa có driver
            if (t.driver_id == null || t.driver_id == undefined) {
                await handleFind(data, userData)
            }
            else {
                //kiểm tra driver đang có trong chuyến khác
                const curDat = getCurrentDriverInfoById(t.driver_id)
                if (curDat.status != "Idle" || curDat.driver_id == 0) {
                    await tripService.UpdateTrip({ trip_id: trip_id, driver_id: null, status: "Pending" })
                    await handleFind(data, userData)
                }
                //không thì thông báo cho biết nó chuẩn bị
                else {
                    // driver
                    sendMessageFirebase('', 'Chuyến đi hẹn giờ', "Tài xế đang đến chỗ bạn")
                    broadCastToDriverById(t.driver_id, "schedule-notice", DataResponse)
                    const driverData = await userService.GetUserById(t.driver_id)
                    const dataDriver = {
                        driver_info: driverData,
                        trip_id: trip_id
                    }
                    // client
                    sendMessageFirebase('', 'Chuyến đi hẹn giờ', "Tài xế đang đến chỗ bạn")
                    broadCastToClientById(t.user_id, "schedule-start", dataDriver)
                }
                // broadCastToDriver()
            }
        }, delay)
        return
    }
    else await handleFind(data, userData)
}