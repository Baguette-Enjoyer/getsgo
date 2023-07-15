import initDBRoutes from './dbRoute'
import initUserRoutes from './userRoutes'
import initTripRoutes from './tripRoutes'

let initServerRoutes = (app) =>{
    initUserRoutes(app)
    initDBRoutes(app)
    initTripRoutes(app)
}

export default initServerRoutes