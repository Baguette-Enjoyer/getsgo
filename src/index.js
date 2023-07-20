import express from "express";
import http from "http";
import { Server } from "socket.io";
import listEndpoints from "express-list-endpoints";
import initServerRoutes from "./routes/serverRoutes";
import connectDB from "./config/connectDB";
import initSocket from './services/socketService';
const app = express()
const server = http.createServer(app)

let io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
})

require("dotenv").config();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${res.statusCode}`);
  next();
});

// initSocket(io)

app.get("/", (req, res) => {
  res.send("oh hi yo")
})

initServerRoutes(app)
connectDB();

console.log(listEndpoints(app))
server.listen(process.env.PORT || 3000, () => {
  console.log("server listening on 3000")
})

// "postbuild": "copy src\\config\\config.json workspace\\config\\",