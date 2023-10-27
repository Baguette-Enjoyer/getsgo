import config from "../../config/config";
import { RabbitMQConnection } from "../../initConnection";
export const broadcastUserQueue = 'broadcast-user'

export class BroadCastUserClient {
    isInit = false
    static async initialize() {
        const connection = await RabbitMQConnection.getConnection()
        this.producerChannel = await connection.createChannel()
        await this.producerChannel.assertQueue(config.rabbitMQ.queues.broadcastUserQueue, {
            durable: true
        })
        this.isInit = true
    }
    static async produce(userId, event, data) {
        if (!this.isInit) {
            await this.initialize()
        }
        const message = {
            user_id: userId,
            event,
            data
        }

        this.producerChannel.sendToQueue(broadcastUserQueue, Buffer.from(JSON.stringify(message)))
    }
}