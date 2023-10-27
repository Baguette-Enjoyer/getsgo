export class LocalDriverProducer {
    constructor(channel) {
        this.channel = channel;
    }
    async produceMessage(data, correlationId, replyTo) {
        const mess = {
            drivers: data,
            random: data
        }
        await this.channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(mess)), {
            correlationId: correlationId
        })
    }
}