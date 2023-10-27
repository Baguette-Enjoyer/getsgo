import { connect } from 'amqplib'

class BroadCastUser {
    isInit = false
    async initialize() {
        const connection = await connect(process.env.MQ_URI)
        
    }
}

class BroadCastDriver {

}

