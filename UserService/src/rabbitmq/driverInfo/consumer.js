import config from "../config/config";
import { DriverInfoHandler } from "./messageHandler";

export class DriverInfoConsumer {
    constructor(channel, queue) {
        this.channel = channel;
        this.queue = queue;
    }
    async consumeMessage() {
        // console.log("consume driver info ở đây", this.queue)
        this.channel.consume(config.rabbitMQ.queues.driverInfoQueue, async (message) => {
            console.log("có message tới mày")
            console.log(message.content.toString())
            const { correlationId, replyTo } = message.properties
            console.log("driver info nhận cor id là ", correlationId)
            const driverId = parseInt(message.content.toString())
            await DriverInfoHandler.handle(driverId, correlationId, replyTo)
        }, {
            noAck: true
        })
    }
}