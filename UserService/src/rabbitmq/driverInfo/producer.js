export class DriverInfoProducer {
    constructor(channel) {
        this.channel = channel
    }
    async produceMessage(message, correlationId, replyTo) {
        this.channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(message)), {
            correlationId: correlationId
        })
    }
}