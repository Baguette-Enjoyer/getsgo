import config from "../../config/config"
import { RabbitMQConnection } from "../../initConnection"
import { DriverStatConsumer } from './consumer'
import { DriverStatProducer } from './producer'
export const driverStatQueue = "driver-stat-queue"
class DriverStatClient {
    // static instance
    isInit = false
    static getInstance() {
        if (!this.instance) {
            this.instance = new DriverStatClient()
        }
        return this.instance
    }
    async initialize() {
        if (this.isInit) {
            return
        }
        const connection = await RabbitMQConnection.getConnection()
        this.producerChannel = await connection.createChannel()
        this.consumerChannel = await connection.createChannel()

        const { queue } = await this.consumerChannel.assertQueue(config.rabbitMQ.queues.driverStatQueue, {
            exclusive: true
        })
        this.producer = new DriverStatProducer(this.producerChannel)
        this.consumer = new DriverStatConsumer(this.consumerChannel, queue)
        this.consumer.consumeMessage()
        this.isInit = true
    }
    async produce(data, correlationId, replyTo) {
        if (!this.isInit) {
            await this.initialize()
        }
        return await this.producer.produceMessage(data, correlationId, replyTo)
    }
}

export default DriverStatClient.getInstance()