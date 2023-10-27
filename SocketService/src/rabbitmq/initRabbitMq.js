import UserInfoClient from './user/userInfo/client';
import FindDriverClient from './findDriver/client'
import TripClient from './trip/client'
import RealTimeClient from './realTime/client'
import TripS2Client from './trip/tripS2/client'
import TripS3Client from './trip/tripS3/client'
import UserCurrentTripClient from './user/userCurrentTrip/client'
import UserCurrentScheduleTripClient from './user/userCurrentSchedule/client'
import DriverInfoClient from './driverInfo/client'
import DriverCurrentTripClient from './driver/driverCurrentTrip/client'
import { BroadCastCallcenterClient } from './broadcast/broadCastCallcenter/client'
import { BroadCastUserClient } from './broadcast/broadCastUser/client'
import { BroadCastDriverClient } from './broadcast/broadCastDriver/client'
import { BroadCastIdleDriverClient } from './broadcast/broadCastIdleDriver/client'
import { FirebaseMessageClient } from './firebaseMessage/client';

async function initRabbitMq() {
    // const userInfoClient = UserInfoClient.getInstance();
    try {
        await FindDriverClient.initialize()
        console.log('0')
        await UserInfoClient.initialize();
        console.log('1');
        await TripClient.initialize()
        console.log('2');
        await RealTimeClient.initialize()
        console.log("3")
        await TripS2Client.initialize()
        console.log("4")
        await TripS3Client.initialize()
        console.log("5")
        await RealTimeClient.initialize()
        console.log("6")
        await UserCurrentTripClient.initialize()
        console.log("7")
        await UserCurrentScheduleTripClient.initialize()
        console.log("8")
        await DriverInfoClient.initialize()
        console.log("9")
        await DriverCurrentTripClient.initialize()
        console.log("10")
        await BroadCastCallcenterClient.initialize()
        console.log("11")
        await BroadCastUserClient.initialize()
        console.log("12")
        await BroadCastDriverClient.initialize()
        console.log("13")
        await BroadCastIdleDriverClient.initialize()
        console.log("14")
        await TripClient.initialize()
        console.log("15")
        await FirebaseMessageClient.initialize()
        console.log("16")
        // console.log('TripClient initialized successfully');

    } catch (error) {
        console.error('Error initializing UserInfoClient:', error);
    }
}

export default { initRabbitMq };