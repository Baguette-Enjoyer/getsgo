import jwtService from "../services/jwtService"
import firebaseService from "../services/firebaseService"

let AuthMiddleware = async (req, res, next) => {
    let authHeader = req.headers['authorization']
    let tk = authHeader && authHeader.split(' ')[1]
    if (!tk) {
        return res.status(402).json({
            statusCode: 402,
            message: "token missing or something went wrong"
        })
    }
    let result = await jwtService.VerifyToken(tk)
    if (result.result == false) {
        return res.status(502).json({
            statusCode: 502,
            message: result.message,

        })
    }
    // console.log(result.decoded)
    req.decodedToken = JSON.stringify(result.decoded);
    next();
}

let AdminAuthMiddleware = async (req, res, next) => {
    let authHeader = req.headers['authorization']
    let tk = authHeader && authHeader.split(' ')[1]
    if (!tk) {
        return res.status(402).json({
            statusCode: 402,
            message: "token missing or something went wrong"
        })
    }
    let result = await jwtService.VerifyToken(tk)
    if (result.result == false) {
        return res.status(502).json({
            statusCode: 502,
            message: result.message,
        })
    }
    if (result.decoded.type != "Admin") {
        return res.status(502).json({
            statusCode: 502,
            message: "user not authenticated",
        })
    }
    req.decodedToken = result.decoded
    next();

}



let UserCredentialMiddleware = (req, res, next) => {
    let authHeader = req.headers['authorization']
    let token = authHeader && authHeader.split(' ')[1]
    let credential = firebaseService.decodeFirebaseToken(token)
    let user_id = credential.phone_number


}

export default {
    AuthMiddleware,
    AdminAuthMiddleware,
}