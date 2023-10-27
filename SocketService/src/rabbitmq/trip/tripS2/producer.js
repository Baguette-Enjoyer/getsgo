import config from "../../config/config";
import { tripInfoQueue } from "./client";
import { v4 as uuidv4 } from 'uuid';
export class TripS2Producer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    async produceMessage(data) {
        const uuid = uuidv4()
        this.channel.sendToQueue(config.rabbitMQ.queues.tripS2Queue, Buffer.from(data.toString()), {
            replyTo: this.queue,
            correlationId: uuid
        })

        return new Promise((resolve) => {
            this.eventEmitter.once(uuid, message => {
                resolve(JSON.parse(message.content.toString()))
            })
        })

    }
}