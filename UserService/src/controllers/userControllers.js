import jwtService from '../services/jwtService'
import userService from '../services/userService'
// import { GetHistoryOfUserByPhone } from '../services/historyService'
// import socketService from '../socket/socketServiceTS'
// import { GetDriversAround3KM } from '../socket/JS/socketService'
let LoginUser = async (req, res) => {
    let data = req.body
    try {
        let result = await userService.LoginUser(data)
        // let phone = result["user_info"].phone
        // let type = result["user_info"].type
        // let user_id = result["user_info"].user_id
        // let accessToken = result["user_info"].accessToken
        return res.status(200).json({
            statusCode: 200,
            user_info: result
        })
    } catch (err) {
        return res.status(500).json({
            statusCode: 500,
            error: err.message
        })

    }
}

let RegisterUser = async (req, res) => {
    // console.log(req.body)
    let data = req.body
    let phone = req.body.phone.trim()
    if (phone.length != 12) {
        return res.status(500).json({
            statusCode: 500,
            error: "Invalid phone number"
        })
    }
    try {
        let result = await userService.RegisterUser(data)
        res.status(200).json(result)
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
    try {
        let result = await userService.GetUserByPhone(phoneNormalized)
        return res.status(200).json({
            statusCode: 200,
            user_info: result,
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            error: error.message,
        })
    }
    // if (result == null) {
    //     return res.status(404).json({
    //         statusCode: 404,
    //         message: "User not found"
    //     })
    // }

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

// const GetHistoryByPhone = async (req, res) => {
//     const phone = req.query.phone
//     const phoneNormalized = '+' + phone.trim();
//     if (phoneNormalized.length != 12) {
//         return res.status(500).json({
//             statusCode: 500,
//             message: "Invalid phone number"
//         })
//     }
//     try {
//         const result = await GetHistoryOfUserByPhone(phoneNormalized)
//         return res.status(200).json(
//             {
//                 statusCode: 200,
//                 trips: result
//             }
//         )
//     } catch (error) {
//         return res.status(500).json({
//             statusCode: 500,
//             message: error.message
//         })
//     }

// }

// let GetDriverAround3KM = async (req, res) => {
//     let dat = req.body
//     let result = GetDriversAround3KM(dat)
//     let randomGeometer = []
//     for (let i = 0; i < 10; i++) {
//         randomGeometer.push(
//             {
//                 lat: Math.random() * 100,
//                 lng: Math.random() * 100,
//             }
//         )
//     }
//     res.status(200).json({ drivers: result, random: randomGeometer })
// }
export default {
    RegisterUser,
    LoginUser,
    UpdatePassword,
    GetUserByPhone,
    // GetDriverAround3KM,
    // GetHistoryByPhone
}