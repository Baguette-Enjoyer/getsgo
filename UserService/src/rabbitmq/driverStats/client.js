import { RabbitMQConnection } from "../initConnection"
import { EventEmitter } from "events"
import { DriverStatConsumer } from "./consumer"
import { DriverStatProducer } from "./producer"
export const driverStatQueue = "driver-stat-queue"
class DriverStatClient {
    // static instance
    isInit = false
    static getInstance() {
        if (!this.instance) {
            this.instance = new DriverStatClient()
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
        const { queue: driverStatRep } = await this.consumerChannel.assertQueue("", {
            exclusive: true
        })
        this.producer = new DriverStatProducer(this.producerChannel, driverStatRep, this.eventEmitter)
        this.consumer = new DriverStatConsumer(this.consumerChannel, driverStatRep, this.eventEmitter)
        this.consumer.consumeMessage()
        this.isInit = true
    }
    async produce(data) {
        if (!this.isInit) {
            await this.initialize()
        }
        console.log("gửi cho thằng driver stat client")
        return await this.producer.produceMessage(data.toString())
    }
}

export default DriverStatClient.getInstance()