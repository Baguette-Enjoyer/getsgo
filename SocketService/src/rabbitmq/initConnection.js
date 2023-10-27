import { connect } from 'amqplib'
// export const connection = (async () => {
//     return await connect(process.env.MQ_URI)
// })
require('dotenv').config()
export class RabbitMQConnection {
    // static instance = null;
    static async getConnection() {
        if (!this.connection) {
            this.connection = await connect(process.env.MQ_URI)
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








// var connection