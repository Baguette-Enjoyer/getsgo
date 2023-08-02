
function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Bán kính Trái Đất trong km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function toRad(value) {
    return value * Math.PI / 180;
}

const findPossibleDriver = (drivers, place) => {
    let lat = place.lat;
    let lng = place.lng;
    let possibleDriver = Array.from(drivers)
    possibleDriver.sort((a, b) => {
        if (a.status == 'idle' && b.status != 'idle') {
            return 1
        }
        // else if (b.status == 'idle' && a.status != 'idle') {
        //     return -1
        // }
        if (getDistance(a[1].lat, a[1].lng, lat, lng) > getDistance(b[1].lat, b[1].lng, lat, lng)) {
            return 1
        } else {
            return -1;
        }
    })
    return possibleDriver
}

const getFiveNearestDriver = (drivers, targetLocation, driversInBroadcast) => {
    console.log(targetLocation)
    const targetLat = parseInt(targetLocation.lat)
    const targetLng = parseInt(targetLocation.lng)

    const idleDriversWithDistance = Array.from(drivers.entries()).map(([socketId, { lat, lng, user_id, status }]) => ({
        socketId,
        lat,
        lng,
        user_id,
        status,
        distance: getDistance(lat, lng, targetLat, targetLng),
    })).filter(driver => driver.status === 'Idle' && driversInBroadcast.includes(driver.user_id) == false);

    idleDriversWithDistance.sort((a, b) => a.distance - b.distance);
    // console.log(idleDriversWithDistance);
    const maxFiveIdleDrivers = idleDriversWithDistance.slice(0, 5);

    return maxFiveIdleDrivers;
}


export default {
    getDistance,
    toRad,
    findPossibleDriver,
    getFiveNearestDriver
}