export class DriverLocationConsumer {
    constructor(channel, queue) {
        this.channel = channel;
        this.queue = queue;

    }
    async consumeMessage() {
        this.channel.consume(this.queue, async (message) => {
            this.eventEmitter.emit(message.properties.correlationId.toString(), message)
        }, {
            noAck: true
        })
    }
}