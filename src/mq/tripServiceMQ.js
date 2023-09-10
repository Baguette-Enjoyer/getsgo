import { conn, channel } from './createChannel.js'
import { DriverMap, TripMap, DriverInBroadcast } from '../socket/JS/storage.js'
import locationServices from '../services/locationService.js'
import userService from '../services/userService.js'
import { AddDriverToBroadCast, broadCastToDriver, broadCastToDriverById, broadCastToClientById } from '../socket/JS/userSocket.js'
import { io } from '../services/initServer.js'
import tripService, { DeleteTrip } from '../services/tripService.js'
import { BroadcastIdleDrivers, getCurrentDriverInfoById, getDriverCurrentTrip, GetSocketByDriverId } from '../socket/JS/driverSocket.js'
import { sendMessageFirebase } from '../firebase/firebaseApp.js'
import driverServices from '../services/driverServices.js'
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Ho_Chi_Minh');
export const ConsumerCallcenterTrip = async (message) => {
    // console.log(message)
    const data = JSON.parse(message.content.toString())
    console.log("This is data")
    console.log(data);
    const trip_id = data.trip_id
    const place1 = data.start

    //bug k có 
    // TripMap.getMap().set(data.trip_id, data);
    let DataResponse = {
        user_info: data.phone,
        trip_info: data
    }

    console.log(DataResponse);
    console.log("This is data1")
    // let DataResponseStringified = JSON.stringify(DataResponse)
    if (data.is_scheduled) {
        console.log("mày đặt chuyến hẹn giờ")
        BroadcastIdleDrivers("new-scheduled-trip", DataResponse)
        const now = moment()

        const scheduledTime = moment(data.schedule_time);
        // const remainingMinutes = scheduledTime.diff(currentTime, 'minutes');
        const delay = scheduledTime - now;
        // const delay = notificationTime - now;
        console.log("delay ", delay)
        setTimeout(async () => {
            // kiểm tra lại chuyến đi
            console.log("kiểm tra lại")
            const t = await tripService.GetTripById(trip_id)
            //nếu chưa có driver
            console.log('111111111')
            console.log(t.driver_id)
            if (t.driver_id == null || t.driver_id == undefined) {
                console.log("không có driver chuyển qua")
                await handleFind(data, data.phone)
            }
            else {
                //kiểm tra driver đang có trong chuyến khác
                const curDat = getCurrentDriverInfoById(t.driver_id)
                console.log(curDat)
                console.log('sao mày')
                if (curDat.status != "Idle" || curDat.user_id == 0) {
                    console.log('có em đây')
                    console.log(curDat.status)
                    console.log(curDat.user_id)

                    await tripService.UpdateTrip({ trip_id: trip_id, driver_id: null, status: "Pending" })
                    await handleFind(data, data.phone)
                }
                //không thì thông báo cho biết nó chuẩn bị
                else {
                    console.log('em ơi1')
                    TripMap.getMap().set(data.trip_id, data);

                    // driver
                    const driverData = await driverServices.GetDriverInfoById(t.driver_id)
                    sendMessageFirebase(driverData.driver_info.token_fcm, 'Chuyến đi hẹn giờ', "Tài xế đang đến chỗ bạn")
                    broadCastToDriverById(t.driver_id, "schedule-notice", DataResponse)
                    const location = GetSocketByDriverId(t.driver_id)
                    const dataDriver = {
                        driver_info: driverData,
                        trip_id: trip_id,
                        location: location
                    }
                    console.log(dataDriver)
                    console.log('em ơi')
                    // client
                    // sendMessageFirebase(userData.token_fcm, 'Chuyến đi hẹn giờ', "Tài xế đang đến chỗ bạn")
                    broadCastToClientById(t.user_id, "schedule-start", dataDriver)
                }
                // broadCastToDriver()
            }
        }, delay)
        return
    }
    else await handleFind(data, data.phone)
}

const handleFind = async (data, userData) => {
    console.log('tìm chuyến bình thường nha')
    const place1 = data.start
    const trip_id = data.trip_id
    TripMap.getMap().set(data.trip_id, data);
    // TripMap.getMap().set(data.trip_id, data);
    let DataResponse = {
        user_info: userData,
        trip_info: data
    }
    // let DataResponseStringified = JSON.stringify(DataResponse)
    let timesUp = false
    let r = ""
    let loopsBroken = false
    setTimeout(async () => {
        if (loopsBroken == true) {
            // timesUp = true
            const trip = TripMap.getMap().get(data.trip_id)
            if (r == "ok") {
                console.log("trip hiện tại", trip)
                console.log("đã có driver nhận ", trip.driver_id)
                return
            } else if (r == "cancelled") {
                console.log("hủy do user")
                TripMap.getMap().delete(trip_id)
                await DeleteTrip(trip_id)

            } else if (r == "timesup") {
                console.log("hủy do không có thằng nào nhận")
                TripMap.getMap().delete(trip_id)
                await DeleteTrip(trip_id)
                io.in(`/user/${data.user_id}`).emit("no-driver-found", "no drivers have been found")
            }
        }
    }, 70000)
    while (loopsBroken == false) {
        console.log("mảng driver hiện tại")
        console.log(DriverMap.getMap());
        console.log('hehehhehe');
        const possibleDrivers = locationServices.requestRide(DriverMap.getMap(), place1, DriverInBroadcast.getDriverInBroadcast())
        console.log("5 thằng đang ở không nè: ")
        console.log(possibleDrivers);
        for (let i = 0; i < possibleDrivers.length; i++) {
            console.log('driver');
            console.log(DataResponse);
            const driver = possibleDrivers[i];
            console.log(driver.socketId)
            if (loopsBroken == false) {
                AddDriverToBroadCast(driver.user_id);
                //
                broadCastToDriver(driver.socketId, "user-trip", DataResponse);
            }
        }
        // await new Promise((resolve) => setTimeout(resolve, 18000));
        // const trip = TripMap.getMap().get(trip_id);
        // console.log('11111111111')
        // console.log(trip)
        // if (trip !== undefined && trip.driver_id !== undefined && trip.status !== "Cancelled") {
        //     loopsBroken = true
        //     console.log("break break break")
        //     break;
        // }
        let i = 1
        while (i < 18) {
            console.log("kiểm tra each sec")
            const res = await checkTrip(trip_id)
            if (res == "ok") {
                loopsBroken = true
                r = res
                console.log("break break break")
                break
            }
            else if (res == "cancelled") {
                loopsBroken = true
                r = res
                console.log("break break break")
                break
            }
            if (i == 17) {
                loopsBroken = true
                r = "timesup"
                console.log("break break break")
                break;
            }
            i++
        }
    }
}
const checkTrip = async (trip_id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const trip = TripMap.getMap().get(trip_id);
    console.log('11111111111')
    console.log(trip)
    if (trip !== undefined && trip.driver_id !== undefined) {
        return "ok"
    }
    else if (trip.status === "Cancelled") {
        console.log("break cuz cancelled")
        return "cancelled"
    } else return "else"
}
export const ConsumerNormalTrip = async (message) => {
    // console.log(message)
    const data = JSON.parse(message.content.toString())
    console.log("này là data nè")
    console.log(data);
    const trip_id = data.trip_id
    // const place1 = data.start


    const userData = await userService.GetUserById(data.user_id)
    let DataResponse = {
        user_info: userData,
        trip_info: data
    }
    if (data.is_scheduled) {
        console.log("mày đặt chuyến hẹn giờ")
        BroadcastIdleDrivers("new-scheduled-trip", DataResponse)

        const now = moment()

        const scheduledTime = moment(data.schedule_time);
        // const remainingMinutes = scheduledTime.diff(currentTime, 'minutes');
        const delay = scheduledTime - now;
        // const delay = notificationTime - now;
        console.log("delay ", delay)

        setTimeout(async () => {
            // kiểm tra lại chuyến đi
            console.log("kiểm tra lại")
            const t = await tripService.GetTripById(trip_id)
            //nếu chưa có driver
            console.log('kiểm tra có driver hay chưa nè')
            console.log(t.driver_id)
            if (t.driver_id == null || t.driver_id == undefined) {
                console.log("không có driver chuyển qua")
                await handleFind(data, userData)
            }
            else {
                //kiểm tra driver đang có trong chuyến khác
                const curDat = getCurrentDriverInfoById(t.driver_id)
                console.log(curDat)
                console.log('sao mày')
                if (curDat.status != "Idle" || curDat.user_id == 0) {
                    console.log('có em đây')
                    console.log(curDat.status)
                    console.log(curDat.user_id)

                    await tripService.UpdateTrip({ trip_id: trip_id, driver_id: null, status: "Pending" })
                    await handleFind(data, userData)
                }
                //không thì thông báo cho biết nó chuẩn bị
                else {
                    console.log('em ơi1')
                    TripMap.getMap().set(data.trip_id, data);

                    // driver

                    const driverData = await driverServices.GetDriverInfoById(t.driver_id)
                    sendMessageFirebase(driverData.driver_info.token_fcm, 'Chuyến đi hẹn giờ', "Tài xế chuẩn bị đi")
                    broadCastToDriverById(t.driver_id, "schedule-notice", DataResponse)
                    const location = GetSocketByDriverId(t.driver_id)
                    const dataDriver = {
                        driver_info: driverData,
                        trip_id: trip_id,
                        location: location
                    }
                    console.log(dataDriver)
                    console.log('em ơi')
                    // client
                    sendMessageFirebase(userData.token_fcm, 'Chuyến đi hẹn giờ', "Tài xế đang đến chỗ bạn")
                    broadCastToClientById(t.user_id, "schedule-start", dataDriver)
                }
                // broadCastToDriver()
            }
        }, delay)
        console.log("return nha mày")
        return
    }
    else await handleFind(data, userData)
}