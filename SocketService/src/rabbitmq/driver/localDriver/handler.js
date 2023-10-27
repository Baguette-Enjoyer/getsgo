import { DriverMap } from '../../'
import locationService from '../../../service/locationService';

export const GetDriversAround3KM = (data) => {
    const lat1 = data.lat;
    const lng1 = data.lng;
    const posDrivers = []

    for (const [driver_id, driver_data] of DriverMap.getMap()) {
        if (locationService.getDistance(lat1, lng1, driver_data.lat, driver_data.lng) <= 3) {
            posDrivers.push({ driver_id: driver_id, lat: driver_data.lat, lng: driver_data.lng })
        }
    }
    return posDrivers
}

export const handle = async (data, correlationId, replyTo) => {
    const posDriver = GetDriversAround3KM(data)
    await LocalDriverClient.produce(posDriver, correlationId, replyTo)
}