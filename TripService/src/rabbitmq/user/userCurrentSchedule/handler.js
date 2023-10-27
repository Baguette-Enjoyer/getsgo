import tripService from "../../../services/tripService"
import UserCurrentScheduleTripClient from './client'
export const handler = async (user_id, correlationId, replyTo) => {
    const trips = await tripService.GetRunningTripOfUser(user_id)
    console.log("kết quả 2", trips)
    await UserCurrentScheduleTripClient.produce(trips, correlationId, replyTo)
}