import { RabbitMQConnection } from "../../initConnection";
export const broadcastDriverQueue = 'broadcast-driver'
import { broadCastToDriverById } from "../../../socket/userSocket";

const consumeMessage = (channel) => {
    channel.consume(config.rabbitMQ.queues.broadcastDriverQueue, (message) => {
        const m = JSON.parse(message.content.toString())
        const { driver_id, event, data } = m
        broadCastToDriverById(driver_id, event, data)
    }, {
        noAck: true
    })
}

export class BroadCastDriverClient {
    isInit = false
    static async initialize() {
        const connection = await RabbitMQConnection.getConnection()
        this.consumerChannel = await connection.createChannel()
        await this.consumerChannel.assertQueue(broadcastDriverQueue, {
            durable: true
        })
        consumeMessage(this.consumerChannel)
        this.isInit = true
    }
}
