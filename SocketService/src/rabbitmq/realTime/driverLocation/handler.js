import { GetSocketByDriverId } from "../../../socket/driverSocket"
import RealTimeClient from '../client'
export const handler = async (driver_id, correlationId, replyTo) => {
    const data = GetSocketByDriverId(driver_id)
    const driver_dat = {
        location: data
    }
    await RealTimeClient.produceDriverLocation(driver_dat, correlationId, replyTo)
}