import config from "../config/config"

import { randomUUID } from "crypto";
export class DriverStatProducer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel
        this.queue = queue
        this.eventEmitter = eventEmitter
    }
    async produceMessage(message) {
        // const uuid = v4()
        const uuid = randomUUID()
        console.log("corr id là", uuid)
        console.log("tao cần stat của", message.toString())
        this.channel.sendToQueue(config.rabbitMQ.queues.driverStatQueue, Buffer.from(message), {
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