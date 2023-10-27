import { randomUUID } from 'crypto'
import config from '../../config/config';
export class LocalDriverProducer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    async produceMessage(data) {
        const uuid = randomUUID()
        this.channel.sendToQueue(config.rabbitMQ.queues.localDriverQueue, Buffer.from(JSON.stringify(data)), {
            correlationId: uuid,
            replyTo: this.queue
        })
        return new Promise((resolve, reject) => {
            this.eventEmitter.once(uuid, async (data) => {
                console.log('5 thằng nhận được')
                resolve(JSON.parse(data.content.toString()))
            })
        })

    }
}