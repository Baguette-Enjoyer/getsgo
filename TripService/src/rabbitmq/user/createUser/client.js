import { RabbitMQConnection } from "../../initConnection";
import { EventEmitter } from 'events'
import { CreateUserConsumer } from "./consumer";
import { CreateUserProducer } from "./producer";
class CreateUserClient {
    // static instance;
    isInit = false;
    static getInstance() {
        if (!this.instance) {
            this.instance = new CreateUserClient();
        }
        return this.instance
    }
    async initialize() {
        try {
            if (this.isInit) {
                return;
            }
            console.log("Initializing CreateUserClient");

            const connection = await RabbitMQConnection.getConnection();
            const producerChannel = await connection.createChannel();
            const consumerChannel = await connection.createChannel();

            this.eventEmitter = new EventEmitter();

            const { queue: createUserQ } = await consumerChannel.assertQueue("", { exclusive: true });

            this.producer = new CreateUserProducer(producerChannel, createUserQ, this.eventEmitter);
            this.consumer = new CreateUserConsumer(consumerChannel, createUserQ, this.eventEmitter);

            this.consumer.consumeMessage();

            this.isInit = true;
        } catch (error) {
            console.error('Error initializing CreateUserClient:', error);
        }
    }
    async produce(phone) {
        if (!this.isInit) {
            await this.initialize()
        }
        console.log("gửi cho thằng create user client")
        return await this.producer.produceMessage(phone)
    }
}

export default CreateUserClient.getInstance()