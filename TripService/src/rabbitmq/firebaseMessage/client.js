import config from "../config/config";
import { RabbitMQConnection } from '../initConnection';

export class FirebaseMessageClient {
    constructor() { }
    static async initialize() {
        // const connection = await connect(process.env.MQ_URI)
        const connection = await RabbitMQConnection.getConnection()
        this.producer = await connection.createChannel()

        this.isInit = true;
    }
    static async produce(token_fcm, title, body) {
        const data = {
            token_fcm,
            title,
            body
        }
        this.producer.sendToQueue(config.rabbitMQ.queues.firebaseMessageQueue, Buffer.from(JSON.stringify(data)))
    }
}
