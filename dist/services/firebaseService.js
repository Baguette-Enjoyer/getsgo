"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _firebaseApp = _interopRequireDefault(require("../firebase/firebaseApp"));
var _userService = _interopRequireDefault(require("./userService"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var auth = _firebaseApp["default"].auth();
var decodeFirebaseToken = function decodeFirebaseToken(token) {
  auth.verifyIdToken(token).then(function (credential) {
    return credential;
  })["catch"](function (error) {
    return error;
  });
};
var _default = {
  decodeFirebaseToken: decodeFirebaseToken
};
exports["default"] = _default;