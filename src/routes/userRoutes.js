import express from "express"
import userControllers from "../controllers/userControllers"
const Routes = express.Router()

const initUserRoutes = (app) => {
    Routes.post('/v1/users/login', userControllers.LoginUser)
    Routes.post('/v1/users/signup', userControllers.RegisterUser)
    // Routes.get('/random',userControllers.AddRandomUser)
    Routes.get('v1/phone', userControllers.GetUserByPhone)
    return app.use(Routes)
}

export default initUserRoutes;