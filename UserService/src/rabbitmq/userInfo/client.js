import { connect, Channel } from 'amqplib'
import UserInfoProducer from './producer';
import UserInfoConsumer from './consumer';
import { RabbitMQConnection } from '../initConnection';
import config from '../config/config';

require("dotenv").config()

const UserInfoQueue = "user-info-queue"

export class UserInfoClient {
    constructor() { }
    static instance
    isInit = false;
    producer;
    consumer;
    producerChannel;
    consumerChannel;


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
        console.log(
            "trying to init user-info-queue"
        )
        try {
            this.connection = await RabbitMQConnection.getConnection()
            this.consumerChannel = await this.connection.createChannel()
            this.producerChannel = await this.connection.createChannel()

            const { queue } = await this.consumerChannel.assertQueue(config.rabbitMQ.queues.userInfoQueue, {
                exclusive: true
            })

            this.producer = new UserInfoProducer(this.producerChannel)
            this.consumer = new UserInfoConsumer(this.consumerChannel, queue)

            await this.consumer.consumeMessage()
            this.isInit = true
        } catch (error) {
            console.log(error)
        }
    }

    async produce(data, correlationId, replyTo) {
        if (!this.isInit) {
            await this.initialize()
        }
        return await this.producer.produceMessage(data, correlationId, replyTo)
    }
}

export default UserInfoClient.getInstance()