export class CreateUserConsumer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    consumeMessage() {
        this.channel.consume(this.queue, (message) => {
            console.log("event emitter của nhận được rồi")
            console.log("tao emit nha")
            this.eventEmitter.emit(message.properties.correlationId.toString(), message)
        }, {
            noAck: true
        })
    }
}