import express from "express";
import initServerRoutes from "../routes/serverRoutes";

var cors = require('cors')

const app = express()
app.use(cors())


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
console.log("init server")

let getApp = () => {
    return app
}
let getIO = () => {
    return io
}

export default {
    getApp, getIO
}