import { connect } from 'amqplib'
import { DriverInfoConsumer } from './consumer';
import { DriverInfoProducer } from './producer';
import { RabbitMQConnection } from '../initConnection';
import config from '../config/config';
export const driverInfoQueue = "driver-info-queue"

class DriverInfoClient {
    constructor() { }
    isInit = false;
    // static instance
    static getInstance() {
        if (!this.instance) {
            this.instance = new DriverInfoClient()
            return this.instance
        }
        return this.instance
    }

    async initialize() {
        if (this.isInit) return
        console.log("trying to init driver info client (produce driver info)")
        this.connection = await RabbitMQConnection.getConnection()
        // this.connection = await connect(process.env.MQ_URI)
        this.producerChannel = await this.connection.createChannel()
        this.consumerChannel = await this.connection.createChannel()

        const { queue } = await this.consumerChannel.assertQueue(config.rabbitMQ.queues.driverInfoQueue, {
            exclusive: true
        })

        this.producer = new DriverInfoProducer(this.producerChannel)
        this.consumer = new DriverInfoConsumer(this.consumerChannel, queue)
        this.consumer.consumeMessage()
    }
    async produce(response, correlationId, replyTo) {
        if (!this.isInit) {
            await this.initialize()
        }
        return await this.producer.produceMessage(response, correlationId, replyTo)
    }
}

export default DriverInfoClient.getInstance()