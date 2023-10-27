import { FindTripHandler } from './handler/findTripHandler'
import { FindCallcenterTripHandler } from "./handler/findCallcenterHandler"
import config from "../config/config"
export class BookTripConsumer {
    constructor(channel, queue) {
        this.channel = channel
        this.queue = queue
    }
    async consumeMessage() {
        console.log("consuming message ....")
        this.channel.consume(this.queue, async (message) => {
            const d = JSON.parse(message.content.toString())
            if (d.is_callcenter) {
                await FindCallcenterTripHandler.handle(JSON.parse(message.content.toString()))
            }
            await FindTripHandler.handle(JSON.parse(message.content.toString()))
        }, {
            noAck: true
        })
    }
}