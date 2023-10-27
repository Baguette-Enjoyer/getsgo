import tripService from "../../../services/tripService";

export class TripUpdateConsumer {
    constructor(channel, queue) {
        this.channel = channel;
        this.queue = queue;
    }
    async consumeMessage() {
        console.log("bắt đầu consume trip update nè")
        this.channel.consume(this.queue, async (message) => {
            const data = JSON.parse(message.content.toString())
            console.log("receive and update trip with data: ", data)
            await tripService.UpdateTrip(data)
        }, { noAck: true })
    }
}