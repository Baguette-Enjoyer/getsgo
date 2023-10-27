import config from "../../config/config";

export class TripUpdateProducer {
    constructor(channel) {
        this.channel = channel;
    }
    async produceMessage(data) {
        console.log("gửi data trip update q nè")
        this.channel.sendToQueue(config.rabbitMQ.queues.tripUpdateQueue, Buffer.from(data))
    }
}