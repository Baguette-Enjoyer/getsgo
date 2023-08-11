import { conn, channel } from './createChannel.js'
import { DriverMap, TripMap, DriverInBroadcast } from '../socket/JS/storage.js'
import locationServices from '../services/locationService.js'
import { AddDriverToBroadCast, broadCastToDriver } from '../socket/JS/userSocket.js'
import { io } from '../services/initServer.js'
import { DeleteTrip } from '../services/tripService.js'
export const ConsumerCallcenterTrip = async (message) => {
    console.log(message)
    const data = JSON.parse(message.content.toString())
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
            // io.in(`/user/${data.user_id}`).emit("no-driver-found", "no drivers have been found")
        }
    }, 60000)
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
            AddDriverToBroadCast(driver.user_id);
            //
            broadCastToDriver(driver.socketId, "user-trip", DataResponse);
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

export const ConsumerNormalTrip = async (message) => {
    console.log(message)
    const data = JSON.parse(message.content.toString())
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
    setTimeout(() => {
        if (!loopsBroken) {
            timesUp = true
            io.in(`/user/${data.user_id}`).emit("no-driver-found", "no drivers have been found")
        }
    }, 60000)
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
            AddDriverToBroadCast(driver.user_id);
            //
            broadCastToDriver(driver.socketId, "user-trip", DataResponse);
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