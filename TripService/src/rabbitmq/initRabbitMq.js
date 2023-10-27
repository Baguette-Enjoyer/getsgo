import UserInfoClient from './user/userInfo/client';
import TripClient from './trip/client'
import BookTripClient from './bookTrip/client'
import CreateUserClient from './user/createUser/client'
import DriverInfoClient from './driver/driverInfo/client'
import DriverStatClient from './driver/driverStats/client'
import RealTimeClient from './realTime/client'
import FindDriverClient from './findDriver/client'
import UserCurrentTripClient from './user/userCurrentTrip/client'
import UserCurrentScheduleTripClient from './user/userCurrentSchedule/client'
import DriverCurrentTripClient from './driver/driverCurrentTrip/client'
import LocalDriverClient from './driver/localDriver/client'
import TripS2Client from './trip/tripS2/client'
import TripS3Client from './trip/tripS3/client'
import { BroadCastUserClient } from './broadCast/broadCastUser/client';
import { BroadCastDriverClient } from './broadCast/broadCastDriver/client';
import { BroadCastCallcenterClient } from './broadCast/broadCastCallcenter/client';
import { BroadCastIdleDriverClient } from './broadCast/broadCastIdleDriver/client';

async function initializeTheRest() {
    await UserCurrentTripClient.initialize()
    console.log("1")
    await UserCurrentScheduleTripClient.initialize()
    console.log("2")
    await DriverCurrentTripClient.initialize()
    console.log("3")
    await LocalDriverClient.initialize()
    console.log("4")
    await TripS2Client.initialize()
    console.log("5")
    await TripS3Client.initialize()
    console.log("6")
    await BroadCastUserClient.initialize()
    console.log("7")
    await BroadCastDriverClient.initialize()
    console.log("8")
    await BroadCastCallcenterClient.initialize()
    console.log("9")
    await BroadCastIdleDriverClient.initialize()
    console.log("10")
}

async function initializeUserInfoClient() {
    try {
        await UserInfoClient.initialize();
        console.log('UserInfoClient initialized successfully');
    } catch (error) {
        console.error('Error initializing UserInfoClient:', error);
    }
}

async function initializeTripClient() {
    try {
        await TripClient.initialize();
        console.log('TripClient initialized successfully');
    } catch (error) {
        console.error('Error initializing TripClient:', error);
    }
}

async function initializeBookTripClient() {
    try {
        await BookTripClient.initialize();
        console.log('BookTripClient initialized successfully');
    } catch (error) {
        console.error('Error initializing BookTripClient:', error);
    }
}

async function initializeCreateUserClient() {
    try {
        await CreateUserClient.initialize();
        console.log('CreateUserClient initialized successfully');
    } catch (error) {
        console.error('Error initializing CreateUserClient:', error);
    }
}

async function initializeDriverInfoClient() {
    try {
        await DriverInfoClient.initialize();
        console.log('DriverInfoClient initialized successfully');
    } catch (error) {
        console.error('Error initializing DriverInfoClient:', error);
    }
}

async function initializeDriverStatClient() {
    try {
        await DriverStatClient.initialize();
        console.log('DriverStatClient initialized successfully');
    } catch (error) {
        console.error('Error initializing DriverStatClient:', error);
    }
}

async function initializeRealTimeClient() {
    try {
        await RealTimeClient.initialize();
        console.log('RealTimeClient initialized successfully');
    } catch (error) {
        console.error('Error initializing RealTimeClient:', error);
    }
}

async function initializeFindDriverClient() {
    try {
        await FindDriverClient.initialize();
        console.log('FindDriverClient initialized successfully');
    } catch (error) {
        console.error('Error initializing FindDriverClient:', error);
    }
}

// Sử dụng các hàm khởi tạo tương ứng để khởi tạo các module
async function initializeClients() {
    await initializeUserInfoClient();
    await initializeCreateUserClient();
    await initializeRealTimeClient();
    await initializeDriverInfoClient();
    await initializeDriverStatClient();
    await initializeFindDriverClient();
    await initializeBookTripClient();
    await initializeTripClient();
    await initializeTheRest()
}

export default { initializeClients };