import historyService from '../../../services/historyService'
import DriverStatClient from './client'
export class DriverStatHandler {
    static async handle(data, correlationId, replyTo) {
        // data here is driver_id as i defined at consumer.js
        console.log("đang tìm trips của thằng ", data)
        const trips = await historyService.GetHistoryOfDriver(data)
        const stats = historyService.GetDriverStatics(trips)
        // const response = await historyService.GetHistoryOfDriver()
        console.log("trả nè", stats)
        await DriverStatClient.produce(stats, correlationId, replyTo)
    }
}