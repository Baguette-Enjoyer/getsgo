import driverServices from "../../services/driverServices";
import DriverInfoClient from "./client";
import DriverStatClient from '../driverStats/client'
export class DriverInfoHandler {
    static async handle(driver_id, correlationId, replyTo) {
        const driverData = await driverServices.GetDriverInfoById(driver_id);
        console.log("trả driver data nè", driverData)
        // const stats = await DriverStatClient.produce(driver_id)
        //got stats
        // const driverInfo = {
        //     "driver_info": driverData,
        //     "statics": stats
        // }
        // const driverStats = await DriverStatClient.
        //yet to have star and stats -> stats available but not checked yet
        await DriverInfoClient.produce(driverData, correlationId, replyTo)
    }
}