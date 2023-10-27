import { UserInfoQueue } from "./client"
import { v4 as uuidv4 } from 'uuid';
export class UserInfoConsumer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel
        this.queue = queue
        this.eventEmitter = eventEmitter
    }
    async consumeMessage() {
        console.log("* is consuming message")
        this.channel.consume(this.queue, async (message) => {
            this.eventEmitter.emit(message.properties.correlationId.toString(), message)
        }, {
            noAck: true
        })
    }
}