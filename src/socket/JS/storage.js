"use strict";
// import { Driver, TripValue, User } from "../socketServiceTS";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverInBroadcast = exports.TripMap = exports.DriverMap = exports.UserMap = void 0;
const users = new Map();
const drivers = new Map();
const trips = new Map();
let driversInBroadcast = [];
class UserMap {
    // users = new Map<string, User>()
    static getMap() {
        return users;
    }
}
exports.UserMap = UserMap;
class DriverMap {
    // drivers = new Map<string, Driver>()
    static getMap() {
        return drivers;
    }
}
exports.DriverMap = DriverMap;
class TripMap {
    // trips = new Map<number, TripValue>()
    static getMap() {
        return trips;
    }
}
exports.TripMap = TripMap;
class DriverInBroadcast {
    static getDriverInBroadcast() {
        return driversInBroadcast;
    }
}
exports.DriverInBroadcast = DriverInBroadcast;
