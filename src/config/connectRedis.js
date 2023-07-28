import ioredis from 'ioredis';

let rd = null
require('dotenv').config()
let initRedis = () => {
    rd = new ioredis(process.env.REDIS_CONN_STR)
    rd.on('connect', () => {
        console.log("connect redis")
    })

    rd.on('error', () => {
        console.log("error")
    })
}



export const getRedisCon = () => {
    if (!rd) {
        initRedis()
        rd.set("test", "ok")

        // rd.on("connect", () => {
        //     console.log("Kết nối thành công tới Redis");
        // });

        // // Xử lý sự kiện khi gặp lỗi kết nối
        // rd.on("error", (error) => {
        //     console.error("Lỗi kết nối Redis:", error);
        // });
    } else {
        return rd;
    }
}

