import { RabbitMQConnection } from '../../initConnection'
import { EventEmitter } from 'events'
import { LocalDriverConsumer } from './consumer'
import { LocalDriverProducer } from './producer'
import config from '../../config/config'
class LocalDriverClient {
    isInit = false
    static instance = new LocalDriverClient()
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new LocalDriverClient()
        }
        return this.instance
    }
    async initialize() {
        try {
            if (this.isInit) return
            console.log("Initializing DriverInfoClient");

            const connection = await RabbitMQConnection.getConnection();
            const producerChannel = await connection.createChannel();
            const consumerChannel = await connection.createChannel();



            console.log("bị ở đây")
            const { queue: localDriverQueue } = await consumerChannel.assertQueue(config.rabbitMQ.queues.localDriverQueue, {
                exclusive: true
            });
            console.log("hay ở đây")

            this.producer = new LocalDriverProducer(producerChannel)
            this.consumer = new LocalDriverConsumer(consumerChannel, localDriverQueue);
            this.consumer.consumeMessage();
            this.isInit = true;
        } catch (e) {
            console.error("Error starting local driver q:", e); // In ra lỗi thực sự
        }
    }
    async produce(data, correlationId, replyTo) {
        if (!this.isInit) {
            await this.initialize()
        }
        console.log("gửi cho thằng local driver client để tìm thằng gần 5km ")
        return await this.producer.produceMessage(data, correlationId, replyTo)
    }

}

export default LocalDriverClient.getInstance()