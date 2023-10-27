import express from "express";
import http from "http";
import { Server } from "socket.io";
var cors = require('cors')

const app = express()
app.use(cors())
const server = http.createServer(app)

export const io = new Server(server, {
    cors: {
        origin: '*',
        // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
})

require("dotenv").config();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} ${res.statusCode}`);
    next();
});

app.get("/", (req, res) => {
    res.send("oh hi yo")
})

// initServerRoutes(app)
console.log("init server")
let getServer = () => {
    return server
}
let getApp = () => {
    return app
}
let getIO = () => {
    return io
}


export default {
    getServer, getApp, getIO
}