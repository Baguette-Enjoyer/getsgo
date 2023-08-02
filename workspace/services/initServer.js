"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _http = _interopRequireDefault(require("http"));
var _socket = require("socket.io");
var _serverRoutes = _interopRequireDefault(require("../routes/serverRoutes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
var server = _http["default"].createServer(app);
var io = new _socket.Server(server, {
  cors: {
    origin: '*'
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

require("dotenv").config();
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(function (req, res, next) {
  console.log("".concat(req.method, " ").concat(req.url, " ").concat(res.statusCode));
  next();
});
app.get("/", function (req, res) {
  res.send("oh hi yo");
});
(0, _serverRoutes["default"])(app);
console.log("init server");
var getServer = function getServer() {
  return server;
};
var getApp = function getApp() {
  return app;
};
var getIO = function getIO() {
  return io;
};
var _default = {
  getServer: getServer,
  getApp: getApp,
  getIO: getIO
};
exports["default"] = _default;