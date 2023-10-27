import { RabbitMQConnection } from "../initConnection";
import { EventEmitter } from 'events'
import { DriverLocationProducer } from "./driverLocation/driverLocationProducer";
import { DriverLocationConsumer } from "./driverLocation/driverLocationConsumer";
class RealTimeClient {
    constructor() { }
    isInit = false
    // static instance
    static getInstance() {
        if (!this.instance) {
            this.instance = new RealTimeClient();
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

        this.driverLocationEventEmitter = new EventEmitter()

        const { queue } = await this.consumerChannel.assertQueue("", {
            exclusive: true
        })
        this.driverLocationProducer = new DriverLocationProducer(this.producerChannel, queue, this.eventEmitter)
        this.driverLocationConsumer = new DriverLocationConsumer(this.consumerChannel, queue, this.eventEmitter)

        await this.driverLocationConsumer.consumeMessage()
        this.isInit = true
    }
    async produceDriverLocation(driver_id) {
        if (!this.isInit) {
            await this.initialize()
        }
        return await this.driverLocationProducer.produceMessage(driver_id.toString())
    }
    // async produce(data) {
    //     await this.producer.produceMessage(data)
    // }

}
export default RealTimeClient.getInstance()