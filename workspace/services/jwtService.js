"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
require('dotenv').config();
var GenerateAccessToken = function GenerateAccessToken(id, phone, type) {
  return new Promise(function (resolve, reject) {
    var data = {
      id: id,
      phone: phone,
      type: type
    };
    _jsonwebtoken["default"].sign(data, process.env.SECRET_KEY, {
      expiresIn: '300h'
    }, function (err, token) {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
};
var VerifyToken = function VerifyToken(token) {
  return new Promise(function (resolve, reject) {
    _jsonwebtoken["default"].verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        resolve({
          result: false,
          message: err.message,
          decoded: ""
        });
      } else {
        resolve({
          result: true,
          message: "ok",
          decoded: decoded
        });
      }
    });
  });
};
var _default = {
  GenerateAccessToken: GenerateAccessToken,
  VerifyToken: VerifyToken
};
exports["default"] = _default;