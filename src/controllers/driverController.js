import driverServices from "../services/driverServices";

let GetDriverInfoById = async (req, res) => {
    let driver_id = req.params.driver_id;
    try {
        let driver = await driverServices.GetDriverInfoById(driver_id);
        return res.status(200).json({
            statusCode: 200,
            driver,
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: error.message,
        })
        throw error
    }
}

let GetProfitPlusTrip = async (req, res) => {
    let driver_id = req.params.driver_id;
    let type = req.query["type"];
    let trips = await driverServices.GetProfitPlusTrip(driver_id, type);
    return res.status(200).json({
        trips: trips
    })
}
export default {
    GetDriverInfoById,
    GetProfitPlusTrip
}