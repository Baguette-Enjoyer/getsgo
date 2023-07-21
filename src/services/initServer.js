import express from "express";
import http from "http";
import { Server } from "socket.io";
import initServerRoutes from "../routes/serverRoutes";

const app = express()
const server = http.createServer(app)

let io = new Server(server, {
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

initServerRoutes(app)


export default {
    server,
    io,
    app,
}