"use strict";
exports.__esModule = true;
var ioredis_1 = require("ioredis");
require('dotenv').config();
var rd;
function getRedisClient() {
    if (!rd) {
        // Replace the connection options below with the appropriate Redis server details
        var connStr = process.env.REDIS_CONN_STR;
        if (connStr == null)
            throw new Error("redis connection failed");
        rd = new ioredis_1["default"](connStr);
    }
    return rd;
}
exports["default"] = getRedisClient;
