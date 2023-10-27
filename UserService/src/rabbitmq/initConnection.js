import { connect } from 'amqplib'
import config from './config/config'
// export const connection = (async () => {
//     return await connect(process.env.MQ_URI)
// })
require('dotenv').config()
export class RabbitMQConnection {
    // static instance = null;
    static async getConnection() {
        if (!this.connection) {
            this.connection = await connect(process.env.MQ_URI)
            // const channel = await this.connection.createChannel();

            // for (const queueName of Object.values(config.rabbitMQ.queues)) {
            //     await channel.assertQueue(queueName, {
            //         durable: true
            //     });
            //     console.log(`Queue ${queueName} is ready.`);
            // }
            console.log("Connected to RabbitMQ")
            process.on('exit', () => {
                if (connection) {
                    connection.close();
                    console.log('Closed RabbitMQ connection');
                }
            });
        }
        return this.connection
    }
}
