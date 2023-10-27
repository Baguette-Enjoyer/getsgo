import initRabbitMq from "./rabbitmq/initRabbitMq";
import initServer from "./service/initServer";
import { runSocketService } from './socket/socketService'
// import { initQueue } from './mq/createChannel.js'
require("dotenv").config();

// initQueue()
runSocketService()
initRabbitMq.initRabbitMq()
// console.log(listEndpoints(initServer.getApp()))

initServer.getServer().listen(process.env.PORT || 3000, () => {
    console.log("server listening on 3000")
})

