export class DriverCurrentTripConsumer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    async consumeMessage() {
        this.channel.consume(this.queue, async (message) => {
            console.log("Driver current trip received: " + message)
            this.eventEmitter.emit(message.properties.correlationId.toString(), message)
        })
    }
}