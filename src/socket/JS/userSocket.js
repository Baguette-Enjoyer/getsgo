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
exports.handleUserCancelTrip = exports.handleUserFindTrip = exports.handleUserLogin = void 0;
const initServer_1 = require("../../services/initServer");
const userService_1 = __importDefault(require("../../services/userService"));
const locationService_1 = __importDefault(require("../../services/locationService"));
const storage_1 = require("./storage");
const connectRedis_1 = __importDefault(require("../../config/connectRedis"));
let rd = (0, connectRedis_1.default)();
const io2 = initServer_1.io;
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
const handleUserFindTrip = (socket) => {
    socket.on('user-find-trip', (data) => __awaiter(void 0, void 0, void 0, function* () {
        // const dat: TripValue = JSON.parse(data)
        const trip_id = data.trip_id;
        const place1 = data.start;
        // let user = getUserBySocket(socket)
        // let user_id = user?.user_id
        let userData = yield userService_1.default.GetUserById(data.user_id);
        storage_1.TripMap.getMap().set(data.trip_id, data);
        let DataResponse = {
            user_info: userData,
            trip_info: data
        };
        let DataResponseStringified = JSON.stringify(DataResponse);
        while (true) {
            const possibleDrivers = locationService_1.default.requestRide(storage_1.DriverMap.getMap(), place1, storage_1.DriverInBroadcast.getDriverInBroadcast());
            console.log(possibleDrivers.length);
            for (let i = 0; i < possibleDrivers.length; i++) {
                console.log('driver');
                console.log(DataResponseStringified);
                const driver = possibleDrivers[i];
                console.log(driver.socketId);
                AddDriverToBroadCast(driver.user_id);
                //
                broadCastToDriver(driver.socketId, "user-trip", DataResponseStringified);
            }
            yield new Promise((resolve) => setTimeout(resolve, 11000));
            const trip = storage_1.TripMap.getMap().get(trip_id);
            console.log('11111111111');
            console.log(trip);
            if (trip !== undefined && trip.driver_id !== undefined) {
                break;
            }
        }
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
        let rdTripKey = `trip_id:${trip_id}`;
        storage_1.TripMap.getMap().set(trip_id, data);
        let TripDataStringified = JSON.stringify(data);
        yield rd.set(rdTripKey, TripDataStringified);
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
    });
};
exports.handleUserCancelTrip = handleUserCancelTrip;
// export const UserGetLocationDriver = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
//     socket.on('user-cancel-trip', (data: { trip_id: number }) => {
//         UserCancelTrip(data.trip_id)
//     })
// }
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
const broadCastToDriver = (socketid, event, data) => {
    let socket_value = storage_1.DriverMap.getMap().get(socketid) || undefined;
    if (socket_value === undefined) {
        return;
    }
    if (socket_value === null) {
        throw new Error("driver socket error");
    }
    let driver_id = socket_value.user_id;
    console.log('/driver/${driver_id}');
    initServer_1.io.in(`/driver/${driver_id}`).emit(event, data);
};
const AddDriverToBroadCast = (driver_id) => {
    storage_1.DriverInBroadcast.getDriverInBroadcast().push(driver_id);
    setTimeout(() => {
        const index = storage_1.DriverInBroadcast.getDriverInBroadcast().indexOf(driver_id);
        if (index !== -1) {
            storage_1.DriverInBroadcast.getDriverInBroadcast().splice(index, 1);
        }
    }, 15000);
};
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
