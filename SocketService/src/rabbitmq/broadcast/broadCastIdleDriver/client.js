import { BroadcastIdleDrivers } from "../../../socket/driverSocket";
import config from "../../config/config";
import { RabbitMQConnection } from "../../initConnection";
export const broadcastDriverQueue = 'broadcast-driver'

const consumeMessage = (channel) => {
    channel.consume(config.rabbitMQ.queues.broadcastIdleDriverQueue, (message) => {
        const m = JSON.parse(message.content.toString())
        const { event, data } = m
        BroadcastIdleDrivers(event, data)
    }, {
        noAck: true
    })
}

export class BroadCastIdleDriverClient {
    isInit = false
    static async initialize() {
        const connection = await RabbitMQConnection.getConnection()
        this.consumerChannel = await connection.createChannel()
        await this.consumerChannel.assertQueue(config.rabbitMQ.queues.broadcastIdleDriverQueue, {
            durable: true
        })
        consumeMessage(this.consumerChannel)
        this.isInit = true
    }
}
