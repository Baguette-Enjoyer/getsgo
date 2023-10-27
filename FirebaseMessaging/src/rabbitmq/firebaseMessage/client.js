import config from "../config/config";
import { RabbitMQConnection } from '../initConnection';
import { sendMessageFirebase } from '../../firebase/firebaseApp'
const consumeMessage = (channel) => {
    channel.consume(config.rabbitMQ.queues.firebaseMessageQueue, async (message) => {
        const data = JSON.parse(message.content.toString())
        sendMessageFirebase(data.token_fcm, data.title, data.body)
    })
}
export class FirebaseMessageClient {
    constructor() { }
    static async initialize() {
        console.log("wtf")
        // const connection = await connect(process.env.MQ_URI)
        const connection = await RabbitMQConnection.getConnection()
        this.consumerChannel = await connection.createChannel()

        await this.consumerChannel.assertQueue(config.rabbitMQ.queues.firebaseMessageQueue, {
            exclusive: true
        })

        consumeMessage(this.consumerChannel)
        this.isInit = true;
    }
}
