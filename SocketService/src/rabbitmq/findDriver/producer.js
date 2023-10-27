export class FindDriverProducer {
    constructor(channel) {
        this.channel = channel
    }
    async produceMessage(message, correlationId, replyTo) {
        this.channel.sendToQueue(replyTo, Buffer.from(message), {
            correlationId: correlationId
        })
    }
}