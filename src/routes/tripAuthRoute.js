import express from "express"
import authMiddleware from "../middleware/authMiddleware"
import tripController from "../controllers/tripController"

const AuthRoutes = express.Router()

const initTripAuthRoutes = (app) => {
    AuthRoutes.use(authMiddleware.AuthMiddleware)
    AuthRoutes.post('/v1/booking/users', tripController.BookTrip)
    AuthRoutes.get('/v1/drivers/trips', tripController.GetTrips)
    AuthRoutes.put('/v1/trips/cancel/:trip_id', tripController.CancelTrip)
    AuthRoutes.put('/v1/trips/accept/:trip_id', tripController.AcceptTrip)

    return app.use('', AuthRoutes)
}

export default initTripAuthRoutes;