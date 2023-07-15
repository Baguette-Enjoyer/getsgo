import express from "express";
import http from "http";
import socketio from "socket.io";
import initServerRoutes from "./routes/serverRoutes";
import connectDB from "./config/connectDB";
import socketService from './socket/index'
const app = express()
const server = http.createServer(app)

const io = new socketio.Server(server)

socketService.socketConnection(io)
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
connectDB();


server.listen(process.env.PORT || 3000, () => {
  console.log("server listening on 3000")
})

