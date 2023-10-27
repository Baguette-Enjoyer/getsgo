import { RabbitMQConnection } from '../../initConnection'
import { EventEmitter } from 'events'
import { DriverCurrentTripConsumer } from './consumer'
import { DriverCurrentTripProducer } from './producer'
import config from '../../config/config';

class DriverCurrentTripClient {
    // static instance;
    constructor() { }
    isInit = false;
    static instance = new DriverCurrentTripClient()
    static getInstance() {
        if (!this.instance) {
            this.instance = new DriverCurrentTripClient();
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

            const { queue: driverCurrentTrip } = await consumerChannel.assertQueue(config.rabbitMQ.queues.driverCurrentTripQueue, {
                exclusive: true
            });

            this.producer = new DriverCurrentTripProducer(producerChannel);
            this.consumer = new DriverCurrentTripConsumer(consumerChannel, driverCurrentTrip);
            this.consumer.consumeMessage();
            this.isInit = true;
        } catch (e) {
            console.error("Error starting DriverInfoClient:", e); // In ra lỗi thực sự
        }
    }
    async produce(data, correlationId, replyTo) {
        if (!this.isInit) {
            await this.initialize()
        }
        console.log("gửi cho thằng driver info client")
        return await this.producer.produceMessage(data, correlationId, replyTo)
    }
}

export default DriverCurrentTripClient.getInstance()