import historyService from "../services/historyService";

const GetHistoryOfUser = async (req, res) => {
    const trips = await historyService.GetHistoryOfUser(req.params.user_id)
    return res.status(200).json({ trip: trips })
}
export default {
    GetHistoryOfUser
}