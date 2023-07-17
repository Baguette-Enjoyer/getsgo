"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _userControllers = _interopRequireDefault(require("../controllers/userControllers"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var Routes = _express["default"].Router();
var initUserRoutes = function initUserRoutes(app) {
  Routes.post('/v1/users/login', _userControllers["default"].LoginUser);
  Routes.post('/v1/users/signup', _userControllers["default"].RegisterUser);
  // Routes.get('/random',userControllers.AddRandomUser)

  return app.use(Routes);
};
var _default = initUserRoutes;
exports["default"] = _default;