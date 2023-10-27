import { RabbitMQConnection } from '../../initConnection'
import { EventEmitter } from 'events'
import { UserCurrentScheduleTripConsumer } from './consumer'
import { UserCurrentScheduleTripProducer } from './producer'
import config from '../../config/config';

class UserCurrentScheduleTripClient {
    // static instance;
    constructor() { }
    isInit = false;
    static instance = new UserCurrentScheduleTripClient()
    static getInstance() {
        if (!this.instance) {
            this.instance = new UserCurrentScheduleTripClient();
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


            const { queue: userCurrentTripRep } = await consumerChannel.assertQueue(config.rabbitMQ.queues.userCurrentScheduleTripQueue, {
                exclusive: true
            });

            this.producer = new UserCurrentScheduleTripProducer(producerChannel);
            this.consumer = new UserCurrentScheduleTripConsumer(consumerChannel, userCurrentTripRep);
            this.consumer.consumeMessage();
            this.isInit = true;
            console.log("123 dô")
        } catch (e) {
            console.error("Error starting UserInfoClient:", e); // In ra lỗi thực sự
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

export default UserCurrentScheduleTripClient.getInstance()