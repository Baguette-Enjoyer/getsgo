// import express from 'express'
import initRabbitMq from "./rabbitmq/initRabbitMq";
import initServer from "./service/initServer";

initRabbitMq.initializeClients()

conn.connectDB()

initServer.getApp().listen(3004, () => {
    "firebase messaging runninig on 3004"
})