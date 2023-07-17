"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _socket = _interopRequireDefault(require("socket.io"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var users = {};
var drivers = {};
var trips = {};
var socketConnection = function socketConnection(io) {
  io.on('connection', function (socket) {
    socket.on('user_info', function (data) {
      console.log(data);
      users[data.user_id] = {
        user_id: data.user_id,
        phone: data.phone,
        socket: socket
      };
      socket.emit("messageFromServer", {
        message: "User ".concat(data.user_id, " logged in")
      });
    });
    socket.on("trip_request", function (data) {
      //BroadCast each drivers
    });
  });
};
var socketHandleUserInfo = function socketHandleUserInfo(io) {
  io.on("client_info", function (data) {
    console.log();
  });
};
var _default = {
  socketConnection: socketConnection
};
exports["default"] = _default;