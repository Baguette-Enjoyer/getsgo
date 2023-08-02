"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _userControllers = _interopRequireDefault(require("../controllers/userControllers"));
var _driverController = _interopRequireDefault(require("../controllers/driverController"));
var _historyController = _interopRequireDefault(require("../controllers/historyController"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var Routes = _express["default"].Router();
var initUserRoutes = function initUserRoutes(app) {
  Routes.post('/v1/users/login', _userControllers["default"].LoginUser);
  Routes.post('/v1/users/signup', _userControllers["default"].RegisterUser);
  // Routes.get('/random',userControllers.AddRandomUser)
  // Routes.get('v1/users/:user_id', userControllers.GetUserById)
  Routes.put('/v1/users/updatepassword', _userControllers["default"].UpdatePassword);
  Routes.get('/v1/phone', _userControllers["default"].GetUserByPhone);
  Routes.get('/v1/driver/:driver_id', _driverController["default"].GetDriverInfoById);
  Routes.get('/v1/history/driver/:driver_id', _driverController["default"].GetProfitPlusTrip);
  Routes.get('/v1/history/user/:user_id', _historyController["default"].GetHistoryOfUser);
  Routes.post('/v1/location/localdriver', _userControllers["default"].GetDriverAround3KM);
  return app.use(Routes);
};
var _default = initUserRoutes;
exports["default"] = _default;