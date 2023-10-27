import { RabbitMQConnection } from '../../initConnection'
import { EventEmitter } from 'events'
import { DriverCurrentTripConsumer } from './consumer'
import { DriverCurrentTripProducer } from './producer'

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

            this.eventEmitter = new EventEmitter();


            const { queue: driverCurrentTripRep } = await consumerChannel.assertQueue("", {
                exclusive: true
            });

            this.producer = new DriverCurrentTripProducer(producerChannel, driverCurrentTripRep, this.eventEmitter);
            this.consumer = new DriverCurrentTripConsumer(consumerChannel, driverCurrentTripRep, this.eventEmitter);
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
        console.log("gửi cho thằng driver current trip client")
        return await this.producer.produceMessage(data.toString())
    }
}

export default DriverCurrentTripClient.getInstance()