import { RabbitMQConnection } from '../../initConnection'
import { EventEmitter } from 'events'
import { UserCurrentTripConsumer } from './consumer'
import { UserCurrentTripProducer } from './producer'

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

            this.eventEmitter = new EventEmitter();


            const { queue: userCurrentTripRep } = await consumerChannel.assertQueue("", {
                exclusive: true
            });

            this.producer = new UserCurrentTripProducer(producerChannel, userCurrentTripRep, this.eventEmitter);
            this.consumer = new UserCurrentTripConsumer(consumerChannel, userCurrentTripRep, this.eventEmitter);
            this.consumer.consumeMessage();
            this.isInit = true;
        } catch (e) {
            console.error("Error starting UserInfoClient:", e); // In ra lỗi thực sự
        }
    }
    async produce(data) {
        if (!this.isInit) {
            await this.initialize()
        }
        console.log("gửi cho thằng User current trip client")
        return await this.producer.produceMessage(data.toString())
    }
}

export default UserCurrentTripClient.getInstance()