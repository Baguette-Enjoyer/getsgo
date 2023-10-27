import { findDriverQueue } from "./client"
import { randomUUID } from "crypto";
export class FindDriverProducer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel
        this.queue = queue
        this.eventEmitter = eventEmitter
    }
    async produceMessage(data) {
        const uuid = randomUUID()
        this.channel.sendToQueue(findDriverQueue, Buffer.from(JSON.stringify(data)), {
            replyTo: this.queue,
            correlationId: uuid
        })
        return new Promise((resolve) => {
            this.eventEmitter.once(uuid, async (data) => {
                resolve(data.content.toString())
            })
        })
    }
}