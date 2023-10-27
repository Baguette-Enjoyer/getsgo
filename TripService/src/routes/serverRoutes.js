// import initDBRoutes from './dbRoute'
import initTripRoutes from './tripRoutes'
import initTripAuthRoutes from './tripAuthRoute'
let initServerRoutes = (app) => {
    // initUserRoutes(app)
    // initDBRoutes(app)
    initTripRoutes(app)
    initTripAuthRoutes(app)
}

export default initServerRoutes