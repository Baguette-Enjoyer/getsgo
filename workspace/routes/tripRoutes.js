"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _tripController = _interopRequireDefault(require("../controllers/tripController"));
var _authMiddleware = _interopRequireDefault(require("../middleware/authMiddleware"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var AuthRoutes = _express["default"].Router();
var Routes = _express["default"].Router();
var initTripRoutes = function initTripRoutes(app) {
  AuthRoutes.use(_authMiddleware["default"].AuthMiddleware);
  AuthRoutes.post('/v1/booking/users', _tripController["default"].BookTrip);
  AuthRoutes.get('/v1/drivers/trips', _tripController["default"].GetTrips);
  AuthRoutes.put('/v1/trips/cancel/:trip_id', _tripController["default"].CancelTrip);
  AuthRoutes.put('/v1/trips/accept/:trip_id', _tripController["default"].AcceptTrip);
  Routes.post('/v1/booking/callcenter', _tripController["default"].CallCenterBookTrip);
  Routes.get('/v1/trips/:trip_id', _tripController["default"].GetTripById);
  Routes.put('/v1/trips/:trip_id', _tripController["default"].UpdateTrip);
  Routes["delete"]('/v1/trips/:trip_id', _tripController["default"].DeleteTrip);
  app.use(Routes);
  app.use(AuthRoutes);
  return app;
};
var _default = initTripRoutes;
exports["default"] = _default;