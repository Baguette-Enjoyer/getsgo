import config from "../../config/config";
import { handle } from "./handler";

export class LocalDriverConsumer {
    constructor(channel, queue) {
        this.channel = channel;
        this.queue = queue;
    }
    async consumeMessage() {
        this.channel.consume(this.queue, async (message) => {
            const { correlationId, replyTo } = message.properties
            const data = JSON.parse(message.content.toString())
            await handle(data, correlationId, replyTo)
        })
    }
}