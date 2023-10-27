import amqp from 'amqplib'

export const exchangeTrip = 'trip-exchange'

export const userInfoRequestQueue = "user-info-request" // lấy thông tin user
export const bookTripQueue2 = "book-trip-queue-2" // sau khi lấy thông tin user

export const createTripKey = 'trip.create'
export const createTripCCKey = 'trip.cc.create'
export const updateTripKey = 'trip.update'
export const deleteTripKey = 'trip.delete'

export const createTripQueue = 'create-trip-queue'
export const updateTripQueue = 'update-trip-queue'
export const deleteTripQueue = 'delete-trip-queue'

export const driverAcceptRequestQ = "driver-response-accept"

export const bookTripQueue = 'book-trip-queue'
export const callcenterTripQueue = 'callcenter-trip-queue'

let conn, channel;
require('dotenv').config()

export const initQueue = async () => {
    conn = await amqp.connect(process.env.MQ_URI)
    channel = await conn.createChannel()
    console.log("init rabbit mq")

    await channel.assertExchange(exchangeTrip, 'direct', { durable: false })


    channel.bindQueue(createTripQueue, exchangeTrip, createTripKey)
    channel.bindQueue(updateTripQueue, exchangeTrip, updateTripKey)
    channel.bindQueue(deleteTripQueue, exchangeTrip, deleteTripKey)
    channel.bindQueue(callcenterTripQueue, exchangeTrip, createTripCCKey)
    channel.publish()
    return { conn, channel }
}

export const SendMessageToQueue = (queueName, message, options) => {
    if (!channel) {
        console.error("Channel is not initialized. Call initQueue() first.");
        return;
    }
    let parsedMessage
    try {
        parsedMessage = JSON.parse(message)
    } catch (e) {
        parsedMessage = message
    }
    if (typeof parsedMessage !== "string") {
        throw new Error("Message should be a string or a valid JSON object.");
    }
    const {
        expiration = null,
        priority = null,
        persistent = true,
        replyTo = null,
        correlationId = null,
        contentType = "application/json",
        contentEncoding = "utf-8",
        headers = null,
        messageId = null,
    } = options || amqp.defaultOptions;
    const messageProperties = {
        expiration,
        priority,
        persistent,
        replyTo,
        correlationId,
        contentType,
        contentEncoding,
        headers,
        messageId,
    };
    return channel.sendToQueue(queueName, Buffer.from(parsedMessage.toString()), messageProperties);
};
// export const { conn, channel } = await initQueue();
