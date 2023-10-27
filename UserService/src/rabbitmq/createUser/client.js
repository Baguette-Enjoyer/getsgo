import { RabbitMQConnection } from '../initConnection'
import config from '../config/config'
import { CreateUserConsumer } from './consumer'
import { CreateUserProducer } from './producer'
class CreateUserClient {
    constructor() { }
    isInit = false

    static getInstance() {
        if (!this.instance) {
            this.instance = new CreateUserClient()
            return this.instance
        }
        return this.instance
    }

    async initialize() {
        const connection = await RabbitMQConnection.getConnection()
        this.producerChannel = await connection.createChannel()
        this.consumerChannel = await connection.createChannel()

        const { queue } = this.consumerChannel.assertQueue(config.rabbitMQ.queues.createUserQueue, {
            exclusive: true
        })
        this.producer = new CreateUserProducer(this.producerChannel)
        this.consumer = new CreateUserConsumer(this.consumerChannel, queue)
        await this.consumer.consumeMessage()
        this.isInit = true
    }
    async produce(data, correlationId, replyTo) {
        if (!this.isInit) {
            await this.initialize()
        }
        await this.producer.produceMessage(data, correlationId, replyTo)
    }
}

export default CreateUserClient.getInstance()