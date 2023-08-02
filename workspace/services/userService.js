"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _index = _interopRequireDefault(require("../models/index"));
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _path = require("path");
var _jwtService = _interopRequireDefault(require("./jwtService"));
var _sequelize = require("sequelize");
var _initServer = _interopRequireDefault(require("./initServer"));
var _socketServiceTS = require("../socket/socketServiceTS");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var salt = _bcryptjs["default"].genSaltSync(10);
var RegisterUser = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(data) {
    var phone, user, pwd, hash, _user, token;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          phone = data.phone;
          _context.next = 3;
          return _index["default"].User.findOne({
            where: {
              phone: _defineProperty({}, _sequelize.Op.eq, phone)
            }
          });
        case 3:
          user = _context.sent;
          if (!(user != null)) {
            _context.next = 6;
            break;
          }
          throw new Error("Phone existed");
        case 6:
          pwd = data.password;
          _context.next = 9;
          return hashUserPassword(pwd);
        case 9:
          hash = _context.sent;
          _context.prev = 10;
          _context.next = 13;
          return _index["default"].User.create({
            // name: data.name,
            phone: phone,
            password: hash,
            // gender: data.gender,
            active: true,
            type: "User"
          });
        case 13:
          _user = _context.sent;
          _context.next = 16;
          return _jwtService["default"].GenerateAccessToken(_user.id, phone, "User");
        case 16:
          token = _context.sent;
          _context.next = 19;
          return _index["default"].User.update({
            accessToken: token
          }, {
            where: {
              id: _user.id
            }
          });
        case 19:
          return _context.abrupt("return", {
            user_id: _user.id,
            message: "User created",
            phone: phone,
            accessToken: token
          });
        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](10);
          throw new Error("error registering");
        case 25:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[10, 22]]);
  }));
  return function RegisterUser(_x) {
    return _ref.apply(this, arguments);
  };
}();
var LoginUser = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data) {
    var phone, password, user, hashPassword, result, token, verifyToken;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          phone = data.phone;
          password = data.password;
          _context2.next = 4;
          return _index["default"].User.findOne({
            where: {
              phone: _defineProperty({}, _sequelize.Op.eq, phone)
            }
          });
        case 4:
          user = _context2.sent;
          if (!(user == null)) {
            _context2.next = 7;
            break;
          }
          throw new Error("Couldnt find phone");
        case 7:
          if (!(user.password == null)) {
            _context2.next = 9;
            break;
          }
          throw new Error("Require password");
        case 9:
          hashPassword = user.password;
          _context2.next = 12;
          return comparePassword(password, hashPassword);
        case 12:
          result = _context2.sent;
          if (result) {
            _context2.next = 15;
            break;
          }
          throw new Error("Wrong password");
        case 15:
          token = user.accessToken;
          _context2.next = 18;
          return _jwtService["default"].VerifyToken(token);
        case 18:
          verifyToken = _context2.sent;
          if (!(verifyToken.result == false || token == null)) {
            _context2.next = 25;
            break;
          }
          _context2.next = 22;
          return _jwtService["default"].GenerateAccessToken(checkUser.id, checkUser.phone, checkUser.type);
        case 22:
          token = _context2.sent;
          _context2.next = 25;
          return _index["default"].User.update({
            accessToken: token
          }, {
            where: {
              id: checkUser.id
            }
          });
        case 25:
          return _context2.abrupt("return", {
            user_id: user.id,
            phone: user.phone,
            type: user.type,
            accessToken: token
          });
        case 26:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function LoginUser(_x2) {
    return _ref2.apply(this, arguments);
  };
}();
var GetUserByPhone = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(phone) {
    var user;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return _index["default"].User.findOne({
            where: {
              phone: _defineProperty({}, _sequelize.Op.eq, phone)
            }
          });
        case 2:
          user = _context3.sent;
          if (!(user != null)) {
            _context3.next = 7;
            break;
          }
          return _context3.abrupt("return", user);
        case 7:
          if (!(user != null && user.password == null)) {
            _context3.next = 11;
            break;
          }
          throw new Error("Require Register");
        case 11:
          throw new Error("Phone Number Not Found");
        case 12:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function GetUserByPhone(_x3) {
    return _ref3.apply(this, arguments);
  };
}();
var CreateUserIfNotExist = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(phone) {
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", new Promise( /*#__PURE__*/function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(resolve, reject) {
              var existedUser, user;
              return _regeneratorRuntime().wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return _index["default"].User.findOne({
                      where: {
                        phone: phone
                      }
                    });
                  case 2:
                    existedUser = _context4.sent;
                    if (!(existedUser != undefined)) {
                      _context4.next = 5;
                      break;
                    }
                    return _context4.abrupt("return", resolve(existedUser));
                  case 5:
                    _context4.next = 7;
                    return _index["default"].User.create({
                      phone: phone,
                      active: true,
                      type: "User"
                    });
                  case 7:
                    user = _context4.sent;
                    return _context4.abrupt("return", resolve(user));
                  case 9:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4);
            }));
            return function (_x5, _x6) {
              return _ref5.apply(this, arguments);
            };
          }()));
        case 1:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return function CreateUserIfNotExist(_x4) {
    return _ref4.apply(this, arguments);
  };
}();
var UpdatePassword = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(data) {
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          return _context7.abrupt("return", new Promise( /*#__PURE__*/function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(resolve, reject) {
              var id, phone, type, newPassword, token, hashPwd;
              return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                  case 0:
                    id = data.user_id;
                    phone = data.phone;
                    type = data.type;
                    newPassword = data.password; // let user = await GetUserByPhone(phone)
                    _context6.next = 6;
                    return _jwtService["default"].GenerateAccessToken(id, phone, type);
                  case 6:
                    token = _context6.sent;
                    _context6.next = 9;
                    return hashUserPassword(newPassword);
                  case 9:
                    hashPwd = _context6.sent;
                    _context6.next = 12;
                    return _index["default"].User.update({
                      password: hashPwd,
                      accessToken: token
                    }, {
                      where: {
                        id: id
                      }
                    })["catch"](function (err) {
                      throw err;
                    });
                  case 12:
                    return _context6.abrupt("return", resolve({
                      user_id: id,
                      phone: phone,
                      type: type,
                      accessToken: token
                    }));
                  case 13:
                  case "end":
                    return _context6.stop();
                }
              }, _callee6);
            }));
            return function (_x8, _x9) {
              return _ref7.apply(this, arguments);
            };
          }()));
        case 1:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function UpdatePassword(_x7) {
    return _ref6.apply(this, arguments);
  };
}();
var GetUserById = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(user_id) {
    var user;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return _index["default"].User.findOne({
            where: {
              id: user_id
            }
          });
        case 2:
          user = _context8.sent;
          if (!(user.id == null)) {
            _context8.next = 5;
            break;
          }
          throw new Error('user not found');
        case 5:
          return _context8.abrupt("return", user);
        case 6:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return function GetUserById(_x10) {
    return _ref8.apply(this, arguments);
  };
}();
var hashUserPassword = function hashUserPassword(password) {
  return new Promise( /*#__PURE__*/function () {
    var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(resolve, reject) {
      var hashPassWord;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            _context9.prev = 0;
            _context9.next = 3;
            return _bcryptjs["default"].hashSync(password, salt);
          case 3:
            hashPassWord = _context9.sent;
            resolve(hashPassWord);
            _context9.next = 10;
            break;
          case 7:
            _context9.prev = 7;
            _context9.t0 = _context9["catch"](0);
            reject(_context9.t0);
          case 10:
          case "end":
            return _context9.stop();
        }
      }, _callee9, null, [[0, 7]]);
    }));
    return function (_x11, _x12) {
      return _ref9.apply(this, arguments);
    };
  }());
};
var comparePassword = function comparePassword(password, hash) {
  return new Promise( /*#__PURE__*/function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(resolve, reject) {
      var result;
      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
        while (1) switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return _bcryptjs["default"].compare(password, hash);
          case 2:
            result = _context10.sent;
            resolve(result);
          case 4:
          case "end":
            return _context10.stop();
        }
      }, _callee10);
    }));
    return function (_x13, _x14) {
      return _ref10.apply(this, arguments);
    };
  }());
};

//forgot password
var _default = {
  LoginUser: LoginUser,
  RegisterUser: RegisterUser,
  GetUserByPhone: GetUserByPhone,
  GetUserById: GetUserById,
  CreateUserIfNotExist: CreateUserIfNotExist,
  UpdatePassword: UpdatePassword
};
exports["default"] = _default;