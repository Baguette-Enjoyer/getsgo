import { io } from "../service/initServer"
import { handleUserLogin, handleUserFindTrip, handleUserCancelTrip, handleMessageFromDriver, handleTripUpdate, handleCallCenterLogin } from './userSocket'
import { getCurrentDriverInfoById, handleDriverLogin, handleDriverResponseBooking, handleLocationUpdate, handleMessageFromUser } from './driverSocket'
import { DriverMap, TripMap, UserMap } from './storage'


export const runSocketService = () => {
    // io.use(authSocket)
    initSocket()
    // initSocketService()
    console.log("socket service running")
}

const initSocket = () => {
    io.on('connection', (socket) => {
        socket.emit('test', 'oke nha')
        console.log("socket " + socket.id + " connected")
        handleUserLogin(socket)
        handleDriverLogin(socket)
        handleCallCenterLogin(socket)
        handleUserFindTrip(socket)
        handleTripUpdate(socket)
        handleUserCancelTrip(socket)
        //handleCallcenterFindTrip(socket)
        handleDriverResponseBooking(socket)
        handleLocationUpdate(socket)
        handleMessageFromUser(socket)
        handleMessageFromDriver(socket)
        handleDisconnect(socket)
    })
}


const handleDisconnect = (socket) => {
    socket.on('disconnect', () => {
        if (UserMap.getMap().get(socket.id)) {
            UserMap.getMap().delete(socket.id)
        }
        else {
            const driverDat = DriverMap.getMap().get(socket.id)
            if (driverDat) {
                console.log(driverDat.client_id);
                console.log('thằng này driver nè');
                if (driverDat != undefined) {
                    if (driverDat.client_id != undefined) {
                        driverDat.status = "Reconnecting"
                        DriverMap.getMap().set(driverDat.user_id.toString(), driverDat)
                        DriverMap.getMap().delete(socket.id)
                    }
                    else DriverMap.getMap().delete(socket.id)
                }

            }
        }
        // users.delete(socket.id)
        console.log("client disconnected " + socket.id)
    })
}
