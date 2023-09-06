import express from "express"
import tripController from "../controllers/tripController"
import authMiddleware from "../middleware/authMiddleware"
const AuthRoutes = express.Router()
const Routes = express.Router()
const Routes2 = express.Router()
const initTripRoutes = (app) => {
    Routes.post('/v1/booking/callcenter', tripController.BookCallCenter)
    Routes.post('/v1/booking/callcenters1', tripController.BookS1)
    Routes.post('/v1/booking/callcenters2', tripController.BookS2)
    Routes.get('/v1/booking/callcenters2', tripController.GetTripForS2)
    Routes.get('/v1/booking/callcenters3', tripController.GetTripForS3)
    Routes.get('/v1/trips/:trip_id', tripController.GetTripById)
    Routes.put('/v1/trips/:trip_id', tripController.UpdateTrip)
    Routes.delete('/v1/trips/:trip_id', tripController.DeleteTrip)
    Routes2.get('/v1/appointment_trips', tripController.GetAppointmentTripController)
    Routes2.get('/v1/appointment_trips/:driver_id', tripController.GetAcceptedScheduledTrip)
    Routes.post('/v1/trips/rate', tripController.updateRate)
    AuthRoutes.use(authMiddleware.AuthMiddleware)
    AuthRoutes.post('/v1/booking/users', tripController.BookTrip)
    AuthRoutes.get('/v1/drivers/trips', tripController.GetTrips)
    AuthRoutes.put('/v1/trips/cancel/:trip_id', tripController.CancelTrip)
    AuthRoutes.put('/v1/trips/accept/:trip_id', tripController.AcceptTrip)

    app.use(Routes)
    app.use(Routes2)
    app.use(AuthRoutes)
    return app
}

export default initTripRoutes;