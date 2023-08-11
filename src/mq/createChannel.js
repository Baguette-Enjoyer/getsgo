import amqp from 'amqplib'
import { ConsumerCallcenterTrip, ConsumerNormalTrip } from './tripServiceMQ.js'

const callcentertripqueue = 'callcenter-trip-queue' // from place to location
const normalbooktripqueue = 'book-trip-queue' // location to request queue

let conn, channel;
require('dotenv').config()
export const initQueue = async () => {
    conn = await amqp.connect(process.env.MQ_URI)
    channel = await conn.createChannel()
    console.log("init rabbit mq")
    channel.assertQueue(callcentertripqueue, {
        durable: true,
    })
    channel.assertQueue(normalbooktripqueue, {
        durable: true,
    })
    // channel.assertQueue(rrq, {
    //     durable: true,
    // })
    channel.consume("callcenter-trip-queue", async (message) => {
        ConsumerCallcenterTrip(message)
        channel.ack(message)
    })
    channel.consume("book-trip-queue", async (message) => {
        ConsumerNormalTrip(message)
        channel.ack(message)
    })
    return { conn, channel }
}

export const SendMessageToQueue = (queueName, message) => {
    if (!channel) {
        console.error("Channel is not initialized. Call initQueue() first.");
        return;
    }

    channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true, // Make the message persistent
    });
};
// export const { conn, channel } = await initQueue();
