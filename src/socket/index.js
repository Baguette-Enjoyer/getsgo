import socketio from "socket.io";

let users = {}
let drivers = {}
let trips = {}

let socketConnection = (io) => {
    io.on('connection',(socket)=>{
        socket.on('user_info',(data)=>{
            console.log(data)
            users[data.user_id] = {
                user_id: data.user_id,
                phone: data.phone,
                socket: socket,
            }
            socket.emit("messageFromServer",{message:`User ${data.user_id} logged in`})
        })
        socket.on("trip_request",(data)=>{
            //BroadCast each drivers
        })
    })
}

let socketHandleUserInfo = (io) =>{
    io.on("client_info",(data)=>{
        console.log()
    })
}

export default {socketConnection}
