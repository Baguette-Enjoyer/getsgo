import tripService from "../services/tripService";

let BookTrip = async (req,res) =>{
    let data = req.body
    let credential = JSON.parse(req.decodedToken)
    console.log(credential)
    let user_id = credential.id
    data.user_id = user_id
    let result = await tripService.CreateTrip(data)
    if (result.statusCode == 500){
        return res.status(500).json({
            statusCode:500,
            error:result.error,
        })
    }
    return res.status(200).json({
        statusCode:200,
        trip_info:result,
    })
}

let GetTrips = async (req,res)=>{
    let credential = JSON.parse(req.decodedToken)
    if (credential.type == "User" || credential.type == "User_vip"){
        return res.status(500).json({
            statusCode:500,
            error:"not authorized",
        })
    }
    let result = await tripService.GetAvailableTrip()
    return res.status(200).json({
        statusCode:200,
        trips: result
    })
}
export default {
    BookTrip,
    GetTrips
}