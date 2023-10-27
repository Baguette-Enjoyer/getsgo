import amqplib from 'amqplib'
import MessageHandler from './messageHandler';

export default class UserInfoConsumer {
    constructor(channel, queue) {
        this.channel = channel;
        this.queue = queue;
    }
    async consumeMessage() {
        this.channel.consume(this.queue, async (message) => {
            const { correlationId, replyTo } = message.properties
            if (!correlationId || !replyTo) {
                console.log("Missing properties")
            }
            const data = parseInt(message.content.toString())
            await MessageHandler.handle(data, correlationId, replyTo)
        }, {
            noAck: true,
        })
    }
}