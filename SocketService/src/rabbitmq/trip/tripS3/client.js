import { RabbitMQConnection } from "../../initConnection";
import { EventEmitter } from 'events'
import { TripS3Consumer } from "./consumer";
import { TripS3Producer } from "./producer";
export const tripInfoQueue = "trip-info-queue";
export const tripUpdateQueue = "trip-update-queue";
export const tripDeleteQueue = "trip-delete-queue";
export const tripInfoReplyQueue = "trip-info-reply-queue";
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


        const { queue } = await this.consumerChannel.assertQueue("", {
            exclusive: true,
        })
        // const { queueUpdateReply } = this.tripUpdateConsumer.assertQueue()
        // const { queueDeleteReply } = this.tripDeleteConsumer.assertQueue()
        this.eventEmitter = new EventEmitter()
        this.tripS3producer = new TripS3Producer(this.producerChannel, queue, this.eventEmitter)
        this.tripS3Consumer = new TripS3Consumer(this.consumerChannel, queue, this.eventEmitter)
        this.tripS3Consumer.consumeMessage()

        this.isInit = true
    }
    async produce(data) {
        if (!this.isInit) {
            this.initialize()
        }
        return await this.tripS3producer.produceMessage(data)
    }

}

export default TripS3Client.getInstance()