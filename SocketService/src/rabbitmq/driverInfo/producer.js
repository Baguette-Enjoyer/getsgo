import config from "../config/config";
import { randomUUID } from "crypto";
export class DriverInfoProducer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    async produceMessage(data) {
        const uuid = randomUUID()
        console.log("corr id là ", uuid)
        this.channel.sendToQueue(config.rabbitMQ.queues.driverInfoQueue, Buffer.from(data), {
            replyTo: this.queue,
            correlationId: uuid
        })

        return new Promise((resolve) => {
            this.eventEmitter.once(uuid, async (reply) => {
                console.log('nhận được nè', reply.content.toString())
                resolve(JSON.parse(reply.content.toString()))
            })
        })
    }
}