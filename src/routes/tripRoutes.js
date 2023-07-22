import express from "express"
import tripController from "../controllers/tripController"
import authMiddleware from "../middleware/authMiddleware"
const AuthRoutes = express.Router()
const Routes = express.Router()
const initTripRoutes = (app) => {
    AuthRoutes.use(authMiddleware.AuthMiddleware)
    AuthRoutes.post('/v1/booking/users', tripController.BookTrip)
    AuthRoutes.get('/v1/drivers/trips', tripController.GetTrips)
    Routes.post('/v1/booking/callcenter', tripController.CallCenterBookTrip)
    Routes.get('/v1/trips/:trip_id', tripController.GetTripById)
    Routes.put('/v1/trips/:trip_id', tripController.UpdateTrip)
    app.use(Routes)
    app.use(AuthRoutes)
    return app
}

export default initTripRoutes;