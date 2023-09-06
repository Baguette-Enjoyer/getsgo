"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.BroadcastIdleDrivers = exports.handleMessageFromUser = exports.broadcastScheduleTrip = exports.handleLocationUpdate = exports.getCurrentDriverInfoById = exports.setDriverResponseStatus = exports.setDriverStatus = exports.handleDriverResponseBooking = exports.getDriverCurrentTrip = exports.handleDriverLogin = void 0;
const initServer_1 = require("../../services/initServer");
const storage_1 = require("./storage");
const tripService_1 = __importStar(require("../../services/tripService"));
const driverServices_1 = __importDefault(require("../../services/driverServices"));
const handleDriverLogin = (socket) => {
    socket.on('driver-login', (data) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const user_id = data.user_id;
        const driver_info = yield driverServices_1.default.GetDriverInfoById(user_id);
        const driver_data = {
            user_id: user_id,
            lat: data.lat,
            lng: data.lng,
            status: data.status,
            heading: data.heading,
            vehicle_type: driver_info.driver_info.driver_vehicle.id,
            rating: driver_info.statics.starResult,
            client_id: undefined,
            token_fcm: driver_info.token_fcm,
        };
        const curTrips = yield (0, tripService_1.GetRunningTripOfDriver)(user_id);
        const currentTrip = (0, exports.getDriverCurrentTrip)(user_id);
        // const curTrips = await tripService.GetRunningTripOfUser(user_id)
        // curTrips.forEach((item:any)=>{
        //     const driverInfo = GetDriverInfoById(item.driver_id)
        //     const driverDat = DriverMap.getMap().get(driverInfo!)
        //     curTrips.driver = driverDat
        // })
        if (currentTrip != null) {
            driver_data.client_id = (_a = storage_1.TripMap.getMap().get(currentTrip)) === null || _a === void 0 ? void 0 : _a.user_id;
        }
        console.log(driver_data);
        socket.join(`/driver/${user_id}`);
        initServer_1.io.in(`/driver/${user_id}`).emit("driver-reconnect", curTrips);
        storage_1.DriverMap.getMap().set(socket.id, driver_data);
        // console.log(data)
    }));
};
exports.handleDriverLogin = handleDriverLogin;
const getDriverCurrentTrip = (driver_id) => {
    storage_1.TripMap.getMap().forEach((trip_value, trip_id) => {
        if (trip_value.driver_id == driver_id) {
            return trip_id;
        }
    });
    return null;
};
exports.getDriverCurrentTrip = getDriverCurrentTrip;
const senDriver = (trip, driver, socket_id) => __awaiter(void 0, void 0, void 0, function* () {
    yield tripService_1.default.UpdateTrip({ trip_id: trip.trip_id, status: "Confirmed", driver_id: driver.user_id });
    let driverData = yield driverServices_1.default.GetDriverInfoById(driver.user_id);
    let responseData = {
        trip_id: trip.trip_id,
        driver_info: driverData,
        lat: driver.lat,
        lng: driver.lng,
        heading: driver.heading,
        message: "coming",
        status: "Confirmed",
        is_scheduled: trip.is_scheduled
    };
    // const user = userService.getUserBySocket(trip.user_id);
    // const stringifiedResponse = JSON.stringify(responseData);
    console.log('555555555555');
    console.log(responseData.driver_info);
    console.log(responseData.driver_info.User);
    console.log(responseData);
    initServer_1.io.in(`/user/${trip.user_id}`).emit('found-driver', responseData);
    initServer_1.io.in("callcenter").emit('found-driver', responseData);
    // khi driver chấp nhận thì set lại client_id cho tài xế đó
    driver.client_id = trip.user_id;
    storage_1.DriverMap.getMap().set(socket_id, driver);
    // await initConvo(trip.trip_id, trip.user_id, driver.user_id)
});
const handleDriverResponseBooking = (socket) => {
    socket.on('driver-response-booking', (data) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(data)
        console.log('nè mâfafasf');
        const driver = storage_1.DriverMap.getMap().get(socket.id);
        if (driver == undefined)
            return;
        if (data.status == "Accept") {
            const trip = storage_1.TripMap.getMap().get(data.trip.trip_id);
            if (trip !== undefined && trip.driver_id === undefined) {
                trip.driver_id = driver.user_id;
                trip.status = 'Confirmed';
                driver.response = "Accept";
                driver.status = "Driving";
                // const newTrip = trip
                // trip.status = 'Confirmed'
                // trip.driver_id = driver.user_id
                console.log(trip);
                storage_1.TripMap.getMap().set(trip.trip_id, trip);
                storage_1.DriverMap.getMap().set(socket.id, driver);
                senDriver(trip, driver, socket.id);
                //thông báo cho driver nhận chuyến ok
                initServer_1.io.in(`/driver/${driver.user_id}`).emit("receive-trip-success", "successfully received trip");
                //ádasdasdada
            }
            else {
                //thông báo driver user đã có chuyến
                initServer_1.io.in(`/driver/${driver.user_id}`).emit("received-trip-fail", "user in another trip");
            }
        }
        else {
            driver.response = "Deny";
            storage_1.DriverMap.getMap().set(socket.id, driver);
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
                user_id: socket_value.user_id,
                status: socket_value.status,
                lat: socket_value.lat,
                lng: socket_value.lng
            };
        }
    });
    return { user_id: 0, status: "", lat: 0, lng: 0 };
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
const broadcastScheduleTrip = (socket) => {
};
exports.broadcastScheduleTrip = broadcastScheduleTrip;
const handleMessageFromUser = (socket) => {
    socket.on("user-message", (data) => {
        socket.to(`/driver/${data.user_id}`).emit("message-to-driver", data.message);
    });
};
exports.handleMessageFromUser = handleMessageFromUser;
const GetSocketByDriverId = (driver_id) => {
    let socketArr = [];
    storage_1.DriverMap.getMap().forEach((socket_value, socket_id) => {
        if (socket_value.user_id == driver_id) {
            socketArr.push(socket_id);
        }
    });
    return socketArr;
};
const BroadcastIdleDrivers = (event, data) => {
    storage_1.DriverMap.getMap().forEach((socket_value, socket_id) => {
        if (socket_value.status == "Idle") {
            initServer_1.io.in(`/driver/${socket_value.user_id}`).emit(event, data);
        }
    });
};
exports.BroadcastIdleDrivers = BroadcastIdleDrivers;
