import config from "../../config/config";

export class UserCurrentTripProducer {
    constructor(channel) {
        this.channel = channel;

    }
    async produceMessage(data, correlationId, replyTo) {
        if (data == null) {
            this.channel.sendToQueue(replyTo, Buffer.from(""), {
                correlationId: correlationId
            })
        }
        else this.channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(data)), {
            correlationId: correlationId
        })
    }
}