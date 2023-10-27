import config from "../../config/config";

export class TripDeleteProducer {
    constructor(channel) {
        this.channel = channel;
    }
    async produceMessage(data) {
        console.log("gửi data trip delete q nè")
        this.channel.sendToQueue(config.rabbitMQ.queues.tripDeleteQueue, Buffer.from(data))
    }
}