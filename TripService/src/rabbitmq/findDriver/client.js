import { RabbitMQConnection } from "../initConnection";
import events from 'events'
import { FindDriverConsumer } from "./consumer";
import { FindDriverProducer } from "./producer";
export const findDriverQueue = "find-driver"

class FindDriverClient {
    constructor() { }
    isInit = false
    // static instance
    static getInstance() {
        if (!this.instance) {
            this.instance = new FindDriverClient();
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
        this.eventEmitter = new events.EventEmitter()
        const { queue } = await this.consumerChannel.assertQueue("", {
            exclusive: true
        })
        console.log("hú find driver")
        this.producer = new FindDriverProducer(this.producerChannel, queue, this.eventEmitter)
        this.consumer = new FindDriverConsumer(this.consumerChannel, queue, this.eventEmitter)

        await this.consumer.consumeMessage()
        this.isInit = true
    }

    async produce(data) {
        if (!this.isInit) {
            await this.initialize()
        }
        return await this.producer.produceMessage(data)
    }
}

export default FindDriverClient.getInstance()