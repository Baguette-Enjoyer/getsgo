export class TripInfoConsumer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    async consumeMessage() {
        console.log("bắt đầu consume trip info q nè")
        console.log(this.queue)
        this.channel.consume(this.queue, async (message) => {
            this.eventEmitter.emit(message.properties.correlationId.toString(), message)
        }, {
            noAck: true
        })
    }

}