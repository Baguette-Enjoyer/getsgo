import userService from '../../services/userService'
import CreateUserClient from './client'
export const handle = async (phone, correlationId, replyTo) => {
    const newUser = await userService.CreateUserIfNotExist(phone)
    console.log('user mới tạo nè', newUser)
    await CreateUserClient.produce(newUser, correlationId, replyTo)
}