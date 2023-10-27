export class FindDriverConsumer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue; //this is replyQueue
        this.eventEmitter = eventEmitter;
    }
    async consumeMessage() {
        this.channel.consume(this.queue, async (message) => {
            this.eventEmitter.emit(message.properties.correlationId.toString(), message)
        }, {
            noAck: true
        })
    }
}