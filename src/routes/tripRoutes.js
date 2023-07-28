import express from "express"
import tripController from "../controllers/tripController"
import authMiddleware from "../middleware/authMiddleware"
const AuthRoutes = express.Router()
const Routes = express.Router()
const initTripRoutes = (app) => {
    AuthRoutes.use(authMiddleware.AuthMiddleware)
    AuthRoutes.post('/v1/booking/users', tripController.BookTrip)
    AuthRoutes.get('/v1/drivers/trips', tripController.GetTrips)
    AuthRoutes.put('/v1/trips/cancel/:trip_id', tripController.CancelTrip)
    AuthRoutes.put('/v1/trips/accept/:trip_id', tripController.AcceptTrip)
    Routes.post('/v1/booking/callcenter', tripController.CallCenterBookTrip)
    Routes.get('/v1/trips/:trip_id', tripController.GetTripById)
    Routes.put('/v1/trips/:trip_id', tripController.UpdateTrip)
    Routes.delete('/v1/trips/:trip_id', tripController.DeleteTrip)
    app.use(Routes)
    app.use(AuthRoutes)
    return app
}

export default initTripRoutes;