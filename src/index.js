import listEndpoints from "express-list-endpoints";
import { runSocketService } from './socket/JS/socketService.js'
import initServer from "./services/initServer";
import connectDB from "./config/connectDB";

require("dotenv").config();

connectDB();
runSocketService()

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