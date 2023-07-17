import admin from 'firebase-admin'
import serviceKey from '../../getgo-461d2-6df7eba352ca.json'

const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceKey)
})

export default firebaseApp