"use strict";

var _express = _interopRequireDefault(require("express"));
var _http = _interopRequireDefault(require("http"));
var _socket = _interopRequireDefault(require("socket.io"));
var _serverRoutes = _interopRequireDefault(require("./routes/serverRoutes"));
var _connectDB = _interopRequireDefault(require("./config/connectDB"));
var _index = _interopRequireDefault(require("./socket/index"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
var server = _http["default"].createServer(app);
var io = new _socket["default"].Server(server);
_index["default"].socketConnection(io);
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
(0, _connectDB["default"])();
server.listen(process.env.PORT || 3000, function () {
  console.log("server listening on 3000");
});