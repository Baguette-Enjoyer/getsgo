import historyService from "../services/historyService";

let GetHistoryOfUser = async (req, res) => {
    let trips = await historyService.GetHistoryOfUser(req.params.user_id)
    return res.status(200).json({ trip: trips })
}
export default {
    GetHistoryOfUser
}