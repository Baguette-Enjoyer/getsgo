import UserInfoClient from './userInfo/client';
import CreateUserClient from './createUser/client'
import DriverInfoClient from './driverInfo/client'
import DriverStatClient from './driverStats/client'
// import RealTimeClient from './realTime/client'
// import FindDriverClient from './findDriver/client'


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
    // await initializeTripClient();
    // await initializeBookTripClient();
    await initializeCreateUserClient();
    await initializeDriverInfoClient();
    await initializeDriverStatClient();
    // await initializeRealTimeClient();
    // await initializeFindDriverClient();
}

export default { initializeClients };