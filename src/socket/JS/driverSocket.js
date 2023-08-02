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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLocationUpdate = exports.getCurrentDriverInfoById = exports.setDriverResponseStatus = exports.setDriverStatus = exports.handleDriverResponseBooking = exports.handleDriverLogin = void 0;
const storage_1 = require("./storage");
const handleDriverLogin = (socket) => {
    socket.on('driver-login', (data) => {
        const user_id = data.user_id;
        socket.join(`/driver/${user_id}`);
        storage_1.DriverMap.getMap().set(socket.id, {
            user_id: user_id,
            lat: data.lat,
            lng: data.lng,
            status: data.status,
            vehicle_type: data.vehicle_type,
        });
        console.log(data);
    });
};
exports.handleDriverLogin = handleDriverLogin;
const handleDriverResponseBooking = (socket) => {
    socket.on('driver-response-booking', (data) => __awaiter(void 0, void 0, void 0, function* () {
        let driver = storage_1.DriverMap.getMap().get(socket.id);
        if (driver == undefined)
            return;
        let driver_id = driver === null || driver === void 0 ? void 0 : driver.user_id;
        let trip_id = data.trip_id;
        (0, exports.setDriverResponseStatus)(driver_id, data.status);
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
            driver_value.hasResponded = true;
            driver_value.response = status;
            setTimeout(() => {
                driver_value.hasResponded = false,
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
        let driver_id = driver === null || driver === void 0 ? void 0 : driver.user_id;
        let socket_ids = GetSocketByDriverId(driver_id);
        for (let i = 0; i < socket_ids.length; i++) {
            let driver = storage_1.DriverMap.getMap().get(socket_ids[i]);
            if (driver == undefined)
                return;
            driver.lat = data.lat;
            driver.lng = data.lng;
            storage_1.DriverMap.getMap().set(socket_ids[i], driver);
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
