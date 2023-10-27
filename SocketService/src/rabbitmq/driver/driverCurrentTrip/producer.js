import config from "../../config/config";
import { randomUUID } from 'crypto'
export class DriverCurrentTripProducer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    async produceMessage(data) {
        const uuid = randomUUID();
        this.channel.sendToQueue(config.rabbitMQ.queues.driverCurrentTripQueue, Buffer.from(data), {
            replyTo: this.queue,
            correlationId: uuid
        })

        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (message) => {
                resolve(JSON.parse(message.content.toString()))
            })
        })
    }
}