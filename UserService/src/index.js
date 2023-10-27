// import express from 'express'
import initRabbitMq from "./rabbitmq/initRabbitMq";
import initServer from "./services/initServer";
import conn from './sequelize/config/connectDB'
initRabbitMq.initializeClients()

conn.connectDB()

initServer.getApp().listen(3001, () => {
    "user runninig on 3001"
})