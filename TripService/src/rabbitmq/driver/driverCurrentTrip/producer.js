import config from "../../config/config";

export class DriverCurrentTripProducer {
    constructor(channel) {
        this.channel = channel;

    }
    async produceMessage(data, correlationId, replyTo) {
        this.channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(data)), {
            correlationId: correlationId
        })
    }
}