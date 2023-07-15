import express from "express";
import dbController from '../controllers/dbController'
const routes = express.Router()


const initDBRoutes =(app)=>{
    routes.get('/createdb',dbController.initTable)
    return app.use(routes)
}

export default initDBRoutes



