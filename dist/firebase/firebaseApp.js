"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _firebaseAdmin = _interopRequireDefault(require("firebase-admin"));
var _getgo461d26df7eba352ca = _interopRequireDefault(require("../../getgo-461d2-6df7eba352ca.json"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var firebaseApp = _firebaseAdmin["default"].initializeApp({
  credential: _firebaseAdmin["default"].credential.cert(_getgo461d26df7eba352ca["default"])
});
var _default = firebaseApp;
exports["default"] = _default;