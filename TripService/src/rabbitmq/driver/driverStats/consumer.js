import config from "../../config/config";
import { DriverStatHandler } from './handler'
export class DriverStatConsumer {
    constructor(channel, queue) {
        this.channel = channel;
        this.queue = queue;
    }
    async consumeMessage() {
        this.channel.consume(config.rabbitMQ.queues.driverStatQueue, async (message) => {
            console.log("có message tới mày")
            console.log(message.content.toString())
            const { correlationId, replyTo } = message.properties
            console.log("cor id là ", correlationId)
            const data = parseInt(message.content.toString()) // this is because when we send the message from client it is just the user id 
            await DriverStatHandler.handle(data, correlationId, replyTo)
        }, {
            noAck: true
        })

    }
}