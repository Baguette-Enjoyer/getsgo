import tripService from '../../../services/tripService'
import DriverCurrentTripClient from './client'
export const handler = async (driver_id, correlationId, replyTo) => {
    const t = await tripService.GetDriverCurrentTrip(driver_id)
    await DriverCurrentTripClient.produce(t, correlationId, replyTo)
}