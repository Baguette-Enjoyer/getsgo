import { TripInfoHandler } from "./handler";

export class TripInfoConsumer {
    constructor(channel, queue) {
        this.channel = channel;
        this.queue = queue;
    }
    async consumeMessage() {
        console.log("bắt đầu consume trip info q nè")
        console.log(this.queue)
        this.channel.consume(this.queue, async (message) => {
            const { correlationId, replyTo } = message.properties
            const trip_id = parseInt(message.content.toString())
            await TripInfoHandler.handle(trip_id, correlationId, replyTo)
        }, {
            noAck: true
        })
    }

}