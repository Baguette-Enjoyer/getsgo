// import { driverStatQueue } from "./client"
export class DriverStatProducer {
    constructor(channel) {
        this.channel = channel
    }
    async produceMessage(data, correlationId, replyTo) {
        console.log("t gửi cho reply to nè", data, replyTo)
        this.channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(data)), {
            correlationId: correlationId
        })
    }
}