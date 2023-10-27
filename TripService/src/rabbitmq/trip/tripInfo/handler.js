import tripService from "../../../services/tripService";
import TripClient from '../client'
export class TripInfoHandler {
    static async handle(data, correlationId, replyTo) {
        const trip = await tripService.getBasicTripInfo(data)
        await TripClient.produceTripInfo(trip, correlationId, replyTo)
    }
}