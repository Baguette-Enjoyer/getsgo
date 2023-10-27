import { userRunningTripHandler } from "./handler";

export class UserRunningTripConsumer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue
    }
    async consumeMessage() {
        this.channel.consume(this.queue, async (message) => {
            const { correlationId, replyTo } = message.properties
            const user_id = parseInt(message.content.toString())
            await userRunningTripHandler(user_id, correlationId, replyTo)
        }, {
            noAck: true
        })
    }
}