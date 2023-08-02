"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDriversAround3KM = exports.runSocketService = void 0;
const initServer_1 = require("../../services/initServer");
const userSocket_1 = require("./userSocket");
const driverSocket_1 = require("./driverSocket");
const storage_1 = require("./storage");
const locationService_1 = __importDefault(require("../../services/locationService"));
const runSocketService = () => {
    initSocket();
    initSocketService();
    console.log("socket service running");
};
exports.runSocketService = runSocketService;
const initSocket = () => {
    initServer_1.io.on('connection', (socket) => {
        console.log("socket " + socket.id + " connected");
        (0, userSocket_1.handleUserLogin)(socket);
        (0, driverSocket_1.handleDriverLogin)(socket);
        (0, userSocket_1.handleUserFindTrip)(socket);
        //handleCallcenterFindTrip(socket)
        (0, driverSocket_1.handleDriverResponseBooking)(socket);
        (0, driverSocket_1.handleLocationUpdate)(socket);
        handleDisconnect(socket);
    });
};
const initSocketService = () => {
    updateLocationLoop();
};
const updateLocationLoop = () => {
    storage_1.TripMap.getMap().forEach((trip_value, trip_id) => {
        const driver_id = trip_value.driver_id;
        if (driver_id === undefined)
            return;
        // let socketDriver = GetSocketByDriverId(driver_id)
        const driver_info = (0, driverSocket_1.getCurrentDriverInfoById)(driver_id);
        const stringifiedResponse = JSON.stringify(driver_info);
        initServer_1.io.in(`/user/${trip_value.user_id}`).emit('location-update', stringifiedResponse);
    });
    setTimeout(() => updateLocationLoop(), 60000);
};
const handleDisconnect = (socket) => {
    socket.on('disconnect', () => {
        if (storage_1.UserMap.getMap().get(socket.id)) {
            storage_1.UserMap.getMap().delete(socket.id);
        }
        else {
            storage_1.DriverMap.getMap().delete(socket.id);
        }
        // users.delete(socket.id)
        console.log("client disconnected " + socket.id);
    });
};
const GetDriversAround3KM = (data) => {
    const lat1 = data.lat;
    const lng1 = data.lng;
    const posDrivers = [];
    // for (const [driver_id,driver_value] of drivers) {
    //     if (locationServices.getDistance(lat1,lng1,driver_value.lat,driver_value.lng) <= 3){
    //         posDrivers.push({lat:driver_value.lat,lng:driver_value.lng})
    //     }
    // }
    storage_1.DriverMap.getMap().forEach((driver_value, driver_id) => {
        if (locationService_1.default.getDistance(lat1, lng1, driver_value.lat, driver_value.lng) <= 3) {
            posDrivers.push({ lat: driver_value.lat, lng: driver_value.lng });
        }
    });
    return posDrivers;
};
exports.GetDriversAround3KM = GetDriversAround3KM;
