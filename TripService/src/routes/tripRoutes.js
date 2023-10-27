import express from "express"
import tripController from "../controllers/tripController"
const Routes = express.Router()

const initTripRoutes = (app) => {
    Routes.post('/v1/booking/callcenter', tripController.BookCallCenter)
    Routes.post('/v1/booking/callcenters1', tripController.BookS1)
    Routes.post('/v1/booking/callcenters2', tripController.BookS2)
    Routes.get('/v1/booking/callcenters2', tripController.GetTripForS2)
    Routes.get('/v1/booking/callcenters3', tripController.GetTripForS3)
    Routes.get('/v1/trips/:trip_id', tripController.GetTripById)
    Routes.put('/v1/trips/:trip_id', tripController.UpdateTrip)
    Routes.delete('/v1/trips/:trip_id', tripController.DeleteTrip)
    Routes.get('/v1/appointment_trips', tripController.GetAppointmentTripController)
    Routes.get('/v1/appointment_trips/:driver_id', tripController.GetAcceptedScheduledTrip)
    Routes.post('/v1/trips/rate', tripController.updateRate)



    return app.use('', Routes)
}

export default initTripRoutes;