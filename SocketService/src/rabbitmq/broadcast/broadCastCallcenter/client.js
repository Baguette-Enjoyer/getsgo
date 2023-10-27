import config from "../../config/config";
import { RabbitMQConnection } from "../../initConnection";
import { broadcastCallcenter } from "../../../socket/userSocket";

const consumeMessage = (channel) => {
    channel.consume(config.rabbitMQ.queues.broadcastCallcenterQueue, (message) => {
        const m = JSON.parse(message.content.toString())
        const { event, data } = m
        broadcastCallcenter(event, data)
    }, {
        noAck: true
    })
}

export class BroadCastCallcenterClient {
    isInit = false
    static async initialize() {
        const connection = await RabbitMQConnection.getConnection()
        this.consumerChannel = await connection.createChannel()
        await this.consumerChannel.assertQueue(config.rabbitMQ.queues.broadcastCallcenterQueue, {
            durable: true
        })
        consumeMessage(this.consumerChannel)
        this.consumerChannel.consume(config.rabbitMQ.queues.broadcastCallcenterQueue)
        this.isInit = true
    }

}