import { GetTripS2 } from "../../../services/tripService"
import TripS2Client from './client'
export const handler = async (correlationId, replyTo) => {
    const tripS2 = await GetTripS2()
    await TripS2Client.produce(tripS2, correlationId, replyTo)
}