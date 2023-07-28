import axios from "axios"

require('dotenv').config()

let GGMAP_KEY = process.env.GGMAP_KEY

interface Step {
    start_location: {
        lat:number,
        lng:number
    }
    end_location: {
        lat: number,
        lng: number
    }
    polyline: {
        points: string
    }
    travel_mode:string
}

interface Route {
    distance: number // meter
    duration: number // seconds
    start_address: string
    start_location: {
        lat: number
        lng: number
    }
    end_address: string
    end_location: {
        lat: number
        lng: number
    }
    steps: Step[];
}

let getRoute = async (lat1:number,lng1:number,lat2:number,lng2:number) => {
    let str = `https://maps.googleapis.com/maps/api/directions/json?origin=${lat1},${lng1}&destination=${lat2},${lng2}&key=${GGMAP_KEY}`
    let response = await fetch(str)
    let responseData = await response.json()
    let RouteDat:Route = {
        distance: responseData.routes[0].legs[0].distance.value,
        duration: responseData.routes[0].legs[0].duration.value,
        start_address: responseData.routes[0].legs[0].start_address,
        end_address: responseData.routes[0].legs[0].end_address,
        start_location: responseData.routes[0].legs[0].start_location,
        end_location: responseData.routes[0].legs[0].end_location,
        steps: []
    }
    let stepsData = responseData.routes[0].legs[0].steps;
    for(let i =0;i<stepsData.length;i++) {
        let x = stepsData[i]
        RouteDat.steps.push(
            {
                start_location: x.start_location,
                end_location: x.end_location,
                polyline: x.polyline,
                travel_mode: x.travel_mode,
            }
        )
    }
    return RouteDat
}

export default getRoute

