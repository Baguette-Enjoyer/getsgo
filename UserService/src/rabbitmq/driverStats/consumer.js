export class DriverStatConsumer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    consumeMessage() {
        console.log("cout>111111")
        this.channel.consume(this.queue, async (message) => {
            console.log("event emitter của driver nhận được rồi")
            console.log("tao emit nha")
            this.eventEmitter.emit(message.properties.correlationId.toString(), message)
        }, {
            noAck: true
        })
    }
}