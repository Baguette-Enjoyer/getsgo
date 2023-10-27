import { GetTripS3 } from "../../../services/tripService"
import TripS3Client from './client'
export const handler = async (correlationId, replyTo) => {
    const tripS3 = await GetTripS3()
    await TripS3Client.produce(tripS3, correlationId, replyTo)
}