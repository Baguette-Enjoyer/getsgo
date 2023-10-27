import { RabbitMQConnection } from "../initConnection";
import { FindDriverConsumer } from "./consumer";
import { FindDriverProducer } from "./producer";
export const findDriverQueue = "find-driver"

class FindDriverClient {
    isInit = false
    static getInstance() {
        if (!FindDriverClient.instance) {
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

        const { queue } = this.consumerChannel.assertQueue(findDriverQueue, {
            durable: true
        })
        this.producer = new FindDriverProducer(this.producerChannel)
        this.consumer = new FindDriverConsumer(this.consumerChannel, queue)

        this.consumer.consumeMessage()
        this.isInit = true
    }

    async produce(message, correlationId, replyTo) {
        if (!this.isInit) {
            await this.initialize()
        }
        await this.producer.produceMessage(message, correlationId, replyTo)
    }
}

export default FindDriverClient.getInstance()