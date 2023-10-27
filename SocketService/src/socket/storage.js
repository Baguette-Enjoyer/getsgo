const users = new Map()
const drivers = new Map()
// const trips = new Map()
let driversInBroadcast = []

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
}

// export class TripMap {
//     // trips = new Map<number, TripValue>()
//     static getMap() {
//         return trips
//     }
// }

export class DriverInBroadcast {
    static getDriverInBroadcast() {
        return driversInBroadcast
    }
}



