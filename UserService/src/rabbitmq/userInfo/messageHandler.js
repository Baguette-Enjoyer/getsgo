import userService from "../../services/userService";
import UserInfoClient from "./client";

export default class MessageHandler {
    static async handle(
        userId, correlationId, replyTo
    ) {
        const response = await userService.GetUserById(userId)
        await UserInfoClient.produce(response, correlationId, replyTo)
    }
}