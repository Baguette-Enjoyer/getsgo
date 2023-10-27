import { RabbitMQConnection } from "../initConnection";
import { EventEmitter } from 'events'
import { DriverLocationProducer } from "./driverLocation/driverLocationProducer";
import { DriverLocationConsumer } from "./driverLocation/driverLocationConsumer";
import config from "../config/config";
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


        const { queue } = await this.consumerChannel.assertQueue(config.rabbitMQ.queues.driverLocationQueue, {
            exclusive: true
        })
        this.driverLocationProducer = new DriverLocationProducer(this.producerChannel)
        this.driverLocationConsumer = new DriverLocationConsumer(this.consumerChannel, queue)

        await this.driverLocationConsumer.consumeMessage()
        this.isInit = true
    }
    async produceDriverLocation(data, correlationId, replyTo) {
        if (!this.isInit) {
            await this.initialize()
        }
        return await this.driverLocationProducer.produceMessage(data, correlationId, replyTo)
    }
    // async produce(data) {
    //     await this.producer.produceMessage(data)
    // }

}
export default RealTimeClient.getInstance()