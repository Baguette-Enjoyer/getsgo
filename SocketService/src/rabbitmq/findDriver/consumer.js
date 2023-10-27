import { FindDriverHandler } from "./messageHandler";

export class FindDriverConsumer {
    constructor(channel, queue) {
        this.channel = channel;
        this.queue = queue;
    }
    async consumeMessage() {
        this.channel.consume(this.queue, async (message) => {
            const { correlationId, replyTo } = message.properties
            // const driverId = parseInt(message.content.toString())
            const data = JSON.parse(message.content.toString())
            await FindDriverHandler.handle(data, correlationId, replyTo)
        }, {
            noAck: true
        })
    }
}