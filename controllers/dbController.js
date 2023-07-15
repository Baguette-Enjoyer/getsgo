import db from '../models/index'

let initTable = async (req, res) => {
    // console.log(db.sequelize)
    await db.sequelize.sync({
        force: true,
        logging: false
    }).then(() => {
        res.send("Success!")
    })
}

module.exports = {
    initTable
}