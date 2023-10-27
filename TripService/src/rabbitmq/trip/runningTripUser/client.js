import { RabbitMQConnection } from "../../initConnection";
import { EventEmitter } from 'events'
import { UserRunningTripConsumer } from "./consumer";
import { UserRunningTripProducer } from "./producer";
import config from "../../config/config";
export const driverInfoQueue = 'driver-info-queue'

class UserRunningTripClient {
    // static instance;
    isInit = false;
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserRunningTripClient();
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
        this.eventEmitter = new EventEmitter()
        const { queue } = this.consumerChannel.assertQueue(config.rabbitMQ.queues.userRunningTripQueue, {
            exclusive: true
        })
        this.producer = new UserRunningTripProducer(this.producerChannel, queue, this.eventEmitter)
        this.consumer = new UserRunningTripConsumer(this.consumerChannel, queue, this.eventEmitter)
        await this.consumer.consumeMessage()
        this.isInit = true
    }
    async produce(data, correlationId, replyTo) {
        if (!this.isInit) {
            await this.initialize()
        }
        return await this.producer.produceMessage(data, correlationId, replyTo)
    }
}

export default UserRunningTripClient.getInstance()