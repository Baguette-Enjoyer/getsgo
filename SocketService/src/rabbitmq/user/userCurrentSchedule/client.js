import { RabbitMQConnection } from '../../initConnection'
import { EventEmitter } from 'events'
import { UserCurrentScheduleTripConsumer } from './consumer'
import { UserCurrentScheduleTripProducer } from './producer'

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

            this.eventEmitter = new EventEmitter();


            const { queue: userCurrentTripRep } = await consumerChannel.assertQueue("", {
                exclusive: true
            });

            this.producer = new UserCurrentScheduleTripProducer(producerChannel, userCurrentTripRep, this.eventEmitter);
            this.consumer = new UserCurrentScheduleTripConsumer(consumerChannel, userCurrentTripRep, this.eventEmitter);
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

export default UserCurrentScheduleTripClient.getInstance()