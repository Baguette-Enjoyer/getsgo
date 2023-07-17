"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _dbRoute = _interopRequireDefault(require("./dbRoute"));
var _userRoutes = _interopRequireDefault(require("./userRoutes"));
var _tripRoutes = _interopRequireDefault(require("./tripRoutes"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var initServerRoutes = function initServerRoutes(app) {
  (0, _userRoutes["default"])(app);
  (0, _dbRoute["default"])(app);
  (0, _tripRoutes["default"])(app);
};
var _default = initServerRoutes;
exports["default"] = _default;