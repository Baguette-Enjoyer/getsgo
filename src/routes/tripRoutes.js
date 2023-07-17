import express from "express"
import tripController from "../controllers/tripController"
import authMiddleware from "../middleware/authMiddleware"
const Routes = express.Router()

const initTripRoutes = (app) =>{
    Routes.use(authMiddleware.AuthMiddleware)
    Routes.post('/v1/booking/users',tripController.BookTrip)
    Routes.get('/v1/drivers/trips',tripController.GetTrips)
    
    // Routes.get('/random',userControllers.AddRandomUser)
    
    app.use(Routes)
    return app 
}

export default initTripRoutes;