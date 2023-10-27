export default {
    rabbitMQ: {
        queues: {
            createUserQueue: "create-user-queue",
            driverInfoQueue: "driver-info-queue",
            driverStatQueue: "driver-stat-queue",
            userInfoQueue: "user-info-queue",
            tripS2Queue: 'trip-s2-queue',
            tripS3Queue: 'trip-s3-queue',
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
            driverLocationQueue: "driver-location",
            userRunningTripQueue: "user-running-trip-queue",
            localDriverQueue: "local-driver-queue",
            driverCurrentTripQueue: "driver-current-trip-queue",
            userCurrentTripQueue: "user-current-trip-queue",
            userCurrentScheduleTripQueue: "user-current-schedule-trip-queue",
            firebaseMessageQueue: "firebase-message-queue"
        },
    },
};