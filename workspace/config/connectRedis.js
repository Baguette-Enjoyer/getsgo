"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRedisCon = void 0;
var _ioredis = _interopRequireDefault(require("ioredis"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var rd = null;
require('dotenv').config();
var initRedis = function initRedis() {
  rd = new _ioredis["default"](process.env.REDIS_CONN_STR);
  rd.on('connect', function () {
    console.log("connect redis");
  });
  rd.on('error', function () {
    console.log("error");
  });
};
var getRedisCon = function getRedisCon() {
  if (!rd) {
    initRedis();
    rd.set("test", "ok");

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
};
exports.getRedisCon = getRedisCon;