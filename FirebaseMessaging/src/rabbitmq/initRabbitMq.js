import { FirebaseMessageClient } from '../rabbitmq/firebaseMessage/client'

async function initializeFirebaseMessaging() {
    await FirebaseMessageClient.initialize()
}


// Sử dụng các hàm khởi tạo tương ứng để khởi tạo các module
async function initializeClients() {
    await initializeFirebaseMessaging();

}

export default { initializeClients };