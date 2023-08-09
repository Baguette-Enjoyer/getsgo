"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRunningTrip = void 0;
const storage_1 = require("./storage");
const GetRunningTrip = () => {
    const trips = Array.from(storage_1.TripMap.getMap().entries()).map(([tripId, { user_id, driver_id, status, finished_date, trip_id, start, end, createdAt, is_paid, is_scheduled, schedule_time, price }]) => ({
        tripId,
        user_id, driver_id, status, finished_date, trip_id, start, end, createdAt, is_paid, is_scheduled, schedule_time, price
    }));
    return trips;
};
exports.GetRunningTrip = GetRunningTrip;
