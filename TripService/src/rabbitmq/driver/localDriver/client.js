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




            const { queue: localDriverQueue } = await consumerChannel.assertQueue("", {
                exclusive: true
            });
            this.eventEmitter = new EventEmitter()

            this.producer = new LocalDriverProducer(producerChannel, localDriverQueue, this.eventEmitter)
            this.consumer = new LocalDriverConsumer(consumerChannel, localDriverQueue, this.eventEmitter);
            this.consumer.consumeMessage();
            this.isInit = true;
        } catch (e) {
            console.error("Error starting local driver q:", e); // In ra lỗi thực sự
        }
    }
    async produce(data) {
        if (!this.isInit) {
            await this.initialize()
        }
        console.log("gửi cho thằng local driver client để tìm thằng gần 5km ")
        return await this.producer.produceMessage(data)
    }

}

export default LocalDriverClient.getInstance()