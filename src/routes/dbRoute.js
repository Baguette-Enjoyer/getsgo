import express from "express";
import dbController from '../controllers/dbController'
const routes = express.Router()


const initDBRoutes = (app) => {
    routes.get('/createdb', dbController.initTable)
    routes.get('/initSeed', dbController.initSeed)
    return app.use(routes)
}

export default initDBRoutes



