import ioredis from 'ioredis';
require('dotenv').config()

let rd : ioredis 
function getRedisClient(): ioredis {
  if (!rd) {
    // Replace the connection options below with the appropriate Redis server details
    let connStr = process.env.REDIS_CONN_STR
    if (connStr == null) throw new Error("redis connection failed")
    rd = new ioredis(connStr)
    }
    return rd;

}

export default getRedisClient;