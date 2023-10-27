import FindDriverClient from '../../findDriver/client'
import { BroadCastUserClient } from '../../broadCast/broadCastUser/client'
import tripService from '../../../services/tripService'
export const handleFind = async (data, userData) => {
    // const place1 = data.start
    const trip_id = data.trip_id
    // TripMap.getMap().set(data.trip_id, data);
    // TripMap.getMap().set(data.trip_id, data);
    let DataResponse = {
        user_info: userData,
        trip_info: data
    }
    let timesUp = false
    let loopsBroken = false
    // let DataResponseStringified = JSON.stringify(DataResponse)
    setTimeout(async () => {
        if (!loopsBroken) {
            timesUp = true
            await tripService.DeleteTrip(trip_id)
            await BroadCastUserClient.produce(data.user_id, "no-driver-found", "no drivers have been found")
            // io.in(`/user/${data.user_id}`).emit("no-driver-found", "no drivers have been found")
        }
    }, 70000)

    while (timesUp == false && loopsBroken == false) {
        const response = await FindDriverClient.produce(DataResponse)
        console.log("response from find driver queue", response)
        await new Promise((resolve) => setTimeout(resolve, 11000));
        // const trip = TripMap.getMap().get(trip_id);
        const trip = await tripService.getBasicTripInfo(trip_id)
        console.log('11111111111')
        console.log(trip)
        if (trip != undefined && trip.driver_id !== null) {
            loopsBroken = true
            break;
        }
    }
}