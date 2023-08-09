import { DriverInBroadcast, DriverMap, TripMap, UserMap } from './storage'

export const GetRunningTrip = ()=>{
    const trips = Array.from(TripMap.getMap().entries()).map(([tripId,
        { user_id,driver_id,status,finished_date,trip_id,start,end,createdAt,is_paid,is_scheduled,schedule_time,price }]) => ({
            tripId,
            user_id,driver_id,status,finished_date,trip_id,start,end,createdAt,is_paid,is_scheduled,schedule_time,price
        }))
    return trips
}


