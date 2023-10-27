import config from "../../config/config";
import { v4 as uuidv4 } from 'uuid';
export class UserRunningTripProducer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
    }
    async produceMessage(data, correlationId, replyTo) {
        this.channel.sendToQueue(replyTo, Buffer.from(data), {
            correlationId: correlationId,
        })

    }
}