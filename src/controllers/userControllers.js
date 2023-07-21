import jwtService from '../services/jwtService'
import userService from '../services/userService'

let LoginUser = async (req, res) => {
    let data = req.body
    try {
        let result = await userService.LoginUser(data)
        if (result.statusCode == 500) {
            return res.status(500).json({
                statusCode: 500,
                message: result.message,
            })
        }
        let phone = result["user_info"].phone
        let type = result["user_info"].type
        let user_id = result["user_info"].user_id
        let accessToken = result["user_info"].accessToken
        return res.status(200).json({
            statusCode: 200,
            user_info: {
                user_id: user_id,
                phone: phone,
                type: type,
                accessToken: accessToken,
            }
        })
    } catch (err) {
        console.log(err)
        throw err;
    }
}

let RegisterUser = async (req, res) => {
    // console.log(req.body)
    let data = req.body
    try {
        let result = await userService.RegisterUser(data)
        if (result.statusCode == 400) {
            return res.status(400).json({
                statusCode: 400,
                error: result.message,
            })
        }
        else res.json(result)
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            error: error.message,
        })
    }


}

let GetUserByPhone = async (req, res) => {
    let data = req.query.phone
    let user = await userService.GetUserByPhone(data)
    if (user == null) {
        return res.status(404).json({
            statusCode: 404,
            message: "User not found"
        })
    }
    return res.status(200).json({
        statusCode: 200,
        user_info: user,
    })
}

let RegisterDriver = async (req, res) => {
    let data = req.body

}
export default {
    RegisterUser,
    LoginUser,
    GetUserByPhone
}