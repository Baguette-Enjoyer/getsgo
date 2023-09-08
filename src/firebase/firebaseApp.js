// import admin from "firebase-admin";
// import { initiallizeApp, applicationDefault } from 'firebase-admin/app'
import { getMessaging } from "firebase-admin/messaging"

export const sendMessageFirebase = (receivedToken, title, body) => {
    const message = {
        notification: {
            title: title,
            body: body
        },
        token: sendMessageFirebase,
    };

    getMessaging()
        .send(message)
        .then((response) => {
            // res.status(200).json({
            //     message: "Successfully sent message",
            //     token: 'fj9Kb13NThm-4QqSAIu4rb:APA91bHOZm3Fja_OzP7tXdhV391geJ6ZIM_1W_KMOexa_VYF4OUL_M2K7QBrqJlxv1lRlTnJaOnHbDGyrgiP3niBJGoJ8x9y5RzLQn7SNhLbJA2mqgyxnoWENpeE6FTSIfy8dv7iatEB',
            // });
            console.log("Successfully sent message:", response);
        })
        .catch((error) => {
            // res.status(400);
            // res.send(error);
            console.log("Error sending message:", error);
        });

}