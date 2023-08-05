"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLocationUpdate = exports.getCurrentDriverInfoById = exports.setDriverResponseStatus = exports.setDriverStatus = exports.handleDriverResponseBooking = exports.handleDriverLogin = void 0;
const initServer_1 = require("../../services/initServer");
const storage_1 = require("./storage");
const tripService_1 = __importDefault(require("../../services/tripService"));
const driverServices_1 = __importDefault(require("../../services/driverServices"));
const handleDriverLogin = (socket) => {
    socket.on('driver-login', (data) => {
        const user_id = data.user_id;
        socket.join(`/driver/${user_id}`);
        storage_1.DriverMap.getMap().set(socket.id, {
            user_id: user_id,
            lat: data.lat,
            lng: data.lng,
            status: data.status,
            heading: data.heading,
            vehicle_type: data.vehicle_type,
            // rating: data.rating,
            client_id: undefined,
        });
        console.log(data);
    });
};
exports.handleDriverLogin = handleDriverLogin;
const senDriver = (trip, driver, socket_id) => __awaiter(void 0, void 0, void 0, function* () {
    yield tripService_1.default.UpdateTrip({ trip_id: trip.trip_id, status: "Confirmed", driver_id: driver.user_id });
    let driverData = yield driverServices_1.default.GetDriverInfoById(driver.user_id);
    let responseData = {
        trip_id: trip.trip_id,
        driver_info: driverData,
        lat: driver.lat,
        lng: driver.lng,
        heading: driver.heading,
        message: "coming"
    };
    // const stringifiedResponse = JSON.stringify(responseData);
    initServer_1.io.in(`/user/${trip.user_id}`).emit('found-driver', responseData);
    // khi driver chấp nhận thì set lại client_id cho tài xế đó
    driver.client_id = trip.user_id;
    storage_1.DriverMap.getMap().set(socket_id, driver);
});
const handleDriverResponseBooking = (socket) => {
    socket.on('driver-response-booking', (data) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(data)
        const driver = storage_1.DriverMap.getMap().get(socket.id);
        if (driver == undefined)
            return;
        if (data.status == "Accept") {
            const trip = storage_1.TripMap.getMap().get(data.trip.trip_id);
            if (trip !== undefined && trip.driver_id === undefined) {
                trip.driver_id = driver.user_id;
                trip.status = 'Confirmed';
                // const newTrip = trip
                // trip.status = 'Confirmed'
                // trip.driver_id = driver.user_id
                console.log(trip);
                storage_1.TripMap.getMap().set(trip.trip_id, trip);
                senDriver(trip, driver, socket.id);
            }
        }
        // let driver_id = driver?.user_id
        // let trip_id = data.trip_id
        // setDriverResponseStatus(driver_id, data.status)
        // console.log(DriverMap.getMap().get(socket.id))
        //long
        // console.log(data)
        // let driver = DriverMap.getMap().get(socket.id)
        // if (driver == undefined) return
        // let driver_id = driver?.user_id
        // let trip_id = data.trip_id
        // setDriverResponseStatus(driver_id, data.status)
        // console.log(DriverMap.getMap().get(socket.id))
        // if (data.status == 'Deny' ) return 
        // driver.status = 'Driving'
        // drivers.set(socket.id,driver)
        // await tripService.UpdateTrip({trip_id:trip_id,status:"Confirmed",driver_id: driver_id})
        // let driverData = await driverServices.GetDriverInfoById(driver_id)
        // let responseData = {
        //     trip_id: trip_id,
        //     driver_info: driverData,
        //     message: "found driver"
        // }
        // let stringifiedResponse = JSON.stringify(responseData)
        // let trip = trips.get(trip_id)
        // let user_id = trip?.user_id
        // // io.to(`/trip/${trip_id}`).emit('found-driver', stringifiedResponse)
        // // socket.join(`/trip/${trip_id}`)
        // io.in(`/user/${user_id}`).emit('found-driver', stringifiedResponse)
        // let updatedTrip = trips.get(trip_id)
        // updatedTrip!.driver_id = driver_id
        // if (updatedTrip === undefined) return
        // trips.set(trip_id, updatedTrip)
        // clearInterval(current_intervals.get(trip_id))
        // current_intervals.delete(trip_id)
    }));
};
exports.handleDriverResponseBooking = handleDriverResponseBooking;
const setDriverStatus = (driver_id, status) => {
    storage_1.DriverMap.getMap().forEach((driver_value, socketid) => {
        if (driver_value.user_id === driver_id) {
            driver_value.status = status;
            return;
        }
    });
};
exports.setDriverStatus = setDriverStatus;
const setDriverResponseStatus = (driver_id, status) => {
    if (status == undefined)
        return;
    storage_1.DriverMap.getMap().forEach((driver_value, socketid) => {
        if (driver_value.user_id === driver_id) {
            // driver_value.hasResponded = true
            driver_value.response = status;
            setTimeout(() => {
                // driver_value.hasResponded = false,
                driver_value.response = undefined;
            }, 30000);
            return;
        }
    });
};
exports.setDriverResponseStatus = setDriverResponseStatus;
const getCurrentDriverInfoById = (id) => {
    storage_1.DriverMap.getMap().forEach((socket_value, socket_id) => {
        if (socket_value.user_id == id) {
            return {
                lat: socket_value.lat,
                lng: socket_value.lng
            };
        }
    });
    return { lat: 0, lng: 0 };
};
exports.getCurrentDriverInfoById = getCurrentDriverInfoById;
const handleLocationUpdate = (socket) => {
    socket.on('driver-location-update', (data) => {
        let driver = storage_1.DriverMap.getMap().get(socket.id);
        if (driver == undefined)
            return;
        // let driver_id = driver?.user_id
        // let socket_ids = GetSocketByDriverId(driver_id)
        // for (let i = 0; i < socket_ids.length; i++) {
        //     let driver = DriverMap.getMap().get(socket_ids[i])
        //     if (driver == undefined) return
        //     driver!.lat = data.lat
        //     driver!.lng = data.lng
        //     driver!.heading = data.heading
        //     DriverMap.getMap().set(socket_ids[i], driver)
        // } 
        driver.lat = data.lat;
        driver.lng = data.lng;
        console.log('update location driver');
        driver.heading = data.heading;
        if (driver.client_id !== undefined) {
            initServer_1.io.in(`/user/${driver.client_id}`).emit('get-location-driver', data);
        }
    });
};
exports.handleLocationUpdate = handleLocationUpdate;
const GetSocketByDriverId = (driver_id) => {
    let socketArr = [];
    storage_1.DriverMap.getMap().forEach((socket_value, socket_id) => {
        if (socket_value.user_id == driver_id) {
            socketArr.push(socket_id);
        }
    });
    return socketArr;
};
