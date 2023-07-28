import jwtService from '../services/jwtService'
import userService from '../services/userService'
import socketService from '../socket/socketServiceTS'

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
    let phone = req.query.phone
    let phoneNormalized = '+' + phone.trim();
    if (phoneNormalized.length != 12) {
        return res.status(500).json({
            statusCode: 500,
            message: "Invalid phone number"
        })
    }
    let result = await userService.GetUserByPhone(phoneNormalized)
    // if (result == null) {
    //     return res.status(404).json({
    //         statusCode: 404,
    //         message: "User not found"
    //     })
    // }
    if (result.error == 'Require Register') {
        return res.status(500).json({
            statusCode: 500,
            message: "Require Register"
        })
    }
    if (result.error == 'Phone Number Not Found') {
        return res.status(500).json({
            statusCode: 500,
            message: "Phone Number Not Found"
        })
    }

    return res.status(200).json({
        statusCode: 200,
        user_info: result,
    })
}

let UpdatePassword = async (req, res) => {
    let data = req.body
    try {
        let result = await userService.UpdatePassword(data)
        res.status(200).json({
            statusCode: 200,
            user_info: result
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            error: error,
        })
    }
}

let UpdateUserInfo = async (data) => {
    return new Promise((resolve, reject) => {
        let updateObj = {}

        if (data.name != null) {
            updateObj.name = data.name
        }
        if (data.avatar != null) {
            updateObj.avatar = data.avatar
        }
        if (data.email != null) {
            updateObj.email = data.email
        }

    })
}

let GetDriverAround3KM = async (req, res) => {
    let dat = req.body
    let result = socketService.GetDriversAround3KM(dat)
    let randomGeometer = []
    for (let i = 0; i < 10; i++) {
        randomGeometer.push(
            {
                lat: Math.random() * 100,
                lng: Math.random() * 100,
            }
        )
    }
    res.status(200).json({ drivers: result, random: randomGeometer })
}
export default {
    RegisterUser,
    LoginUser,
    UpdatePassword,
    GetUserByPhone,
    GetDriverAround3KM
}