export default {
    rabbitMQ: {
        queues: {
            createUserQueue: "create-user-queue",
            driverInfoQueue: "driver-info-queue",
            driverStatQueue: "driver-stat-queue",
            userInfoQueue: "user-info-queue",
            userInfoS2Queue: 'user-info-s2-queue',
            userInfoS3Queue: 'user-info-s3-queue',
            tripInfoQueue: "trip-info-queue",
            tripUpdateQueue: "trip-update-queue",
            tripDeleteQueue: "trip-delete-queue",
            tripInfoReplyQueue: "trip-info-reply-queue",
            findDriverQueue: "find-driver",
            broadcastCallcenterQueue: 'broadcast-callcenter',
            broadcastDriverQueue: 'broadcast-driver',
            broadcastIdleDriverQueue: 'broadcast-idle-driver',
            broadcastUserQueue: 'broadcast-user',
            bookTripQueue: "book-trip-queue-2",
            driverLocationQueue: "driver-location"
        },
    },
};