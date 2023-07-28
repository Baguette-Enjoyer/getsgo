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
var connectRedis_1 = require("../config/connectRedis");
var driverServices_1 = require("../services/driverServices");
var userService_1 = require("../services/userService");
var tripService_1 = require("../services/tripService");
// let io = initServer.getIO()
var rd = (0, connectRedis_1.getRedisCon)();
var users = new Map();
var drivers = new Map();
var trips = new Map();
var callcenterTrips = new Map();
var current_intervals = new Map();
var updateLocationLoop = function (io) {
    // for (const [trip_id, trip_value] of trips) {
    //     let driver_id = trip_value.driver_id
    //     if (driver_id === undefined) return 
    //     // let socketDriver = GetSocketByDriverId(driver_id)
    //     let driver_info = getCurrentDriverInfoById(driver_id)
    //     let stringifiedResponse = JSON.stringify(driver_info)
    //     io.to(`/trip/${trip_id}`).emit('location-update',stringifiedResponse)
    // }
    trips.forEach(function (trip_value, trip_id) {
        var driver_id = trip_value.driver_id;
        if (driver_id === undefined)
            return;
        // let socketDriver = GetSocketByDriverId(driver_id)
        var driver_info = getCurrentDriverInfoById(driver_id);
        var stringifiedResponse = JSON.stringify(driver_info);
        io.to("/trip/".concat(trip_id)).emit('location-update', stringifiedResponse);
    });
    setTimeout(function () { return updateLocationLoop(io); }, 60000);
};
var deleteTripExceeded = function (io) {
    setInterval(function () {
        var now = new Date().getTime();
        // for (const [trip_id,trip_value] of trips){
        //     if (now - trip_value.createdAt.getTime() >= 300000 && trip_value.status === 'Pending' && trip_value.driver_id == null){
        //         io.in(`/trip/${trip_id}`).emit('trip-cancelled',{message:"trip cancelled due to lack of driver"})
        //         io.in(`/trip/${trip_id}`).socketsLeave(`/trip/${trip_id}`)
        //     }
        // }
        trips.forEach(function (trip_value, trip_id) {
            if (now - trip_value.createdAt.getTime() >= 300000 && trip_value.status === 'Pending' && trip_value.driver_id == null) {
                io["in"]("/trip/".concat(trip_id)).emit('trip-cancelled', { message: "trip cancelled due to lack of driver" });
                io["in"]("/trip/".concat(trip_id)).socketsLeave("/trip/".concat(trip_id));
            }
        });
    }, 300000);
};
var notifyIfClose = function (io) {
    // for (const [trip_id,trip_value] of trips){
    //     if(locationServices.getDistance(trip_value.start.lat,trip_value.start.lng,trip_value.end.lat,trip_value.end.lng) <= 1){
    //         io.in(`/trip/${trip_id}`).emit('driver-close', {message:"driver is close"})
    //     }
    // }
    trips.forEach(function (trip_value, trip_id) {
        if (locationService_1["default"].getDistance(trip_value.start.lat, trip_value.start.lng, trip_value.end.lat, trip_value.end.lng) <= 1) {
            io["in"]("/trip/".concat(trip_id)).emit('driver-close', { message: "driver is close" });
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
        handleUserFindTrip(socket);
        //handleCallcenterFindTrip(socket)
        handleDriverResponseBooking(io, socket);
        handleDisconnect(socket);
    });
};
var handleUserLogin = function (socket) {
    socket.on('user-login', function (data) {
        var user_id = data.user_id;
        var trip_id = GetCurrentTripOfUser(user_id);
        if (trip_id != null) {
            socket.join("/trip/".concat(trip_id));
            socket.emit('user-rejoin', { message: "user rejoin trip" });
        }
        users.set(socket.id, {
            user_id: user_id,
            socket: socket,
            socket_id: socket.id
        });
    });
};
var handleDriverLogin = function (socket) {
    socket.on('driver-login', function (data) {
        var user_id = data.user_id;
        var trip_id = GetCurrentTripOfUser(user_id);
        if (trip_id != null) {
            socket.join("/trip/".concat(trip_id));
            socket.emit('user-rejoin', { message: "driver rejoin trip" });
        }
        drivers.set(socket.id, {
            user_id: user_id,
            socket: socket,
            socket_id: socket.id,
            lat: data.lat,
            lng: data.lng,
            status: data.status,
            vehicle_type: data.vehicle_type
        });
    });
};
var handleUserFindTrip = function (socket) {
    socket.on('user-find-trip', function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var trip_id, place1, user, user_id, userData, DataResponse, DataResponseStringified, possibleDrivers, i, new_interval, rdTripKey, TripDataStringified;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    trip_id = data.trip_id;
                    place1 = data.start;
                    user = getUserBySocket(socket);
                    user_id = user === null || user === void 0 ? void 0 : user.user_id;
                    return [4 /*yield*/, userService_1["default"].GetUserById(user_id)
                        // let userDataStringified = JSON.stringify(userData)
                    ];
                case 1:
                    userData = _a.sent();
                    // let userDataStringified = JSON.stringify(userData)
                    socket.join("/trip/".concat(trip_id));
                    DataResponse = {
                        user_info: userData,
                        trip_info: data
                    };
                    DataResponseStringified = JSON.stringify(DataResponse);
                    possibleDrivers = locationService_1["default"].findPossibleDriver(drivers, place1);
                    broadCastToDriver(possibleDrivers[0][1].socket, "user-trip", DataResponseStringified);
                    console.log("broadcasting to driver ".concat(possibleDrivers[0]));
                    i = 1;
                    new_interval = setInterval(function () {
                        //
                        broadCastToDriver(possibleDrivers[i][1].socket, "user-trip", DataResponseStringified);
                        console.log("broadcasting to driver ".concat(possibleDrivers[i]));
                        i++;
                        if (i >= possibleDrivers.length) {
                            setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                                var dat;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            dat = {
                                                trip_id: trip_id,
                                                status: "Waiting"
                                            };
                                            return [4 /*yield*/, tripService_1["default"].UpdateTrip(dat)];
                                        case 1:
                                            _a.sent();
                                            clearInterval(new_interval);
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, 15000);
                            //notify user that no driver has been found
                        }
                    }, 15000);
                    rdTripKey = "trip_id:".concat(trip_id);
                    trips.set(trip_id, data);
                    TripDataStringified = JSON.stringify(data);
                    return [4 /*yield*/, rd.set(rdTripKey, TripDataStringified)];
                case 2:
                    _a.sent();
                    current_intervals.set(trip_id, new_interval);
                    return [2 /*return*/];
            }
        });
    }); });
};
var handleCallcenterFindTrip = function (socket) {
    socket.on('callcenter-find-trip', function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var trip_id, place1, DataResponse, DataResponseStringified, possibleDrivers, i, new_interval;
        return __generator(this, function (_a) {
            trip_id = data.trip_id;
            place1 = data.start;
            DataResponse = {
                trip_info: data
            };
            DataResponseStringified = JSON.stringify(DataResponse);
            possibleDrivers = locationService_1["default"].findPossibleDriver(drivers, place1);
            broadCastToDriver(possibleDrivers[0][1].socket, "user-trip", DataResponseStringified);
            console.log("broadcasting to driver ".concat(possibleDrivers[0]));
            i = 1;
            new_interval = setInterval(function () {
                //
                broadCastToDriver(possibleDrivers[i][1].socket, "user-trip", DataResponseStringified);
                console.log("broadcasting to driver ".concat(possibleDrivers[i]));
                i++;
                if (i >= possibleDrivers.length) {
                    setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var dat;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    dat = {
                                        trip_id: trip_id,
                                        status: "Waiting"
                                    };
                                    return [4 /*yield*/, tripService_1["default"].UpdateTrip(dat)];
                                case 1:
                                    _a.sent();
                                    clearInterval(new_interval);
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 15000);
                    //notify user that no driver has been found
                }
            }, 15000);
            return [2 /*return*/];
        });
    }); });
};
var handleDriverResponseBooking = function (io, socket) {
    socket.on('driver-response-booking', function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var driver, driver_id, trip_id, driverData, responseData, stringifiedResponse, updatedTrip;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    driver = getDriverBySocket(socket);
                    driver_id = driver === null || driver === void 0 ? void 0 : driver.user_id;
                    trip_id = data.trip_id;
                    if (data.status == 'Deny')
                        return [2 /*return*/];
                    return [4 /*yield*/, driverServices_1["default"].GetDriverInfoById(driver_id)];
                case 1:
                    driverData = _a.sent();
                    responseData = {
                        trip_id: trip_id,
                        driver_info: driverData,
                        message: "found driver"
                    };
                    stringifiedResponse = JSON.stringify(responseData);
                    io.to("/trip/".concat(trip_id)).emit('found-driver', stringifiedResponse);
                    socket.join("/trip/".concat(trip_id));
                    updatedTrip = trips.get(trip_id);
                    updatedTrip.driver_id = driver_id;
                    if (updatedTrip === undefined)
                        return [2 /*return*/];
                    trips.set(trip_id, updatedTrip);
                    clearInterval(current_intervals.get(trip_id));
                    current_intervals["delete"](trip_id);
                    return [2 /*return*/];
            }
        });
    }); });
};
var handleLocationUpdate = function (socket) {
    socket.on('driver-location-update', function (data) {
        var driver = getDriverBySocket(socket);
        var driver_id = driver === null || driver === void 0 ? void 0 : driver.user_id;
        if (driver_id == undefined)
            return;
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
var broadCastToUser = function (socket, event, data) {
    var socket_value = users.get(socket.id) || undefined;
    if (socket_value === undefined) {
        return;
    }
    // console.log(socket_value.socket)
    if (socket_value === null) {
        throw new Error("user socket error");
    }
    socket_value.socket.emit(event, data);
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
var broadCastToDriver = function (socket, event, data) {
    var socket_value = drivers.get(socket.id) || undefined;
    if (socket_value === undefined) {
        return;
    }
    if (socket_value === null) {
        throw new Error("driver socket error");
    }
    socket_value.socket.emit(event, data);
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
var test = function () {
    console.log(1);
};
exports["default"] = {
    runSocketService: runSocketService,
    GetDriversAround3KM: GetDriversAround3KM,
    test: test
};
