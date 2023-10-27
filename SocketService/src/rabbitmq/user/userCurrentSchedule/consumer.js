export class UserCurrentScheduleTripConsumer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    async consumeMessage() {
        this.channel.consume(this.queue, async (message) => {
            console.log("User current schedule trip received: " + message.content.toString())
            this.eventEmitter.emit(message.properties.correlationId.toString(), message)
        })
    }
}