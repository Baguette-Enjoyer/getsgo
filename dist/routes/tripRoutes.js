"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _tripController = _interopRequireDefault(require("../controllers/tripController"));
var _authMiddleware = _interopRequireDefault(require("../middleware/authMiddleware"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var Routes = _express["default"].Router();
var initTripRoutes = function initTripRoutes(app) {
  Routes.use(_authMiddleware["default"].AuthMiddleware);
  Routes.post('/v1/booking/users', _tripController["default"].BookTrip);
  Routes.get('/v1/drivers/trips', _tripController["default"].GetTrips);

  // Routes.get('/random',userControllers.AddRandomUser)

  app.use(Routes);
  return app;
};
var _default = initTripRoutes;
exports["default"] = _default;