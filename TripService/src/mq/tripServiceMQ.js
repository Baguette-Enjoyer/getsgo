import { SendMessageToQueue, deleteTripQueue, driverAcceptRequestQ } from './createChannel.js'
import { DriverMap, TripMap, DriverInBroadcast } from '../socket/JS/storage.js'
import locationServices from '../services/locationService.js'
// import { AddDriverToBroadCast, broadCastToDriver } from '../socket/JS/userSocket.js'
// import { io } from '../services/initServer.js'
import tripService, { DeleteTrip } from '../services/tripService.js'
import UserInfoClient from '../rabbitmq/userInfo/client.js'
import { exchangeTrip, createTripKey, updateTripKey, deleteTripKey, createTripCCKey } from './createChannel.js'
import uuid from 'uuid'

export const DeleteTripQueue = async (channel) => {
    channel.consume(deleteTripQueue, async (message) => {
        const trip_id = parseInt(message.content.toString())
        try {
            await tripService.DeleteTrip(trip_id)
            console.log("--------------")
            console.log("deleted ", trip_id)
            console.log("--------------")
        } catch (error) {
            throw new Error(error)
        }
        channel.ack(message)
    })
}

export const UpdateTripQueue = async (channel) => {
    channel.consume(deleteTripQueue, async (message) => {
        const updateObj = JSON.parse(message.content.toString())
        try {
            await tripService.UpdateTrip(updateObj)
            console.log("--------------")
            console.log("updated")
            console.log("--------------")
        } catch (error) {
            throw new Error(error)
        }
        channel.ack(message)
    })
}


export const ConsumeNormalTripVer2 = async (channel) => {
    channel.consume("book-trip-queue", async (message) => {
        const data = JSON.parse(message.content.toString())
        // console.log(data);
        // const trip_id = data.trip_id
        // const place1 = data.start
        const sendData = {
            "trip_info": data,
            "user_id": data.user_id
        }
        const stringifiedSendData = JSON.stringify(sendData)
        channel.sendToQueue("user-info-request", Buffer.from(stringifiedSendData), {
            replyTo: bookTripQueue2,
        })
        channel.ack(message)
    })

}

export const ConsumeDriverRespond = (channel) => {
    channel.consume(driverAcceptRequestQ, async (message) => {
        const data = JSON.parse(message.content.toString())
        const trip = await tripService.getBasicTripInfo(data.trip_id)
        const DataSend = {
            driver_id: data.driver_id,
            trip_id: data.trip_id,
            user_id: trip.user_id
        }
        if (trip.driver_id == null) {
            DataSend.client_id = trip.user_id
            await tripService.UpdateTrip({ trip_id: data.trip_id, status: "Confirmed", driver_id: data.driver_id })
            SendMessageToQueue("receive-trip-success", DataSend)
            // channel.sendToQueue("receive-trip-success",)
        }
        else {
            SendMessageToQueue("receive-trip-fail", DataSend)
            // channel.sendToQueue("receive-trip-fail",)

        }
    })
}

export const ConsumeBookTripStep2 = (channel) => {
    channel.consume(bookTripQueue2, async (message) => {
        const data = JSON.parse(message.content.toString())
        console.log("This is data")
        console.log(data);
        const trip_id = data.trip_id
        const place1 = data.start

        let timesUp = false
        let loopsBroken = false

        let DataResponse = {
            user_info: data.user_info,
            trip_info: data.trip_info
        }
        const stringifiedResponse = JSON.stringify(DataResponse)
        setTimeout(async () => {
            if (!loopsBroken) {
                timesUp = true
                channel.sendToQueue(deleteTripQueue, Buffer.from(trip_id.toString()))
                // await DeleteTrip(trip_id)
                // TripMap.getMap().delete(trip_id)
                // io.in(`/user/${data.user_id}`).emit("no-driver-found", "no drivers have been found")
            }
        }, 70000)
        while (timesUp == false) {
            channel.SendMessageToQueue("find-driver-queue", Buffer.from(stringifiedResponse))
            // console.log(DriverMap.getMap());
            // console.log('hehehhehe');
            // const possibleDrivers = locationServices.requestRide(DriverMap.getMap(), place1, DriverInBroadcast.getDriverInBroadcast())
            // console.log(possibleDrivers);
            // for (let i = 0; i < possibleDrivers.length; i++) {
            //     console.log('driver');
            //     console.log(DataResponse);
            //     const driver = possibleDrivers[i];
            //     console.log(driver.socketId)
            //     if (timesUp != true && loopsBroken == false) {
            //         AddDriverToBroadCast(driver.user_id);
            //         //
            //         broadCastToDriver(driver.socketId, "user-trip", DataResponse);
            //     }
            // }
            await new Promise((resolve) => setTimeout(resolve, 11000));
            const trip = await tripService.getBasicTripInfo(trip_id)
            // const trip = TripMap.getMap().get(trip_id);
            console.log('11111111111')
            console.log(trip)
            if (trip !== undefined && trip.driver_id !== undefined) {
                loopsBroken = true
                break;
            }
        }
    }, { noAck: true })
}



export const ConsumerCallcenterTrip = async (message) => {
    // console.log(message)
    const data = JSON.parse(message.content.toString())
    console.log("This is data")
    console.log(data);
    const trip_id = data.trip_id
    const place1 = data.start

    ////////
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

export const ConsumerNormalTrip = async (message) => {
    // console.log(message)
    const data = JSON.parse(message.content.toString())
    console.log(data);
    const trip_id = data.trip_id
    const place1 = data.start

    // let userData = await userService.GetUserById(data.user_id)
    const userData = await UserInfoClient.produce(data.user_id)
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
            // TripMap.getMap().delete(trip_id)
            await DeleteTrip(trip_id)
            // io.in(`/user/${data.user_id}`).emit("no-driver-found", "no drivers have been found")
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