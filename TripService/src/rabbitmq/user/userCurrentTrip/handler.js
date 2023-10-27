import tripService from "../../../services/tripService"
import UserCurrentTripClient from './client'
export const handler = async (user_id, correlationId, replyTo) => {
    const trip = await tripService.GetUserCurrentTrip(user_id)
    console.log("kết quả 1", trip)
    await UserCurrentTripClient.produce(trip, correlationId, replyTo)
}