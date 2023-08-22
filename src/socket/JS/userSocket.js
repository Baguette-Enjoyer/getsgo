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
exports.AddDriverToBroadCast = exports.broadCastToDriver = exports.handleTripUpdate = exports.handleMessageFromDriver = exports.handleUserCancelTrip = exports.handleUserFindTrip = exports.handleCallCenterLogin = exports.sendMessageToS3 = exports.sendMessageToS2 = exports.handleUserLogin = void 0;
const initServer_1 = require("../../services/initServer");
const storage_1 = require("./storage");
const tripService_1 = __importDefault(require("../../services/tripService"));
const connectRedis_1 = __importDefault(require("../../config/connectRedis"));
let rd = (0, connectRedis_1.default)();
// const users = new Map<string, User>()
const handleUserLogin = (socket) => {
    socket.on('user-login', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const user_id = data.user_id;
        socket.join(`/user/${user_id}`);
        storage_1.UserMap.getMap().set(socket.id, {
            user_id: user_id,
        });
    }));
};
exports.handleUserLogin = handleUserLogin;
const sendMessageToS2 = (data) => {
    initServer_1.io.in("callcenter").emit("s2-update-trip", data);
};
exports.sendMessageToS2 = sendMessageToS2;
const sendMessageToS3 = (data) => {
    initServer_1.io.in("callcenter").emit("s3-update-trip", data);
};
exports.sendMessageToS3 = sendMessageToS3;
const handleCallCenterLogin = (socket) => {
    socket.on('callcenter-login', () => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(`callcenter`);
        const data = yield tripService_1.default.GetTripS2();
        initServer_1.io.in("callcenter").emit("s2-trip", data);
        const data2 = yield tripService_1.default.GetTripS3();
        initServer_1.io.in("callcenter").emit("s3-trip", data2);
    }));
};
exports.handleCallCenterLogin = handleCallCenterLogin;
const handleUserFindTrip = (socket) => {
    socket.on('user-find-trip', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("t chuyển này qua cái mq luôn r nha, có gì lỗi kiu t sửa");
        // const dat: TripValue = JSON.parse(data)
        // console.log(data);
        // const trip_id = data.trip_id
        // const place1 = data.start
        // // let user = getUserBySocket(socket)
        // // let user_id = user?.user_id
        // let userData = await userService.GetUserById(data.user_id)
        // TripMap.getMap().set(data.trip_id, data);
        // let DataResponse = {
        //     user_info: userData,
        //     trip_info: data
        // }
        // // let DataResponseStringified = JSON.stringify(DataResponse)
        // let timesUp = false
        // let loopsBroken = false
        // setTimeout(async () => {
        //     if (!loopsBroken) {
        //         timesUp = true
        //         io.in(`/user/${data.user_id}`).emit("no-driver-found", "no drivers have been found")
        //         await tripService.DeleteTrip(trip_id)
        //     }
        // }, 60000)
        // while (timesUp == false) {
        //     console.log(DriverMap.getMap());
        //     console.log('hehehhehe');
        //     const possibleDrivers = locationServices.requestRide(DriverMap.getMap(), place1, DriverInBroadcast.getDriverInBroadcast())
        //     console.log(possibleDrivers);
        //     for (let i = 0; i < possibleDrivers.length; i++) {
        //         console.log('driver');
        //         console.log(DataResponse);
        //         const driver = possibleDrivers[i];
        //         console.log(driver.socketId)
        //         AddDriverToBroadCast(driver.user_id);
        //         //
        //         broadCastToDriver(driver.socketId, "user-trip", DataResponse);
        //     }
        //     await new Promise((resolve) => setTimeout(resolve, 11000));
        //     const trip = TripMap.getMap().get(trip_id);
        //     console.log('11111111111')
        //     console.log(trip)
        //     if (trip !== undefined && trip.driver_id !== undefined) {
        //         loopsBroken = true
        //         break;
        //     }
        // }
        // 1 phút không có emit (no-driver-found)
        // let possibleDrivers = locationServices.getFiveNearestDriver(DriverMap.getMap(), place1, DriverInBroadcast.getDriverInBroadcast())
        // console.log(possibleDrivers);
        // let isResponded = false
        // điều kiện thứ 1 thằng đó  k bosh
        // điều kiện rảnh
        // điều kiện phạm vị 3 km
        // điều kiện thứ 4 là đó nãy k hủy
        // 5 đứa đang trong vòng ưu điểm được gửi
        // 5 đứa k chấp nhận
        //tìm lại tròng phạm vi đó có bao nhiêu người => 5 đứa+ 1 đứa mới chạy xe vô
        // đứa lên đầu và 4 đứa còn lại // 5 đứa
        //long ======
        // for (let i = 0; i < possibleDrivers.length; i++) {
        //     console.log('driver');
        //     console.log(DataResponseStringified);
        //     const driver = possibleDrivers[i];
        //     AddDriverToBroadCast(driver.user_id);
        //     //
        //     broadCastToDriver(driver.socketId, "user-trip", DataResponseStringified);
        //     await new Promise((resolve) => setTimeout(resolve, 15000));
        //     // await delay(15000)
        //     let d = DriverMap.getMap().get(driver.socketId);
        //     if (TripMap.getMap().get(trip_id)?.status == 'Cancelled') {
        //         if (d?.hasResponded && d?.status == 'Accept') {
        //             broadCastToDriver(driver.socketId, 'trip-cancelled', "User has canceled")
        //         }
        //         await tripService.CancelTrip(trip_id)
        //         TripMap.getMap().delete(trip_id)
        //         break;
        //     }
        //     if (d?.hasResponded) {
        //         if (d.response == 'Accept') {
        //             isResponded = true
        //             await tripService.UpdateTrip({ trip_id: trip_id, status: "Confirmed", driver_id: driver.user_id })
        //             let driverData = await driverServices.GetDriverInfoById(driver.user_id);
        //             let responseData = {
        //                 trip_id: trip_id,
        //                 driver_info: driverData,
        //                 message: "found driver"
        //             }
        //             const stringifiedResponse = JSON.stringify(responseData);
        //             io.in(`/user/${data.user_id}`).emit('found-driver', stringifiedResponse)
        //             let newTrip = data
        //             newTrip.status = 'Confirmed'
        //             newTrip.driver_id = driver.user_id
        //             TripMap.getMap().set(trip_id, newTrip)
        //             // khi driver chấp nhận thì set lại client_id cho tài xế đó
        //             d.client_id = data.user_id
        //             DriverMap.getMap().set(driver.socketId, d)
        //             isResponded = true
        //             break
        //             //handle
        //         } else if (d.response == 'Deny') {
        //             continue;
        //         }
        //     } else {
        //         console.log('ko vô');
        //     }
        // }
        // if (isResponded == false) {
        //     let dat = {
        //         trip_id,
        //         status: "Waiting"
        //     }
        //     //
        //     await tripService.UpdateTrip(dat)
        // }
        // let rdTripKey = `trip_id:${trip_id}`
        // TripMap.getMap().set(trip_id, data)
        // let TripDataStringified = JSON.stringify(data)
        // await rd.set(rdTripKey, TripDataStringified)
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
        //         i++
        //     }
        // }, 15000)
        // current_intervals.set(trip_id, new_interval)
    }));
};
exports.handleUserFindTrip = handleUserFindTrip;
const handleUserCancelTrip = (socket) => {
    socket.on('user-cancel-trip', (data) => {
        UserCancelTrip(data.trip_id);
        const tripDat = storage_1.TripMap.getMap().get(data.trip_id);
        const driver_id = tripDat === null || tripDat === void 0 ? void 0 : tripDat.driver_id;
        const socketid = GetDriverInfoById(driver_id);
        if (socketid === null) {
            return;
        }
        const driverData = storage_1.DriverMap.getMap().get(socketid);
        if (driverData === undefined) {
            return;
        }
        driverData.status = "Idle";
        driverData.client_id = undefined;
        storage_1.DriverMap.getMap().set(socketid, driverData);
    });
};
exports.handleUserCancelTrip = handleUserCancelTrip;
const handleMessageFromDriver = (socket) => {
    socket.on("driver-message", (data) => {
        socket.to(`/user/${data.user_id}`).emit("message-to-user", data.message);
    });
};
exports.handleMessageFromDriver = handleMessageFromDriver;
// export const UserGetLocationDriver = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
//     socket.on('user-cancel-trip', (data: { trip_id: number }) => {
//         UserCancelTrip(data.trip_id)
//     })
// }
const handleTripUpdate = (socket) => {
    socket.on('trip-update', (data) => {
        const trip = storage_1.TripMap.getMap().get(data.trip_id);
        if (data.status === "Done") {
            const tripDat = storage_1.TripMap.getMap().get(data.trip_id);
            const driver_id = tripDat === null || tripDat === void 0 ? void 0 : tripDat.driver_id;
            const socketid = GetDriverInfoById(driver_id);
            if (socketid === null) {
                return;
            }
            const driverData = storage_1.DriverMap.getMap().get(socketid);
            if (driverData === undefined) {
                return;
            }
            driverData.status = "Idle";
            driverData.client_id = undefined;
            storage_1.DriverMap.getMap().set(socketid, driverData);
            if (data.status != null && trip != null) {
                trip.status = data.status;
                storage_1.TripMap.getMap().set(trip.trip_id, trip);
                initServer_1.io.in(`/user/${trip.user_id}`).emit('trip-update', { status: trip.status });
                initServer_1.io.in("callcenter").emit('trip-update', { status: trip.status, trip_id: data.trip_id });
            }
        }
        else if (data.status != null && trip != null) {
            trip.status = data.status;
            storage_1.TripMap.getMap().set(trip.trip_id, trip);
            initServer_1.io.in(`/user/${trip.user_id}`).emit('trip-update', { status: trip.status });
            initServer_1.io.in("callcenter").emit('trip-update', { status: trip.status, trip_id: data.trip_id });
        }
    });
};
exports.handleTripUpdate = handleTripUpdate;
const getTripIfDisconnected = (id) => {
    storage_1.TripMap.getMap().forEach((trip_value, trip_id) => {
        if (trip_value.user_id == id || trip_value.driver_id == id) {
            return trip_id;
        }
    });
    return null;
};
const GetSocketByUserId = (user_id) => {
    let socketArr = [];
    storage_1.UserMap.getMap().forEach((socket_value, socket_id) => {
        if (socket_value.user_id == user_id) {
            socketArr.push(socket_id);
        }
    });
    return socketArr;
};
const GetDriverInfoById = (driver_id) => {
    storage_1.DriverMap.getMap().forEach((driverData, socketId) => {
        if (driverData.user_id === driver_id) {
            return socketId;
        }
    });
    return null;
};
const broadCastToDriver = (socketid, event, data) => {
    let socket_value = storage_1.DriverMap.getMap().get(socketid) || undefined;
    if (socket_value === undefined) {
        return;
    }
    if (socket_value === null) {
        throw new Error("driver socket error");
    }
    let driver_id = socket_value.user_id;
    console.log(`/driver/${driver_id}`);
    initServer_1.io.in(`/driver/${driver_id}`).emit(event, data);
};
exports.broadCastToDriver = broadCastToDriver;
const AddDriverToBroadCast = (driver_id) => {
    // const socketid = GetDriverInfoById(driver_id) 
    // if (socketid === null) { return}
    // const driverData = DriverMap.getMap().get(socketid)
    // if (driverData === undefined) { return}
    // driverData.status = "Broadcasting"
    // DriverMap.getMap().set(socketid, driverData)
    storage_1.DriverInBroadcast.getDriverInBroadcast().push(driver_id);
    setTimeout(() => {
        const index = storage_1.DriverInBroadcast.getDriverInBroadcast().indexOf(driver_id);
        if (index !== -1) {
            storage_1.DriverInBroadcast.getDriverInBroadcast().splice(index, 1);
        }
        // const socketid = GetDriverInfoById(driver_id)
        // if (socketid === null) { return}
        // const driverData = DriverMap.getMap().get(socketid)
        // if (driverData === undefined) { return}
        // if (driverData.client_id == null) {
        //     driverData.status = "Idle"
        //     DriverMap.getMap().set(socketid, driverData)
        // }
    }, 15000);
};
exports.AddDriverToBroadCast = AddDriverToBroadCast;
const UserCancelTrip = (id) => {
    // if (status == undefined) return
    storage_1.TripMap.getMap().forEach((trip_value, trip_id) => {
        if (trip_id == id) {
            trip_value.status = "Cancelled";
            return;
        }
    });
};
const GetSocketInRoom = (id) => {
    const room = initServer_1.io.sockets.adapter.rooms.get("/users");
};
