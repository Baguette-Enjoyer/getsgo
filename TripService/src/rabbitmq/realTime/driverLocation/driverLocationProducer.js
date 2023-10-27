import { randomUUID } from "crypto";
import config from '../../config/config'
export class DriverLocationProducer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    async produceMessage(driver_id) {
        const uuid = randomUUID()
        this.channel.sendToQueue(config.rabbitMQ.queues.driverLocationQueue, Buffer.from(driver_id), {
            replyTo: this.queue,
            correlationId: uuid
        })
        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (reply) => {
                resolve(JSON.parse(reply.content.toString()))
            })
        })
    }
}