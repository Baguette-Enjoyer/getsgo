import tripService from "../../../services/tripService"
import UserRunningTripClient from './client'
export const userRunningTripHandler = async (user_id, correlationId, replyTo) => {
    const t = await tripService.GetRunningTripOfUser(user_id)
    await UserRunningTripClient.produce(t, correlationId, replyTo)

}