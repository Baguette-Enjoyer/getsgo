import { broadCastToClientById } from "../../../socket/userSocket";
import config from "../../config/config";
import { RabbitMQConnection } from "../../initConnection";
export const broadcastUserQueue = 'broadcast-user'

const consumeMessage = (channel) => {
    channel.consume(config.rabbitMQ.queues.broadcastUserQueue, (message) => {
        const m = JSON.parse(message.content.toString())
        const { user_id, event, data } = m
        broadCastToClientById(user_id, event, data)
    }, {
        noAck: true
    })
}


export class BroadCastUserClient {
    isInit = false
    static async initialize() {
        const connection = await RabbitMQConnection.getConnection()
        this.consumerChannel = await connection.createChannel()
        await this.consumerChannel.assertQueue(broadcastUserQueue, {
            durable: true
        })
        consumeMessage(this.consumerChannel)
        this.isInit = true
    }
}