import { handle } from './handler';
export class CreateUserConsumer {
    constructor(channel, queue) {
        this.channel = channel;
        this.queue = queue
    }
    async consumeMessage() {
        this.channel.consume(this.queue, async (message) => {
            const { correlationId, replyTo } = message.properties
            console.log("phone is", message.content.toString())
            await handle(message.content.toString(), correlationId, replyTo)
        }, {
            noAck: true
        })
    }
}