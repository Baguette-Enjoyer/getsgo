import { randomUUID } from "crypto";
import config from '../../config/config'
export class DriverLocationProducer {
    constructor(channel) {
        this.channel = channel;
    }
    async produceMessage(data, correlationId, replyTo) {
        this.channel.sendToQueue(config.rabbitMQ.queues.driverLocationQueue, Buffer.from(JSON.stringify(data)), {
            replyTo: replyTo,
            correlationId: correlationId
        })

    }
}