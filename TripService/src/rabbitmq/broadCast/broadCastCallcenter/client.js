import config from "../../config/config";
import { RabbitMQConnection } from "../../initConnection";
export const broadcastCallcenterQueue = 'broadcast-callcenter'

export class BroadCastCallcenterClient {
    isInit = false
    static async initialize() {
        const connection = await RabbitMQConnection.getConnection()
        this.producerChannel = await connection.createChannel()
        await this.producerChannel.assertQueue(config.rabbitMQ.queues.broadcastCallcenterQueue, {
            durable: true
        })
        console.log("hú bradcast callcenter")
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

        this.producerChannel.sendToQueue(broadcastCallcenterQueue, Buffer.from(JSON.stringify(message)))
    }
}