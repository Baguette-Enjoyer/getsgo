import FindDriverClient from './client'
import { DriverMap, DriverInBroadcast } from "../../socket/storage";
import locationServices from "../../service/locationService";
import { AddDriverToBroadCast, broadCastToDriver } from "../../socket/userSocket";
export class FindDriverHandler {
    static async handle(data, correlationId, replyTo) {
        const DataResponse = {
            trip_info: data.trip_info,
            user_info: data.user_info
        }
        // const driverData = await driverServices.GetDriverInfoById(driver_id);
        // yet to have star and stats
        console.log("hú data", data)
        // const trip_id = data.trip_id
        const place1 = data.trip_info.start
        const possibleDrivers = locationServices.requestRide(DriverMap.getMap(), place1, DriverInBroadcast.getDriverInBroadcast())
        for (let i = 0; i < possibleDrivers.length; i++) {
            console.log('driver');
            console.log(DataResponse);
            const driver = possibleDrivers[i];
            console.log(driver.socketId)
            AddDriverToBroadCast(driver.user_id);
            //
            broadCastToDriver(driver.socketId, "user-trip", data);
        }
        await FindDriverClient.produce("ok", correlationId, replyTo)
    }
}