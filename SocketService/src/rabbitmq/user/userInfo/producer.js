import config from "../../config/config";
import { UserInfoQueue } from "./client"
import { v4 as uuidv4 } from 'uuid';

export class UserInfoProducer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel
        this.queue = queue
        this.eventEmitter = eventEmitter
    }
    async produceMessage(data) {
        //data is userid
        const uuid = uuidv4()
        console.log("corr id is: ", uuid)
        this.channel.sendToQueue(config.rabbitMQ.queues.userInfoQueue, Buffer.from(data), {
            replyTo: this.queue,
            correlationId: uuid,
        })

        return new Promise((resolve) => {
            this.eventEmitter.once(uuid, async (response) => {
                console.log("hello", JSON.parse(response.content.toString()))
                const reply = JSON.parse(response.content.toString())
                resolve(reply)
            })
        })

    }
}