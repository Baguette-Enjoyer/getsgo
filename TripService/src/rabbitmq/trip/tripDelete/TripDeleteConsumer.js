import tripService from "../../../services/tripService";

export class TripDeleteConsumer {
    constructor(channel, queue) {
        this.channel = channel;
        this.queue = queue;
    }
    async consumeMessage() {
        console.log("bắt đầu consume trip delete nè")
        console.log(this.queue)
        this.channel.consume(this.queue, async (message) => {
            const trip_id = parseInt(message.content.toString())
            console.log("delete trip_id: ", trip_id)
            await tripService.DeleteTrip(trip_id)
        }, { noAck: true })
    }
}