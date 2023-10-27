import config from "../../config/config";

export class LocalDriverConsumer {
    constructor(channel, queue, eventEmitter) {
        this.channel = channel;
        this.queue = queue;
        this.eventEmitter = eventEmitter;
    }
    async consumeMessage() {
        this.channel.consume(this.queue, async (message) => {
            // const { correlationId, replyTo } = message.properties
            // const data = JSON.parse(message.content.toString())
            console.log("có kết quả nha")
            this.eventEmitter.emit(message.properties.correlationId.toString(), message)

        })
    }
}