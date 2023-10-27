import { handler } from "./handler";

export class DriverCurrentTripConsumer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
    }
    async consumeMessage() {
        this.channel.consume(this.queue, async (message) => {
            const { correlationId, replyTo } = message.properties
            console.log("Driver current trip received: " + message)
            const driver_id = parseInt(message.content.toString())
            console.log(driver_id)
            await handler(driver_id, correlationId, replyTo)
            // this.eventEmitter.emit(message.properties.correlationId.toString(), message)
        })
    }
}