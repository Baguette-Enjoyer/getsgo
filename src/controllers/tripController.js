import tripService from "../services/tripService";

let BookTrip = async (req, res) => {
    let data = req.body
    let credential = JSON.parse(req.decodedToken)
    console.log(credential)
    let user_id = credential.id
    data.user_id = user_id
    let result = await tripService.CreateTrip(data)
    if (result.statusCode == 500) {
        return res.status(500).json(result)
    }
    return res.status(200).json(result)
}

let CallCenterBookTrip = async (req, res) => {
    let data = req.body
    let result = await tripService.CreateTripForCallCenter(data)
    if (result.statusCode == 500) {
        return res.status(500).json(result)
    }
    return res.status(200).json(result)
}

let GetTrips = async (req, res) => {
    let credential = JSON.parse(req.decodedToken)
    if (credential.type == "User" || credential.type == "User_vip") {
        return res.status(500).json({
            statusCode: 500,
            error: "not authorized",
        })
    }
    let result = await tripService.GetAvailableTrip()
    return res.status(200).json({
        statusCode: 200,
        trips: result
    })
}

let GetTripById = async (req, res) => {
    let trip_id = await tripService.GetTripById(req.params.trip_id)
    // console.log(trip_id)
    let trip = await tripService.GetTripById(trip_id)
    return res.status(200).json({
        statusCode: 200,
        trip: trip,
    }
    )
}

let UpdateTrip = async (req, res) => {
    let data = req.body
    data.trip_id = req.params.trip_id
    try {
        let result = await tripService.UpdateTrip(data)
        return res.status(200).json(result)

    } catch (error) {
        return res.status(400).json({
            statusCode: 400,
            error: error,
        })
    }

}
export default {
    BookTrip,
    CallCenterBookTrip,
    GetTrips,
    GetTripById,
    UpdateTrip
}