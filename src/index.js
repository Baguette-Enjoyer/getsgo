import listEndpoints from "express-list-endpoints";
import { runSocketService } from './socket/JS/socketService.js'
import initServer from "./services/initServer";
import connectDB from "./config/connectDB";
import { initQueue } from './mq/createChannel.js'
import admin from "firebase-admin";
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getMessaging } from "firebase-admin/messaging";
// var serviceAccount = require("path/to/serviceAccountKey.json");
import { sendMessageFirebase } from "./firebase/firebaseApp.js"
require("dotenv").config();

initQueue()
connectDB();
runSocketService()
console.log(listEndpoints(initServer.getApp()))
process.env.GOOGLE_APPLICATION_CREDENTIALS
initializeApp({
  credential: applicationDefault(),
  projectId: 'taxi-getgo',
});
// sendMessageFirebase()
initServer.getServer().listen(process.env.PORT || 3000, () => {
  console.log("server listening on 3000")
})
sendMessageFirebase('dr4WpNi_QL6IKES0U5qlcr:APA91bGwdTlVQbjWer2BLakMWd4GCXMkgq0vR24bYyL8EjSW9VYBTnUo81-r2zS2KHhMh1lsLyQYse8SibCmut7cU4giP3nAcYxSwNOGzdSRV8Sc0WM26h7nE7NYeXmzqqMjc3xJut95', 'Chuyến đi hẹn giờ', "Đã có tài xế chấp nhận")

process.on("beforeExit", () => {
  rd.quit();
})

process.on("SIGINT", () => {
  rd.quit();
  process.exit(0);
})

// "postbuild": "copy src\\config\\config.json workspace\\config\\",