import express from "express"
import userControllers from "../controllers/userControllers"
import driverController from "../controllers/driverController"
// import historyController from "../controllers/historyController"
const Routes = express.Router()

const initUserRoutes = (app) => {
    Routes.post('/v1/users/login', userControllers.LoginUser)
    Routes.post('/v1/users/signup', userControllers.RegisterUser)
    // Routes.get('/random',userControllers.AddRandomUser)
    // Routes.get('v1/users/:user_id', userControllers.GetUserById)
    Routes.put('/v1/users/updatepassword', userControllers.UpdatePassword)
    Routes.get('/v1/phone', userControllers.GetUserByPhone)
    Routes.get('/v1/driver/:driver_id', driverController.GetDriverInfoById)
    // Routes.get('/v1/history/driver/:driver_id', driverController.GetProfitPlusTrip)
    // Routes.get('/v1/history/user/:user_id', historyController.GetHistoryOfUser)
    // Routes.get('/v1/history/phone', userControllers.GetHistoryByPhone)
    // Routes.post('/v1/location/localdriver', userControllers.GetDriverAround3KM)
    return app.use(Routes)
}

export default initUserRoutes;