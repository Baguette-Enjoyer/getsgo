import { RabbitMQConnection } from "../initConnection";
import { TripInfoConsumer } from "./tripInfo/consumer";
import { TripInfoProducer } from "./tripInfo/producer";
import { TripDeleteConsumer } from "./tripDelete/TripDeleteConsumer";
import { TripUpdateConsumer } from "./tripUpdate/TripUpdateConsumer";
import config from "../config/config";

export const tripInfoQueue = "trip-info-queue";
export const tripUpdateQueue = "trip-update-queue";
export const tripDeleteQueue = "trip-delete-queue";

class TripClient {
    // static instance
    isInit = false
    static getInstance() {
        if (!this.instance) {
            this.instance = new TripClient()
        }
        return this.instance
    }
    async initialize() {
        if (this.isInit) return
        const connection = await RabbitMQConnection.getConnection()
        // this is for basic trip information
        const tripInfoProducerChannel = await connection.createChannel()
        const tripInfoConsumerChannel = await connection.createChannel()

        //this is for trip update queue
        const tripUpdateConsumerChannel = await connection.createChannel()

        // this.tripUpdateConsumer = await connection.createChannel()

        //this is for trip delete queue
        const tripDeleteConsumerChannel = await connection.createChannel()
        // this.tripDeleteConsumer = await connection.createChannel()

        const { queue: queueInfo } = await tripInfoConsumerChannel.assertQueue(config.rabbitMQ.queues.tripInfoQueue, {
            exclusive: true,
        })
        console.log("hú queue")
        const { queue: queueUpdate } = await tripUpdateConsumerChannel.assertQueue(config.rabbitMQ.queues.tripUpdateQueue, {
            exclusive: true
        })
        console.log("hú queue 2")
        const { queue: queueDelete } = await tripDeleteConsumerChannel.assertQueue(config.rabbitMQ.queues.tripDeleteQueue, {
            exclusive: true
        })
        console.log("hú queue 3")
        this.tripInfoProducer = new TripInfoProducer(tripInfoProducerChannel, queueInfo)
        this.tripInfoConsumer = new TripInfoConsumer(tripInfoProducerChannel, queueInfo)
        this.tripUpdateConsumer = new TripUpdateConsumer(tripUpdateConsumerChannel, queueUpdate)
        this.tripDeleteConsumer = new TripDeleteConsumer(tripDeleteConsumerChannel, queueDelete)

        await this.tripInfoConsumer.consumeMessage()
        console.log("consuming trip info q")
        await this.tripUpdateConsumer.consumeMessage()
        console.log("consuming trip update q")
        await this.tripDeleteConsumer.consumeMessage()
        console.log("consuming trip delete q")
        this.isInit = true
    }
    async produceTripInfo(data, correlationId, replyTo) {
        if (!this.isInit) {
            await this.initialize()
        }
        return await this.tripInfoProducer.produceMessage(data, correlationId, replyTo)
    }
    // async produceTripUpdate(data) {
    //     if (!this.isInit) {
    //         this.initialize()
    //     }
    //     this.tripUpdateChannel.sendToQueue(tripUpdateQueue, Buffer.from(JSON.stringify(data)))
    // }
    // async produceTripDelete(data) {
    //     if (!this.isInit) {
    //         this.initialize()
    //     }
    //     this.tripDeleteChannel.sendToQueue(tripDeleteQueue, Buffer.from(data.toString()))
    // }
}

export default TripClient.getInstance()