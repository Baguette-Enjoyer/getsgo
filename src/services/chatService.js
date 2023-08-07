import db from '../models/index'

export const initConvo = async (trip_id, user_id, driver_id) => {
    await db.Conversation.create({
        trip_id: trip_id,
        user_id: user_id,
        driver_id: driver_id
    })
}

export const addChatMessage = async (convo_id, sender_id, message) => {
    await db.Message.create({
        conversation_id: convo_id,
        user_id: sender_id,
        message: message,
    })
}

export const dropConvo = async (convo_id) => {
    await db.Message.destroy({
        conversation_id: convo_id
    })
}