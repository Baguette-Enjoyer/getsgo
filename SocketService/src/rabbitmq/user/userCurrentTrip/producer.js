import config from "../../config/config";
import { randomUUID } from 'crypto'
export class UserCurrentTripProducer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    async produceMessage(data) {
        const uuid = randomUUID();
        console.log("data gửi nè ", data)
        this.channel.sendToQueue(config.rabbitMQ.queues.userCurrentTripQueue, Buffer.from(data), {
            replyTo: this.queue,
            correlationId: uuid
        })

        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (message) => {
                if (message.content.toString() == "") {
                    console.log("à há")
                    return resolve(null)
                }
                else console.log("response 1", JSON.parse(message.content.toString()))
                return resolve(JSON.parse(message.content.toString()))
            })
        })
    }
}