// import express from 'express'
import initRabbitMq from "./rabbitmq/initRabbitMq";
import initServer from "./services/initServer";
import conn from './sequelize/config/connectDB'
initRabbitMq.initializeClients()

conn.connectDB()

initServer.getApp().listen(3002, () => {
    "trip runninig on 3002"
})