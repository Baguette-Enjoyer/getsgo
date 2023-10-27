import { RabbitMQConnection } from "../../initConnection";
import { EventEmitter } from 'events'
import { TripS3Consumer } from "./consumer";
import { TripS3Producer } from "./producer";
import config from "../../config/config";

class TripS3Client {
    // static instance
    isInit = false
    static getInstance() {
        if (!this.instance) {
            this.instance = new TripS3Client()
        }
        return this.instance
    }
    async initialize() {
        if (this.isInit) return
        const connection = await RabbitMQConnection.getConnection()
        // this is for basic trip information
        this.producerChannel = await connection.createChannel()
        this.consumerChannel = await connection.createChannel()


        const { queue } = await this.consumerChannel.assertQueue(config.rabbitMQ.queues.tripS3Queue, {
            exclusive: true,
        })
        // const { queueUpdateReply } = this.tripUpdateConsumer.assertQueue()
        // const { queueDeleteReply } = this.tripDeleteConsumer.assertQueue()

        this.tripS3producer = new TripS3Producer(this.producerChannel)
        this.tripS3Consumer = new TripS3Consumer(this.consumerChannel, queue)
        this.tripS3Consumer.consumeMessage()

        this.isInit = true
    }
    async produce(data, correlationId, replyTo) {
        if (!this.isInit) {
            this.initialize()
        }
        return await this.tripS3producer.produceMessage(data, correlationId, replyTo)
    }

}

export default TripS3Client.getInstance()