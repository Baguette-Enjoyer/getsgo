"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _dbController = _interopRequireDefault(require("../controllers/dbController"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var routes = _express["default"].Router();
var initDBRoutes = function initDBRoutes(app) {
  routes.get('/createdb', _dbController["default"].initTable);
  return app.use(routes);
};
var _default = initDBRoutes;
exports["default"] = _default;