export default class UserInfoProducer {
    constructor(channel) {
        this.channel = channel
    }
    async produceMessage(data, correlationId, replyTo) {
        console.log("reply to queue with data ... ", data)
        this.channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(data)), {
            correlationId: correlationId
        });
    }

}