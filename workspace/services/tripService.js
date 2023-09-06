"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _sequelize = require("sequelize");
var _index = _interopRequireDefault(require("../models/index"));
var _userService = _interopRequireDefault(require("./userService"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() { } function GeneratorFunction() { } function GeneratorFunctionPrototype() { } var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg; ;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg; else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var CreateTrip = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data) {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(resolve, reject) {
              var lat1, lng1, place1, lat2, lng2, place2, now, user_id, is_scheduled, scheduled_time, status, paymentMethod, is_paid, price, trip, newTrip;
              return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    //location
                    lat1 = data.start.lat;
                    lng1 = data.start.lng;
                    place1 = data.start.place;
                    lat2 = data.end.lat;
                    lng2 = data.end.lng;
                    place2 = data.end.place;
                    now = new Date(); //user_info
                    user_id = data.user_id;
                    is_scheduled = data.is_scheduled;
                    scheduled_time = is_scheduled ? data.schedule_time : now; //Check user role here
                    status = "Pending";
                    paymentMethod = data.paymentMethod;
                    is_paid = false;
                    price = data.price;
                    trip = {
                      start: JSON.stringify({
                        name: place1,
                        lat: lat1,
                        lng: lng1
                      }),
                      end: JSON.stringify({
                        name: place2,
                        lat: lat2,
                        lng: lng2
                      }),
                      user_id: user_id,
                      is_scheduled: is_scheduled,
                      scheduled_time: scheduled_time,
                      status: status,
                      paymentMethod: paymentMethod,
                      is_paid: is_paid,
                      price: price
                    }; // console.log(trip)
                    _context.next = 17;
                    return _index["default"].Trip.create(trip);
                  case 17:
                    newTrip = _context.sent;
                    trip.trip_id = newTrip.id;
                    console.log(trip);
                    if (!(newTrip.id == null)) {
                      _context.next = 22;
                      break;
                    }
                    return _context.abrupt("return", resolve({
                      statusCode: 500,
                      error: new Error('error creating trip')
                    }));
                  case 22:
                    return _context.abrupt("return", resolve({
                      statusCode: 200,
                      trip_info: trip
                    }));
                  case 23:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function (_x2, _x3) {
              return _ref2.apply(this, arguments);
            };
          }()));
        case 1:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function CreateTrip(_x) {
    return _ref.apply(this, arguments);
  };
}();
var CreateTripForCallCenter = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(data) {
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", new Promise( /*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(resolve, reject) {
              var place1, place2, now, phone, is_scheduled, scheduled_time, status, paymentMethod, is_paid, price, user, user_id, trip, newTrip;
              return _regeneratorRuntime().wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    // let lat1 = data.start.lat
                    // let lng1 = data.start.lng
                    place1 = data.start; // let lat2 = data.end.lat
                    // let lng2 = data.end.lng
                    place2 = data.end;
                    now = new Date();
                    phone = data.phone;
                    is_scheduled = data.is_scheduled;
                    scheduled_time = is_scheduled ? data.schedule_time : now;
                    status = "Pending";
                    paymentMethod = data.paymentMethod;
                    is_paid = false;
                    price = data.price;
                    _context3.next = 12;
                    return _userService["default"].CreateUserIfNotExist(phone);
                  case 12:
                    user = _context3.sent;
                    user_id = user.id;
                    console.log(user_id);
                    trip = {
                      start: {
                        name: place1
                      },
                      end: {
                        name: place2
                      },
                      user_id: user_id,
                      is_scheduled: is_scheduled,
                      scheduled_time: scheduled_time,
                      status: status,
                      paymentMethod: paymentMethod,
                      is_paid: is_paid,
                      price: price
                    }; // console.log(trip)
                    _context3.next = 18;
                    return _index["default"].Trip.create(trip);
                  case 18:
                    newTrip = _context3.sent;
                    trip.trip_id = newTrip.id;
                    console.log(trip);
                    if (!(newTrip.id == null)) {
                      _context3.next = 23;
                      break;
                    }
                    return _context3.abrupt("return", resolve({
                      statusCode: 500,
                      error: new Error('error creating trip')
                    }));
                  case 23:
                    return _context3.abrupt("return", resolve({
                      statusCode: 200,
                      trip_info: trip
                    }));
                  case 24:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3);
            }));
            return function (_x5, _x6) {
              return _ref4.apply(this, arguments);
            };
          }()));
        case 1:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return function CreateTripForCallCenter(_x4) {
    return _ref3.apply(this, arguments);
  };
}();
var GetAvailableTrip = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          return _context6.abrupt("return", new Promise( /*#__PURE__*/function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(resolve, reject) {
              var trips;
              return _regeneratorRuntime().wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return _index["default"].Trip.findAll({
                      where: {
                        status: _defineProperty({}, _sequelize.Op.eq, "Waiting")
                      }
                    }, {
                      include: {
                        model: _index["default"].User,
                        as: 'user',
                        attributes: ['name', 'phone']
                      }
                    }, {
                      order: [['createdAt', 'ASC']]
                    });
                  case 2:
                    trips = _context5.sent;
                    trips.forEach(function (trip) {
                      trip.start = JSON.parse(trip.start);
                      trip.end = JSON.parse(trip.end);
                    });
                    return _context5.abrupt("return", resolve({
                      statusCode: 200,
                      trips: trips
                    }));
                  case 5:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5);
            }));
            return function (_x7, _x8) {
              return _ref6.apply(this, arguments);
            };
          }()));
        case 1:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  }));
  return function GetAvailableTrip() {
    return _ref5.apply(this, arguments);
  };
}();
var GetTripById = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(trip_id) {
    var trips;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return _index["default"].Trip.findOne({
            where: {
              id: trip_id
            },
            include: [{
              model: _index["default"].User,
              as: 'user',
              attributes: ['name', 'phone']
            }, {
              model: _index["default"].User,
              as: 'driver',
              attributes: ['name', 'phone']
            }]
          });
        case 2:
          trips = _context7.sent;
          if (!(trips == null)) {
            _context7.next = 5;
            break;
          }
          throw new Error("Couldn't find trip");
        case 5:
          trips.start = JSON.parse(trips.start);
          trips.end = JSON.parse(trips.end);
          return _context7.abrupt("return", trips);
        case 8:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  }));
  return function GetTripById(_x9) {
    return _ref7.apply(this, arguments);
  };
}();
var AcceptTrip = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(data) {
    var trip, result, newTrip;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return GetTripById(data.trip_id);
        case 3:
          trip = _context8.sent;
          if (!(trip.status == "Cancelled")) {
            _context8.next = 8;
            break;
          }
          throw new Error("Trip has been cancelled");
        case 8:
          if (!(trip.status == "Confirmed")) {
            _context8.next = 12;
            break;
          }
          throw new Error("Trip has been confirmed by other driver");
        case 12:
          if (!(trip.status != "Waiting")) {
            _context8.next = 14;
            break;
          }
          throw new Error("Trip is not waiting");
        case 14:
          _context8.next = 19;
          break;
        case 16:
          _context8.prev = 16;
          _context8.t0 = _context8["catch"](0);
          throw _context8.t0;
        case 19:
          _context8.next = 21;
          return _index["default"].Trip.update({
            status: 'Confirmed',
            driver_id: data.driver_id
          }, {
            where: {
              id: data.trip_id
            }
          });
        case 21:
          result = _context8.sent;
          if (!(result != 1)) {
            _context8.next = 24;
            break;
          }
          throw new Error("Something went wrong");
        case 24:
          _context8.next = 26;
          return GetTripById(data.trip_id);
        case 26:
          newTrip = _context8.sent;
          return _context8.abrupt("return", newTrip);
        case 28:
        case "end":
          return _context8.stop();
      }
    }, _callee8, null, [[0, 16]]);
  }));
  return function AcceptTrip(_x10) {
    return _ref8.apply(this, arguments);
  };
}();
var CancelTrip = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(trip_id) {
    var trip, now, createdAt, result, newTrip;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return GetTripById(trip_id);
        case 3:
          trip = _context9.sent;
          // if (trip.id == null) throw new Error("Couldn't find trip")
          now = new Date().getTime();
          createdAt = new Date(trip.createdAt);
          if (!(now - createdAt.getTime() > 300000)) {
            _context9.next = 8;
            break;
          }
          throw new Error("Overtime due");
        case 8:
          _context9.next = 13;
          break;
        case 10:
          _context9.prev = 10;
          _context9.t0 = _context9["catch"](0);
          throw _context9.t0;
        case 13:
          _context9.next = 15;
          return _index["default"].Trip.update({
            status: 'Cancelled'
          }, {
            where: {
              id: trip_id
            }
          });
        case 15:
          result = _context9.sent;
          if (!(result != 1)) {
            _context9.next = 18;
            break;
          }
          throw new Error("Something went wrong");
        case 18:
          _context9.next = 20;
          return GetTripById(trip_id);
        case 20:
          newTrip = _context9.sent;
          return _context9.abrupt("return", newTrip);
        case 22:
        case "end":
          return _context9.stop();
      }
    }, _callee9, null, [[0, 10]]);
  }));
  return function CancelTrip(_x11) {
    return _ref9.apply(this, arguments);
  };
}();
var UpdateTrip = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(data) {
    var updateObj, res, newTrip;
    return _regeneratorRuntime().wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          updateObj = {};
          if (data.driver_id != null) {
            updateObj.driver_id = data.driver_id;
          }
          if (data.status != "Cancelled" && data.status != null) {
            updateObj.status = data.status;
          }
          if (data.finished_date != null) {
            updateObj.finished_date = data.finished_date;
          }
          // console.log(updateObj)
          // console.log(data.trip_id)
          _context10.prev = 4;
          _context10.next = 7;
          return _index["default"].Trip.update(updateObj, {
            where: {
              id: data.trip_id
            }
          });
        case 7:
          res = _context10.sent;
          console.log(res);
          if (!(res != 1)) {
            _context10.next = 11;
            break;
          }
          throw new Error("Something went wrong");
        case 11:
          _context10.next = 13;
          return GetTripById(data.trip_id);
        case 13:
          newTrip = _context10.sent;
          return _context10.abrupt("return", newTrip);
        case 17:
          _context10.prev = 17;
          _context10.t0 = _context10["catch"](4);
          throw _context10.t0;
        case 20:
        case "end":
          return _context10.stop();
      }
    }, _callee10, null, [[4, 17]]);
  }));
  return function UpdateTrip(_x12) {
    return _ref10.apply(this, arguments);
  };
}();
var DeleteTrip = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(trip_id) {
    return _regeneratorRuntime().wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _context11.next = 3;
          return _index["default"].Trip.destroy({
            where: {
              id: trip_id
            }
          });
        case 3:
          _context11.next = 8;
          break;
        case 5:
          _context11.prev = 5;
          _context11.t0 = _context11["catch"](0);
          throw _context11.t0;
        case 8:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[0, 5]]);
  }));
  return function DeleteTrip(_x13) {
    return _ref11.apply(this, arguments);
  };
}();
var GetAppointmentTrip = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12() {
    return _regeneratorRuntime().wrap(function _callee12$(_context12) {
      while (1) switch (_context12.prev = _context12.next) {
        case 0:
          return _context12.abrupt("return", new Promise(function (resolve, reject) { }));
        case 1:
        case "end":
          return _context12.stop();
      }
    }, _callee12);
  }));
  return function GetAppointmentTrip() {
    return _ref12.apply(this, arguments);
  };
}();
var _default = {
  CreateTrip: CreateTrip,
  CreateTripForCallCenter: CreateTripForCallCenter,
  GetAvailableTrip: GetAvailableTrip,
  GetTripById: GetTripById,
  AcceptTrip: AcceptTrip,
  CancelTrip: CancelTrip,
  UpdateTrip: UpdateTrip,
  DeleteTrip: DeleteTrip
};
exports["default"] = _default;