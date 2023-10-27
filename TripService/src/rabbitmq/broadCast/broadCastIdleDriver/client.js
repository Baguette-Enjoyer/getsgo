import config from "../../config/config";
import { RabbitMQConnection } from "../../initConnection";
export const broadcastIdleDriverQueue = 'broadcast-idle-driver'

export class BroadCastIdleDriverClient {
    isInit = false
    static async initialize() {
        const connection = await RabbitMQConnection.getConnection()
        this.producerChannel = await connection.createChannel()
        await this.producerChannel.assertQueue(config.rabbitMQ.queues.broadcastIdleDriverQueue, {
            durable: true
        })
        this.isInit = true
    }
    static async produce(event, data) {
        if (!this.isInit) {
            await this.initialize()
        }
        const message = {
            event,
            data
        }

        this.producerChannel.sendToQueue(broadcastIdleDriverQueue, Buffer.from(JSON.stringify(message)))
    }
}
