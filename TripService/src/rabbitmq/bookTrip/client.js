import { connect, Connection } from 'amqplib'
import amqplib from 'amqplib'
import { BookTripConsumer } from './consumer';
import { BookTripProducer } from './producer';
import { RabbitMQConnection } from '../initConnection';
import config from '../config/config';
export const bookTripQueue = "book-trip-queue";
class BookTripClient {
    constructor() { }
    // consumer
    // producer
    // consumerChannel
    // producerChannel
    // static instance
    isInit = false;
    static getInstance() {
        if (!this.instance) {
            this.instance = new BookTripClient()
            // return new BookTripClient();
        }
        return this.instance;
    }
    async initialize() {
        console.log("wtf")
        if (this.isInit) return;
        // const connection = await connect(process.env.MQ_URI)
        const connection = await RabbitMQConnection.getConnection()
        this.consumerChannel = await connection.createChannel()
        this.producerChannel = await connection.createChannel()

        const { queue } = await this.consumerChannel.assertQueue(config.rabbitMQ.queues.bookTripQueue, {
            exclusive: true
        })
        console.log("hú 1")
        this.consumer = new BookTripConsumer(this.consumerChannel, queue)
        this.producer = new BookTripProducer(this.producerChannel, queue)

        await this.consumer.consumeMessage()
        this.isInit = true;
    }
    async produce(data) {
        if (!this.isInit) {
            await this.initialize()
        }
        return await this.producer.produceMessage(data)
    }

}

export default BookTripClient.getInstance()