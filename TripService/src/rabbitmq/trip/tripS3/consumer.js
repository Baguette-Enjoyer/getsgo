import { handler } from "./handler";

export class TripS3Consumer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
    }
    async consumeMessage() {
        this.channel.consume(this.queue, async (message) => {
            const { correlationId, replyTo } = message.properties
            await handler(correlationId, replyTo)
        }, {
            noAck: true
        })
    }

}