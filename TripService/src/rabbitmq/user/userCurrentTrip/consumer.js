import { handler } from "./handler";

export class UserCurrentTripConsumer {
    constructor(channel, queue) {
        this.channel = channel;
        this.queue = queue;

    }
    async consumeMessage() {
        this.channel.consume(this.queue, async (message) => {
            console.log(message.content.toString())
            const { correlationId, replyTo } = message.properties
            console.log("cor id là ", correlationId)
            const data = parseInt(message.content.toString())
            await handler(data, correlationId, replyTo)
        })
    }
}