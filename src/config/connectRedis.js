import ioredis from 'ioredis';

let rd = null

let initRedis = () => {
    rd = new ioredis("rediss://default:AVNS_x-0O94XpjDC1FBP_ud6@getsgo-redis-do-user-14291271-0.b.db.ondigitalocean.com:25061")
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

