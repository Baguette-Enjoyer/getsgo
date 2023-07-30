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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var locationService_1 = require("../services/locationService");
var connectRedisTS_1 = require("../config/connectRedisTS");
var driverServices_1 = require("../services/driverServices");
var userService_1 = require("../services/userService");
var tripService_1 = require("../services/tripService");
// import delay from "delay"
// let io = initServer.getIO()
var rd = (0, connectRedisTS_1["default"])();
var users = new Map();
var drivers = new Map();
var trips = new Map();
var driversInBroadcast = [];
var callcenterTrips = new Map();
var current_intervals = new Map();
var updateLocationLoop = function (io) {
    trips.forEach(function (trip_value, trip_id) {
        var driver_id = trip_value.driver_id;
        if (driver_id === undefined)
            return;
        // let socketDriver = GetSocketByDriverId(driver_id)
        var driver_info = getCurrentDriverInfoById(driver_id);
        var stringifiedResponse = JSON.stringify(driver_info);
        io["in"]("/user/".concat(trip_value.user_id)).emit('location-update', stringifiedResponse);
    });
    setTimeout(function () { return updateLocationLoop(io); }, 60000);
};
var deleteTripExceeded = function (io) {
    setInterval(function () {
        var now = new Date().getTime();
        trips.forEach(function (trip_value, trip_id) {
            if (now - trip_value.createdAt.getTime() >= 300000 && trip_value.status === 'Pending' && trip_value.driver_id == null) {
                io["in"]("/user/".concat(trip_value.user_id)).emit('trip-cancelled', { message: "trip cancelled due to lack of driver" });
            }
        });
    }, 300000);
}; //3-4phut khong co tai xe thi emit them
var notifyIfClose = function (io) {
    trips.forEach(function (trip_value, trip_id) {
        if (locationService_1["default"].getDistance(trip_value.start.lat, trip_value.start.lng, trip_value.end.lat, trip_value.end.lng) <= 1) {
            io["in"]("/user/".concat(trip_value.user_id)).emit('driver-close', { message: "driver is close" });
        }
    });
    setTimeout(function () { return notifyIfClose(io); }, 15000);
};
var runSocketService = function (io) {
    initSocket(io);
    initSocketService(io);
    console.log("socket service started");
};
var initSocketService = function (io) {
    updateLocationLoop(io);
    deleteTripExceeded(io);
    notifyIfClose(io);
};
var initSocket = function (io) {
    io.on('connection', function (socket) {
        console.log("socket " + socket.id + " connected");
        handleUserLogin(socket);
        handleDriverLogin(socket);
        handleUserFindTrip(io, socket);
        //handleCallcenterFindTrip(socket)
        handleDriverResponseBooking(io, socket);
        handleLocationUpdate(socket);
        handleDisconnect(socket);
    });
};
var handleUserLogin = function (socket) {
    socket.on('user-login', function (data) {
        var user_id = data.user_id;
        socket.join("/user/".concat(user_id));
        users.set(socket.id, {
            user_id: user_id
        });
    });
};
var handleDriverLogin = function (socket) {
    socket.on('driver-login', function (data) {
        var user_id = data.user_id;
        socket.join("/driver/".concat(user_id));
        drivers.set(socket.id, {
            user_id: user_id,
            lat: data.lat,
            lng: data.lng,
            status: data.status,
            vehicle_type: data.vehicle_type
        });
    });
};
var handleUserFindTrip = function (io, socket) {
    socket.on('user-find-trip', function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var trip_id, place1, user, user_id, userData, DataResponse, DataResponseStringified, possibleDrivers, isResponded, i, driver, d, driverData, responseData, stringifiedResponse, newTrip, dat, rdTripKey, TripDataStringified;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    trip_id = data.trip_id;
                    place1 = data.start;
                    user = getUserBySocket(socket);
                    user_id = user === null || user === void 0 ? void 0 : user.user_id;
                    return [4 /*yield*/, userService_1["default"].GetUserById(user_id)];
                case 1:
                    userData = _a.sent();
                    DataResponse = {
                        user_info: userData,
                        trip_info: data
                    };
                    DataResponseStringified = JSON.stringify(DataResponse);
                    possibleDrivers = locationService_1["default"].getFiveNearestDriver(drivers, place1, driversInBroadcast);
                    console.log(possibleDrivers);
                    isResponded = false;
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < possibleDrivers.length)) return [3 /*break*/, 10];
                    driver = possibleDrivers[i];
                    AddDriverToBroadCast(driver.user_id);
                    broadCastToDriver(io, driver.socketId, "user-trip", DataResponseStringified);
                    console.log("broadcasting to driver ".concat(driver.user_id));
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 15000); })];
                case 3:
                    _a.sent();
                    d = drivers.get(driver.socketId);
                    if (!(d === null || d === void 0 ? void 0 : d.hasResponded)) return [3 /*break*/, 8];
                    if (!(d.response == 'Accept')) return [3 /*break*/, 6];
                    isResponded = true;
                    return [4 /*yield*/, tripService_1["default"].UpdateTrip({ trip_id: trip_id, status: "Confirmed", driver_id: driver.user_id })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, driverServices_1["default"].GetDriverInfoById(driver.user_id)];
                case 5:
                    driverData = _a.sent();
                    responseData = {
                        trip_id: trip_id,
                        driver_info: driverData,
                        message: "found driver"
                    };
                    stringifiedResponse = JSON.stringify(responseData);
                    io["in"]("/user/".concat(user_id)).emit('found-driver', stringifiedResponse);
                    newTrip = data;
                    newTrip.driver_id = driver.user_id;
                    trips.set(trip_id, newTrip);
                    isResponded = true;
                    return [3 /*break*/, 10];
                case 6:
                    if (d.response == 'Deny') {
                        console.log("driver ".concat(driver.user_id, " has denied trip ").concat(trip_id));
                        return [3 /*break*/, 9];
                    }
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    console.log("driver ".concat(driver.user_id, " didnt respond to ").concat(trip_id));
                    _a.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 2];
                case 10:
                    if (!(isResponded == false)) return [3 /*break*/, 12];
                    dat = {
                        trip_id: trip_id,
                        status: "Waiting"
                    };
                    return [4 /*yield*/, tripService_1["default"].UpdateTrip(dat)];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12:
                    rdTripKey = "trip_id:".concat(trip_id);
                    trips.set(trip_id, data);
                    TripDataStringified = JSON.stringify(data);
                    return [4 /*yield*/, rd.set(rdTripKey, TripDataStringified)
                        // AddDriverToBroadCast(possibleDrivers[0].user_id)
                        // broadCastToDriver(io,possibleDrivers[0].socketId, "user-trip", DataResponseStringified)
                        // console.log(`broadcasting to driver ${possibleDrivers[0].user_id}`)
                        // let i = 1;
                        // let new_interval = setInterval(() => {
                        //     if (i >= possibleDrivers.length) {
                        //         setTimeout(async () => {
                        //             let dat = {
                        //                 trip_id,
                        //                 status: "Waiting"
                        //             }
                        //             await tripService.UpdateTrip(dat)
                        //             clearInterval(new_interval)
                        //         }, 15000)
                        //     }
                        //     else {
                        //         AddDriverToBroadCast(possibleDrivers[i].user_id)
                        //         broadCastToDriver(io,possibleDrivers[i][0], "user-trip", DataResponseStringified)
                        //         console.log(`broadcasting to driver ${possibleDrivers[i].user_id}`)
                        //         i++
                        //     }
                        // }, 15000)
                        // current_intervals.set(trip_id, new_interval)
                    ];
                case 13:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
};
var handleCallcenterFindTrip = function (io, socket) {
    socket.on('callcenter-find-trip', function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var trip_id, place1, DataResponse, DataResponseStringified, possibleDrivers, i, driver, dat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    trip_id = data.trip_id;
                    place1 = data.start;
                    DataResponse = {
                        trip_info: data
                    };
                    DataResponseStringified = JSON.stringify(DataResponse);
                    possibleDrivers = locationService_1["default"].getFiveNearestDriver(drivers, place1, driversInBroadcast);
                    console.log(possibleDrivers);
                    for (i = 0; i < possibleDrivers.length; i++) {
                        driver = possibleDrivers[i];
                        AddDriverToBroadCast(driver.user_id);
                        broadCastToDriver(io, driver.socketId, "user-trip", DataResponseStringified);
                        console.log("broadcasting to driver ".concat(driver.user_id));
                        // await delay(2000);
                    }
                    dat = {
                        trip_id: trip_id,
                        status: "Waiting"
                    };
                    return [4 /*yield*/, tripService_1["default"].UpdateTrip(dat)
                        // let possibleDrivers = locationServices.getFiveNearestDriver(drivers,place1,driversInBroadcast)
                        // AddDriverToBroadCast(possibleDrivers[0].user_id)
                        // broadCastToDriver(io,possibleDrivers[0][0], "callcenter-trip", DataResponseStringified)
                        // console.log(`broadcasting to driver ${possibleDrivers[0].user_id}`)
                        // let i = 1;
                        // let new_interval = setInterval(() => {
                        //     //
                        //     AddDriverToBroadCast(possibleDrivers[0].user_id)
                        //     broadCastToDriver(io,possibleDrivers[i].user_id, "callcenter-trip", DataResponseStringified)
                        //     console.log(`broadcasting to driver ${possibleDrivers[i].user_id}`)
                        //     i++
                        //     if (i >= possibleDrivers.length) {
                        //         setTimeout(async () => {
                        //             let dat = {
                        //                 trip_id,
                        //                 status: "Waiting"
                        //             }
                        //             await tripService.UpdateTrip(dat)
                        //             clearInterval(new_interval)
                        //         }, 15000)
                        //         //notify user that no driver has been found
                        //     }
                        // }, 15000)
                    ];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
};
var handleDriverResponseBooking = function (io, socket) {
    socket.on('driver-response-booking', function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var driver, driver_id, trip_id;
        return __generator(this, function (_a) {
            driver = drivers.get(socket.id);
            if (driver == undefined)
                return [2 /*return*/];
            driver_id = driver === null || driver === void 0 ? void 0 : driver.user_id;
            trip_id = data.trip_id;
            setDriverResponseStatus(driver_id, data.status);
            return [2 /*return*/];
        });
    }); });
};
var handleLocationUpdate = function (socket) {
    socket.on('driver-location-update', function (data) {
        var driver = drivers.get(socket.id);
        if (driver == undefined)
            return;
        var driver_id = driver === null || driver === void 0 ? void 0 : driver.user_id;
        var socket_ids = GetSocketByDriverId(driver_id);
        for (var i = 0; i < socket_ids.length; i++) {
            var driver_1 = drivers.get(socket_ids[i]);
            if (driver_1 == undefined)
                return;
            driver_1.lat = data.lat;
            driver_1.lng = data.lng;
            drivers.set(socket_ids[i], driver_1);
        }
    });
};
var getTripIfDisconnected = function (id) {
    // for (const [trip_id, value] of trips) {
    // }
    trips.forEach(function (trip_value, trip_id) {
        if (trip_value.user_id == id || trip_value.driver_id == id) {
            return trip_id;
        }
    });
    return null;
};
var getUserBySocket = function (socket) {
    var id = socket.id;
    var socket_value = users.get(id);
    return socket_value;
    // this will return a socket value { socket: socket for client, user_id, socket_id}
};
var getDriverBySocket = function (socket) {
    var id = socket.id;
    var socket_value = drivers.get(id);
    return socket_value;
    //similar to get user by socket
};
var broadCastToUser = function (io, socketid, event, data) {
    var socket_value = users.get(socketid) || undefined;
    if (socket_value === undefined) {
        return;
    }
    // console.log(socket_value.socket)
    if (socket_value === null) {
        throw new Error("user socket error");
    }
    var user_id = socket_value.user_id;
    io["in"]("/user/".concat(user_id)).emit(event, data);
};
var broadCastToDriver = function (io, socketid, event, data) {
    var socket_value = drivers.get(socketid) || undefined;
    if (socket_value === undefined) {
        return;
    }
    if (socket_value === null) {
        throw new Error("driver socket error");
    }
    var driver_id = socket_value.user_id;
    io["in"]("/driver/".concat(driver_id)).emit(event, data);
};
var GetSocketByUserId = function (user_id) {
    var socketArr = [];
    // for (const [socket_id, socket_value] of users) {
    //     if (socket_value.user_id == user_id) {
    //         socketArr.push(socket_id)
    //     }
    // }
    users.forEach(function (socket_value, socket_id) {
        if (socket_value.user_id == user_id) {
            socketArr.push(socket_id);
        }
    });
    return socketArr;
};
var GetSocketByDriverId = function (driver_id) {
    var socketArr = [];
    drivers.forEach(function (socket_value, socket_id) {
        if (socket_value.user_id == driver_id) {
            socketArr.push(socket_id);
        }
    });
    return socketArr;
};
var getUsersBySocket = function (socket) {
    if (users.get(socket.id) !== null) {
        return users.get(socket.id);
    }
    else
        return drivers.get(socket.id);
};
var getCurrentDriverInfoById = function (id) {
    // for (const [driver_id,driver_value] of drivers) {
    //     if (driver_value.user_id === id ) {
    //         return {
    //             lat: driver_value.lat,
    //             lng: driver_value.lng
    //         }
    //     }
    // }
    drivers.forEach(function (socket_value, socket_id) {
        if (socket_value.user_id == id) {
            return {
                lat: socket_value.lat,
                lng: socket_value.lng
            };
        }
    });
    return { lat: 0, lng: 0 };
};
var GetCurrentTripOfUser = function (id) {
    trips.forEach(function (trip_value, trip_id) {
        if (trip_value.user_id == id || trip_value.driver_id == id) {
            return trip_id;
        }
    });
    return null;
};
var GetDriversAround3KM = function (data) {
    var lat1 = data.lat;
    var lng1 = data.lng;
    var posDrivers = [];
    // for (const [driver_id,driver_value] of drivers) {
    //     if (locationServices.getDistance(lat1,lng1,driver_value.lat,driver_value.lng) <= 3){
    //         posDrivers.push({lat:driver_value.lat,lng:driver_value.lng})
    //     }
    // }
    drivers.forEach(function (driver_value, driver_id) {
        if (locationService_1["default"].getDistance(lat1, lng1, driver_value.lat, driver_value.lng) <= 3) {
            posDrivers.push({ lat: driver_value.lat, lng: driver_value.lng });
        }
    });
    return posDrivers;
};
var AddDriverToBroadCast = function (driver_id) {
    driversInBroadcast.push(driver_id);
    setTimeout(function () {
        var index = driversInBroadcast.indexOf(driver_id);
        if (index !== -1) {
            driversInBroadcast.splice(index, 1);
        }
    }, 15000);
};
var GetTripInfoById = function (id) {
    trips.forEach(function (trip_value, trip_id) {
        if (trip_id == id)
            return trip_value;
    });
    return null;
};
var handleDisconnect = function (socket) {
    socket.on('disconnect', function () {
        if (users.get(socket.id)) {
            users["delete"](socket.id);
        }
        else {
            drivers["delete"](socket.id);
        }
        // users.delete(socket.id)
        console.log("client disconnected " + socket.id);
    });
};
var setDriverStatusToIdle = function (driver_id, status) {
    drivers.forEach(function (driver_value, socketid) {
        if (driver_value.user_id === driver_id) {
            driver_value.status = status;
        }
    });
};
var setDriverResponseStatus = function (driver_id, status) {
    if (status == undefined)
        return;
    drivers.forEach(function (driver_value, socketid) {
        if (driver_value.user_id === driver_id) {
            driver_value.hasResponded = true;
            driver_value.response = status;
            setTimeout(function () {
                driver_value.hasResponded = false,
                    driver_value.response = undefined;
            }, 30000);
        }
    });
};
var test = function () {
    console.log(1);
};
exports["default"] = {
    runSocketService: runSocketService,
    GetDriversAround3KM: GetDriversAround3KM,
    GetTripInfoById: GetTripInfoById
};
