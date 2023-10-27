import { RabbitMQConnection } from "../../initConnection";
import { EventEmitter } from 'events'
import { TripS2Consumer } from "./consumer";
import { TripS2Producer } from "./producer";
export const tripInfoQueue = "trip-info-queue";
export const tripUpdateQueue = "trip-update-queue";
export const tripDeleteQueue = "trip-delete-queue";
export const tripInfoReplyQueue = "trip-info-reply-queue";
class TripS2Client {
    // static instance
    isInit = false
    static getInstance() {
        if (!this.instance) {
            this.instance = new TripS2Client()
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
        this.tripS2producer = new TripS2Producer(this.producerChannel, queue, this.eventEmitter)
        this.tripS2Consumer = new TripS2Consumer(this.consumerChannel, queue, this.eventEmitter)
        this.tripS2Consumer.consumeMessage()

        this.isInit = true
    }
    async produce(data) {
        if (!this.isInit) {
            this.initialize()
        }
        return await this.tripS2producer.produceMessage(data)
    }

}

export default TripS2Client.getInstance()