import getRoute from './ggMapService.js'

async function get(lat1, lng1, lat2, lng2) {
    let res = await getRoute(lat1, lng1, lat2, lng2)
    console.log(res)
}

get(40.712776, -74.005974, 34.052235, -118.243683)