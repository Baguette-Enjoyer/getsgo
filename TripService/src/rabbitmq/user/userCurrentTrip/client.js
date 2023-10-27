import { RabbitMQConnection } from '../../initConnection'
import { EventEmitter } from 'events'
import { UserCurrentTripConsumer } from './consumer'
import { UserCurrentTripProducer } from './producer'
import config from '../../config/config';

class UserCurrentTripClient {
    // static instance;
    constructor() { }
    isInit = false;
    static instance = new UserCurrentTripClient()
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserCurrentTripClient();
        }
        return this.instance
    }
    async initialize() {
        try {
            if (this.isInit) return
            console.log("Initializing UserInfoClient");

            const connection = await RabbitMQConnection.getConnection();
            const producerChannel = await connection.createChannel();
            const consumerChannel = await connection.createChannel();


            const { queue: userCurrentTrip } = await consumerChannel.assertQueue(config.rabbitMQ.queues.userCurrentTripQueue, {
                exclusive: true
            });

            this.producer = new UserCurrentTripProducer(producerChannel);
            this.consumer = new UserCurrentTripConsumer(consumerChannel, userCurrentTrip);
            this.consumer.consumeMessage();
            this.isInit = true;
        } catch (e) {
            console.error("Error starting User current trip client:", e); // In ra lỗi thực sự
        }
    }
    async produce(data, correlationId, replyTo) {
        if (!this.isInit) {
            await this.initialize()
        }
        console.log("gửi cho thằng User current trip client")
        return await this.producer.produceMessage(data, correlationId, replyTo)
    }
}

export default UserCurrentTripClient.getInstance()