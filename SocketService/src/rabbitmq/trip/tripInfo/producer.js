import config from "../../config/config";
import { randomUUID } from "crypto"
export class TripInfoProducer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    async produceMessage(data) {
        const uuid = randomUUID()
        this.channel.sendToQueue(config.rabbitMQ.queues.tripInfoQueue, Buffer.from(data), {
            replyTo: this.queue,
            correlationId: uuid
        });
        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, (message) => {
                resolve(JSON.parse(message.content.toString()))
            })
        })
    }
}