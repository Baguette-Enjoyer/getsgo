import express from "express";

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

console.log("init server")

let getApp = () => {
    return app
}


export default {
    getApp
}