import { v4 as uuidv4 } from 'uuid';
import tripService from '../../../services/tripService';
import { BroadCastDriverClient } from '../../broadCast/broadCastDriver/client';
import { BroadCastUserClient } from '../../broadCast/broadCastUser/client';
import { BroadCastIdleDriverClient } from '../../broadCast/broadCastIdleDriver/client';
import FindDriverClient from '../../findDriver/client'
import { DeleteTrip, getBasicTripInfo } from '../../../services/tripService';
import { handleFind } from './handleFind'
import DriverInfoClient from '../../driver/driverInfo/client'
import RealTimeClient from '../../realTime/client'
import { FirebaseMessageClient } from '../../firebaseMessage/client';
const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Ho_Chi_Minh');
export class FindCallcenterTripHandler {
    static async handle(message) {
        // const message = JSON.parse(message.content.toString())
        const data = message
        console.log("này data nha: ", data)
        console.log(data);
        const trip_id = data.trip_id

        const userData = await UserInfoClient.produce(data.user_id)

        const DataResponse = {
            user_info: data.phone,
            trip_info: data
        }

        if (data.is_scheduled) {
            console.log("đây là chuyến hẹn giờ")
            await BroadCastIdleDriverClient.produce("new-scheduled-trip", DataResponse)
            const now = moment()

            const scheduledTime = moment(data.schedule_time);
            const delay = scheduledTime - now;
            console.log("delay ", delay)
            setTimeout(async () => {
                // kiểm tra lại chuyến đi
                console.log("kiểm tra lại")
                const t = await tripService.GetTripById(trip_id)
                //nếu chưa có driver
                console.log('111111111')
                console.log(t.driver_id)
                if (t.driver_id == null || t.driver_id == undefined) {
                    console.log("không có driver chuyển qua")
                    await handleFind(data, data.phone)
                }
                else {
                    //kiểm tra driver đang có trong chuyến khác
                    const curDat = await tripService.GetDriverCurrentTrip(t.driver_id)
                    console.log(curDat)
                    console.log('sao mày')
                    if (curDat != null) {
                        console.log('em này đang trong chuyến khác nha')
                        await tripService.UpdateTrip({ trip_id: trip_id, driver_id: null, status: "Pending" })
                        await handleFind(data, data.phone)
                    }
                    //không thì thông báo cho biết nó chuẩn bị
                    else {
                        console.log('em ơi đi em')
                        // TripMap.getMap().set(data.trip_id, data);
                        // driver
                        const driverData = await DriverInfoClient.produce(t.driver_id)
                        // const driverData = await driverServices.GetDriverInfoById(t.driver_id)
                        if (driverData) {
                            if (driverData.driver_info) {
                                if (driverData.driver_info.token_fcm) {
                                    await FirebaseMessageClient.produce(driverData.driver_info.token_fcm, 'Chuyến đi hẹn giờ', "Tài xế đang đến chỗ bạn")
                                    // sendMessageFirebase(driverData.driver_info.token_fcm, 'Chuyến đi hẹn giờ', "Tài xế đang đến chỗ bạn")
                                }
                            }
                        }
                        await BroadCastDriverClient.produce(t.driver_id, "schedule-notice", DataResponse)
                        // broadCastToDriverById(t.driver_id, "schedule-notice", DataResponse)
                        const location = await RealTimeClient.produceDriverLocation(t.driver_id)
                        // get from mq
                        const dataDriver = {
                            driver_info: driverData,
                            trip_id: trip_id,
                            location: location
                        }
                        console.log(dataDriver)
                        console.log('em ơi')
                        // client
                        // sendMessageFirebase(userData.token_fcm, 'Chuyến đi hẹn giờ', "Tài xế đang đến chỗ bạn")
                        await BroadCastUserClient.produce(t.user_id, "schedule-start", dataDriver)
                        // broadCastToClientById(t.user_id, "schedule-start", dataDriver)
                    }
                    // broadCastToDriver()
                }
            }, delay)
        }
        else {
            console.log("tìm chuyến callcenter thường nha em")
            await handleFind(data, data.phone)
        }
    }
}