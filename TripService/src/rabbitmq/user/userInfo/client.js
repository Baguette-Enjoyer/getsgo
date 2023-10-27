import { connect } from 'amqplib'
import { UserInfoProducer } from './producer'
import { UserInfoConsumer } from './consumer'
import { EventEmitter } from 'events'
import { RabbitMQConnection } from '../../initConnection';
export const UserInfoQueue = "user-info-queue";

class UserInfoClient {
    constructor() { }
    // static instance
    isInit = false
    // producer
    // consumer
    // producerChannel
    // consumerChannel
    // eventEmitter
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserInfoClient()
            return this.instance
        }
        return this.instance
    }
    async initialize() {
        if (this.isInit) {
            return
        }
        console.log("trying to initialize")
        const connection = await RabbitMQConnection.getConnection()
        // const connection = await connect(process.env.MQ_URI)
        this.consumerChannel = await connection.createChannel()
        this.producerChannel = await connection.createChannel()

        const { queue: userInfoQ } = await this.consumerChannel.assertQueue("", {
            exclusive: true
        })
        this.eventEmitter = new EventEmitter()
        this.consumer = new UserInfoConsumer(this.consumerChannel, userInfoQ, this.eventEmitter)
        this.producer = new UserInfoProducer(this.producerChannel, userInfoQ, this.eventEmitter)
        await this.consumer.consumeMessage()
        this.isInit = true
    }
    async produce(data) {
        if (!this.isInit) {
            await this.initialize()
        }
        return await this.producer.produceMessage(data.toString())
    }
}

export default UserInfoClient.getInstance()