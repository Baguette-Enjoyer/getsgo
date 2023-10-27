import config from "../../config/config";
import { randomUUID } from "crypto";

export class CreateUserProducer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    async produceMessage(phone) {
        const uuid = randomUUID()
        console.log("cor id của create user ", uuid)
        this.channel.sendToQueue(config.rabbitMQ.queues.createUserQueue, Buffer.from(phone), {
            replyTo: this.queue,
            correlationId: uuid
        })

        return new Promise((resolve) => {
            this.eventEmitter.once(uuid, async (response) => {
                const reply = JSON.parse(response.content.toString())
                resolve(reply)
            })
        })
    }
}