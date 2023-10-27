import config from "../../config/config";
import { RabbitMQConnection } from "../../initConnection";
// export const broadcastDriverQueue = 'broadcast-driver'

export class BroadCastDriverClient {
    isInit = false
    static async initialize() {
        const connection = await RabbitMQConnection.getConnection()
        this.producerChannel = await connection.createChannel()
        await this.producerChannel.assertQueue(config.rabbitMQ.queues.broadcastDriverQueue, {
            durable: true
        })
        console.log("hú bradcast driver")
        this.isInit = true
    }
    static async produce(driverId, event, data) {
        if (!this.isInit) {
            await this.initialize()
        }
        const message = {
            driver_id: driverId,
            event,
            data
        }

        this.producerChannel.sendToQueue(config.rabbitMQ.queues.broadcastDriverQueue, Buffer.from(JSON.stringify(message)))
    }
}