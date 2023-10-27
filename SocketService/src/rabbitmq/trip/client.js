import { RabbitMQConnection } from "../initConnection";
import { TripInfoConsumer } from "./tripInfo/consumer";
import { TripInfoProducer } from "./tripInfo/producer";
import { TripUpdateProducer } from "./tripUpdate/TripUpdateConsumer";
import { TripDeleteProducer } from "./tripDelete/TripDeleteConsumer";
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
        const tripUpdateProducerChannel = await connection.createChannel()

        // this.tripUpdateConsumer = await connection.createChannel()

        //this is for trip delete queue
        const tripDeleteProducerChannel = await connection.createChannel()
        // this.tripDeleteConsumer = await connection.createChannel()

        const { queue: queueInfo } = await tripInfoConsumerChannel.assertQueue("", {
            exclusive: true,
        })

        console.log("hú queue 3")
        this.tripInfoProducer = new TripInfoProducer(tripInfoProducerChannel, queueInfo)
        this.tripInfoConsumer = new TripInfoConsumer(tripInfoProducerChannel, queueInfo)

        this.tripUpdateProducer = new TripUpdateProducer(tripUpdateProducerChannel)
        this.tripDeleteProducer = new TripDeleteProducer(tripDeleteProducerChannel)

        await this.tripInfoConsumer.consumeMessage()
        console.log("consuming trip info q")

        this.isInit = true
    }
    async produceTripInfo(data) {
        if (!this.isInit) {
            await this.initialize()
        }
        return await this.tripInfoProducer.produceMessage(data.toString())
    }
    async produceUpdateTrip(data) {
        if (!this.isInit) {
            await this.initialize()
        }
        return await this.tripUpdateProducer.produceMessage(JSON.stringify(data))
    }
    async produceDeleteTrip(data) {
        if (!this.isInit) {
            await this.initialize()
        }
        return await this.tripDeleteProducer.produceMessage(data.toString())
    }
}

export default TripClient.getInstance()