// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
import listEndpoints from "express-list-endpoints";
// import initServerRoutes from "./routes/serverRoutes";
import socket2 from './socket/socketServiceTS.js'
import initServer from "./services/initServer";
import connectDB from "./config/connectDB";
// import { rd } from '../config/connectRedis'
// import getRedisClient from './config/connectRedisTS'
// const app = express()
// const server = http.createServer(app)

// let io = new Server(server, {
//   cors: {
//     origin: '*',
//     // methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   },
// })
// const rd = getRedisClient()
require("dotenv").config();

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url} ${res.statusCode}`);
//   next();
// });
const io = initServer.getIO()

connectDB();
// initSocket();
socket2.runSocketService(io)

console.log(listEndpoints(initServer.getApp()))

initServer.getServer().listen(process.env.PORT || 3000, () => {
  console.log("server listening on 3000")
})

process.on("beforeExit", () => {
  rd.quit();
})

process.on("SIGINT", () => {
  rd.quit();
  process.exit(0);
})

// "postbuild": "copy src\\config\\config.json workspace\\config\\",