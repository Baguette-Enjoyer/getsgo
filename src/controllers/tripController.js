import tripService from "../services/tripService";
import { initTripCallCenterS1, initTripForCallcenter, initTripCallCenterS2, GetTripS2, GetTripS3 } from '../services/tripService'
let BookTrip = async (req, res) => {

    let data = req.body
    // console.log(req.body)
    let credential = JSON.parse(req.decodedToken)
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
        return res.status(404).json({
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
    // let trip_id = await tripService.GetTripById(req.params.trip_id)
    // console.log(trip_id)
    let trip_id = req.params.trip_id
    try {
        let trip = await tripService.GetTripById(trip_id)
        return res.status(200).json({
            statusCode: 200,
            trip: trip
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 404,
            error: error.message,
        })
    }
}

let AcceptTrip = async (req, res) => {
    let credential = JSON.parse(req.decodedToken)
    if (credential.type == "User" || credential.type == "User_vip") {
        return res.status(500).json({
            statusCode: 404,
            error: "not authorized",
        })
    }
    let driver_id = credential.id
    let trip_id = req.params.trip_id
    try {
        let trip = await tripService.AcceptTrip({ trip_id, driver_id })
        res.status(200).json({ statusCode: 200, trip })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            error: error.message
        })
    }
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
            error: error.message,
        })
    }

}

let CancelTrip = async (req, res) => {
    let trip_id = req.params.trip_id
    let credential = JSON.parse(req.decodedToken)
    try {
        await tripService.CancelTrip(trip_id)
        res.status(200).json({
            statusCode: 200,
            message: "trip cancelled",
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            error: error.message,
        })
    }
}

let DeleteTrip = async (req, res) => {
    let trip_id = req.params.trip_id;
    try {
        await tripService.DeleteTrip(trip_id)
        return res.status(200).json({
            statusCode: 200,
            message: 'trip deleted'
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            error: error.message
        })
    }
}

export const BookCallCenter = async (req, res) => {
    const data = req.body
    try {
        const result = await initTripForCallcenter(data)
        return res.status(200).json({
            "statusCode": 200,
            "trip_info": result
        })
    } catch (error) {
        return res.status(500).json({
            "statusCode": 500,
            "message": error.message
        })
    }
}

export const BookS1 = async (req, res) => {
    const data = req.body
    try {
        const result = await initTripCallCenterS1(data)
        return res.status(200).json({
            "statusCode": 200,
            "trip_info": result
        })
    } catch (error) {
        return res.status(500).json({
            "statusCode": 500,
            "message": error.message
        })
    }
}

export const BookS2 = async (req, res) => {
    const data = req.body
    try {
        const result = await initTripCallCenterS2(data)
        return res.status(200).json({
            "statusCode": 200,
            "trip_info": result
        })
    } catch (error) {
        return res.status(500).json({
            "statusCode": 500,
            "message": error.message
        })
    }

}

export const GetTripForS2 = async (req, res) => {
    const data = await GetTripS2()
    return res.status(200).json({
        statusCode: 200,
        trips: data
    })
}

export const GetTripForS3 = async (req, res) => {
    const result = await GetTripForS3()
    return res.status(200).json({
        statusCode: 200,
        trips: result
    })
}
export default {
    BookTrip,
    CallCenterBookTrip,
    GetTrips,
    GetTripById,
    AcceptTrip,
    UpdateTrip,
    CancelTrip,
    DeleteTrip,
    BookS1,
    BookS2,
    BookCallCenter,
    GetTripForS2,
    GetTripForS3,
}