"use strict";

var _expressListEndpoints = _interopRequireDefault(require("express-list-endpoints"));
var _socketService = _interopRequireDefault(require("./socket/socketService"));
var _socketServiceTS = _interopRequireDefault(require("./socket/socketServiceTS.js"));
var _initServer = _interopRequireDefault(require("./services/initServer"));
var _connectDB = _interopRequireDefault(require("./config/connectDB"));
var _connectRedis = require("./config/connectRedis");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";

// import initServerRoutes from "./routes/serverRoutes";

// const app = express()
// const server = http.createServer(app)

// let io = new Server(server, {
//   cors: {
//     origin: '*',
//     // methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   },
// })
var rd = (0, _connectRedis.getRedisCon)();
require("dotenv").config();

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url} ${res.statusCode}`);
//   next();
// });
var io = _initServer["default"].getIO();
(0, _connectDB["default"])();
// initSocket();
_socketServiceTS["default"].runSocketService(io);
console.log((0, _expressListEndpoints["default"])(_initServer["default"].getApp()));
_initServer["default"].getServer().listen(process.env.PORT || 3000, function () {
  console.log("server listening on 3000");
});
process.on("beforeExit", function () {
  rd.quit();
});
process.on("SIGINT", function () {
  rd.quit();
  process.exit(0);
});

// "postbuild": "copy src\\config\\config.json workspace\\config\\",