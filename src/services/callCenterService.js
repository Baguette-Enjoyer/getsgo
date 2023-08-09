import db from '../models/index'
const { Op } = require("sequelize");

export const GetRunningTrips = async () => {
    const res = db.Trip.findAll({
        where: {
            status: {
                [Op.ne]: ["Cancelled", "Done"]
            }
        }
    })
    if (res) {
        res.forEach(t => {
            t.start = JSON.parse(t.start)
            t.end = JSON.parse(t.end)
        })
        return res
    }
    return []
}