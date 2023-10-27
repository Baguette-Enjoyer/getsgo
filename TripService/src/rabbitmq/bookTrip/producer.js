export class BookTripProducer {
    constructor(channel, queue) {
        this.channel = channel
        this.queue = queue
    }
    async produceMessage(data) {
        this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(data)));
    }
}