import driverServices from "../services/driverServices";

const GetDriverInfoById = async (req, res) => {
    const driver_id = req.params.driver_id;
    try {
        const driver = await driverServices.GetDriverInfoById(driver_id);
        return res.status(200).json({
            statusCode: 200,
            driver,
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 404,
            message: error.message,
        })
        throw error
    }
}

const GetProfitPlusTrip = async (req, res) => {
    const driver_id = req.params.driver_id;
    const type = req.query["type"];
    const trips = await driverServices.GetProfitPlusTrip(driver_id, type);
    return res.status(200).json({
        trips: trips
    })
}
export default {
    GetDriverInfoById,
    GetProfitPlusTrip
}