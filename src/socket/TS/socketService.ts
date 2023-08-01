import { io } from '../../services/initServer'
import { handleUserLogin, handleUserFindTrip, handleUserCancelTrip } from './userSocket'
import { getCurrentDriverInfoById, handleDriverLogin, handleDriverResponseBooking, handleLocationUpdate } from './driverSocket'
import { Socket } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import { DriverMap, TripMap, UserMap } from './storage'
import locationServices from '../../services/locationService'

export const runSocketService = () => {
    initSocket()
    initSocketService()
    console.log("socket service running")
}

const initSocket = () => {
    io.on('connection', (socket) => {
        console.log("socket " + socket.id + " connected")
        handleUserLogin(socket)
        handleDriverLogin(socket)
        handleUserFindTrip(socket)
        //handleCallcenterFindTrip(socket)
        handleDriverResponseBooking(socket)
        handleLocationUpdate(socket)
        handleDisconnect(socket)
    })
}

const initSocketService = () => {
    updateLocationLoop()
}

const updateLocationLoop = () => {
    TripMap.getMap().forEach((trip_value, trip_id) => {
        const driver_id = trip_value.driver_id
        if (driver_id === undefined) return
        // let socketDriver = GetSocketByDriverId(driver_id)
        const driver_info = getCurrentDriverInfoById(driver_id)
        const stringifiedResponse = JSON.stringify(driver_info)
        io.in(`/user/${trip_value.user_id}`).emit('location-update', stringifiedResponse)
    })
    setTimeout(() => updateLocationLoop(), 60000)
}

const handleDisconnect = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('disconnect', () => {
        if (UserMap.getMap().get(socket.id)) {
            UserMap.getMap().delete(socket.id)
        }
        else {
            DriverMap.getMap().delete(socket.id)
        }
        // users.delete(socket.id)
        console.log("client disconnected " + socket.id)
    })
}

export const GetDriversAround3KM = (data: { lat: number, lng: number }) => {
    const lat1 = data.lat;
    const lng1 = data.lng;
    const posDrivers: { lat: number, lng: number }[] = []
    // for (const [driver_id,driver_value] of drivers) {
    //     if (locationServices.getDistance(lat1,lng1,driver_value.lat,driver_value.lng) <= 3){
    //         posDrivers.push({lat:driver_value.lat,lng:driver_value.lng})
    //     }
    // }
    DriverMap.getMap().forEach((driver_value, driver_id) => {
        if (locationServices.getDistance(lat1, lng1, driver_value.lat, driver_value.lng) <= 3) {
            posDrivers.push({ lat: driver_value.lat, lng: driver_value.lng })
        }
    })
    return posDrivers
}