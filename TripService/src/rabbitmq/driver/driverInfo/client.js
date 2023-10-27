import { RabbitMQConnection } from "../../initConnection";
import { EventEmitter } from 'events'
import { DriverInfoConsumer } from './consumer'
import { DriverInfoProducer } from './producer'

class DriverInfoClient {
    // static instance;
    isInit = false;
    static getInstance() {
        if (!this.instance) {
            this.instance = new DriverInfoClient();
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

            this.eventEmitter = new EventEmitter();

            console.log("bị ở đây")
            const { queue: driverInfoQueue } = await consumerChannel.assertQueue("", {
                exclusive: true
            });
            console.log("hay ở đây")
            this.producer = new DriverInfoProducer(producerChannel, driverInfoQueue, this.eventEmitter);
            this.consumer = new DriverInfoConsumer(consumerChannel, driverInfoQueue, this.eventEmitter);
            this.consumer.consumeMessage();
            this.isInit = true;
        } catch (e) {
            console.error("Error starting DriverInfoClient:", e); // In ra lỗi thực sự
        }
    }
    async produce(data) {
        if (!this.isInit) {
            await this.initialize()
        }
        console.log("gửi cho thằng driver info client")
        return await this.producer.produceMessage(data.toString())
    }
}

export default DriverInfoClient.getInstance()