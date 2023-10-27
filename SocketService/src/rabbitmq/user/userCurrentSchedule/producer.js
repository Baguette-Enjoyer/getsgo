import config from "../../config/config";
import { randomUUID } from 'crypto'
export class UserCurrentScheduleTripProducer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    async produceMessage(data) {
        const uuid = randomUUID();
        this.channel.sendToQueue(config.rabbitMQ.queues.userCurrentScheduleTripQueue, Buffer.from(data), {
            replyTo: this.queue,
            correlationId: uuid
        })

        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (message) => {
                console.log("oke em", JSON.parse(message.content.toString()))
                resolve(JSON.parse(message.content.toString()))
            })
        })
    }
}