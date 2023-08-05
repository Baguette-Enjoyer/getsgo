// import { Driver, TripValue, User } from "../socketServiceTS";

export interface User {
    user_id: number
}

export interface Driver {
    user_id: number
    lat: number
    lng: number
    status: string
    vehicle_type: string
    // hasResponded?: boolean
    heading: number
    // rating: number
    response?: 'Accept' | 'Deny' | string
    client_id?:number 
}

export interface TripValue {
    trip_id: number
    user_id: number
    driver_id?: number
    start: {
        lat: number
        lng: number
        place: string
    }
    end: {
        lat: number
        lng: number
        place: string
    }
    status?: "Pending" | "Waiting" | "Confirmed" | "Driving" | "Arrived" | "Done" | "Cancelled" | string
    price: number
    is_paid: boolean
    paymentMethod: string
    is_scheduled: boolean
    createdAt: Date
    cancellable: boolean
    finished_date?: Date
    schedule_time?: Date
}

const users = new Map<string, User>()
const drivers = new Map<string, Driver>()
const trips = new Map<number, TripValue>()
let driversInBroadcast: number[] = []

export class UserMap {
    // users = new Map<string, User>()
    static getMap() {
        return users
    }
    // static get(key: string) {
    //     return users.get(key)
    // }

    // static set(key: string, User: User) {
    //     users.set(key, User)
    // }
    // static delete(key: string) {
    //     users.delete(key)
    // }
}

export class DriverMap {
    // drivers = new Map<string, Driver>()
    static getMap() {
        return drivers
    }
    // static get(key: string) {
    //     return drivers.get(key)
    // }
    // static set(key: string, Driver: Driver) {
    //     users.set(key, Driver)
    // }
    // static delete(key: string) {
    //     users.delete(key)
    // }
}

export class TripMap {
    // trips = new Map<number, TripValue>()
    static getMap() {
        return trips
    }
    // static get(key: number) {
    //     return trips.get(key)
    // }
    // static set(key: number, trip: TripValue) {
    //     trips.set(key, trip)
    // }
    // static delete(key: number) {
    //     trips.delete(key)
    // }
}

export class DriverInBroadcast {
    static getDriverInBroadcast() {
        return driversInBroadcast
    }
}



