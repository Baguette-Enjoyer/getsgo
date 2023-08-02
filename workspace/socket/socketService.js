"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _locationService = _interopRequireDefault(require("../services/locationService"));
var _connectRedis = require("../config/connectRedis");
var _initServer = _interopRequireDefault(require("../services/initServer"));
var _driverServices = _interopRequireDefault(require("../services/driverServices"));
var _userService = _interopRequireDefault(require("../services/userService"));
var _tripService = _interopRequireDefault(require("../services/tripService"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; }, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) }), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; defineProperty(this, "_invoke", { value: function value(method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; } function maybeInvokeDelegate(delegate, context) { var methodName = context.method, method = delegate.iterator[methodName]; if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel; var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), defineProperty(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (val) { var object = Object(val), keys = []; for (var key in object) keys.push(key); return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var io = _initServer["default"].io;
var users = new Map();
var drivers = new Map();
var trips = new Map();
var callCenterTrips = new Map();
var current_intervals = new Map();
var rd = (0, _connectRedis.getRedisCon)();
var initSocket = function initSocket() {
  io.on('connection', function (socket) {
    console.log("socket " + socket.id + " connected");
    handleUserLogin(socket);
    handleDriverLogin(socket);
    handleUserFindTrip(socket);
    //handleCallcenterFindTrip(socket)
    handleDriverResponseBooking(socket);
    handleDisconnect(socket);
  });
};
var deleteTripExceedTime = function deleteTripExceedTime() {
  setInterval(function () {
    var now = new Date().getTime();
    var _iterator = _createForOfIteratorHelper(trips),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2);
        trip_id = _step$value[0];
        trip_data = _step$value[1];
        if (now - trip_data.date_reserved.getTime() >= 300000 && (trip_data.status == 'Waiting' || trip_data.status == 'Pending')) {
          var user_id = trip_data.user_id;
          var sockets = GetSocketByUserId(user_id);
          io.to("/trip/".concat(trip_id)).emit('trip_cancelled', {
            message: "Trip cancelled due to not enough driver"
          });
          for (var i = 0; i < sockets.length; i++) {
            users.get(sockets[i]).socket.leave("/trip/".concat(trip_id));
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }, 300000);
};
var updateDriverLocation = function updateDriverLocation() {
  setInterval(function () {
    for (var _ref in trips) {
      var _ref2 = _ref;
      var _ref3 = _slicedToArray(_ref2, 2);
      trip_id = _ref3[0];
      trip_value = _ref3[1];
      var user_id = trip_value.user_id;
      var driver_id = trip_value.driver_id;
    }
  }, 60000);
};
var notifyUserWhenDriverClosed = function notifyUserWhenDriverClosed() {
  setInterval(function () {}, 60000);
};
var handleUserLogin = function handleUserLogin(socket) {
  socket.on('user-login', function (data) {
    var user_id = data.user_id;
    var trip_id = getTripIfDisconnected(user_id);
    if (trip_id != null) {
      socket.join("/trip/".concat(trip_id));
      console.log("User ".concat(user_id, " has rejoin trip ").concat(trip_id));
    }
    users.set(socket.id, {
      socket: socket,
      user_id: user_id,
      socket_id: socket.id
    });
  });
};
var handleDriverLogin = function handleDriverLogin(socket) {
  socket.on("driver-login", function (data) {
    var driver_id = data.driver_id;
    var trip_id = getTripIfDisconnected(driver_id);
    if (trip_id != null) {
      socket.join("/trip/".concat(trip_id));
      console.log("Driver ".concat(driver_id, " has rejoin trip ").concat(trip_id));
    }
    drivers.set(socket.id, {
      socket: socket,
      user_id: driver_id,
      lat: data.lat,
      lng: data.lng,
      socket_id: socket.id,
      status: data.driver_status,
      // idle | offline | driving
      vehicle_type: data.vehicle_type_id
    });
    console.log("current drivers \n", Array.from(drivers));
  });
};
var handleUserFindTrip = function handleUserFindTrip(socket) {
  socket.on('user-find-trip', /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(data) {
      var _data_response;
      var trip_id, place1, user, userData, data_response, possibleDrivers, i, new_interval, rdTripKey, TripData;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            //get user data first
            trip_id = data.trip_id;
            place1 = data.start;
            socket.join("/trip/".concat(trip_id));
            user = getUserBySocket(socket);
            console.log("User ".concat(user.user_id, " has joined trip ").concat(trip_id));
            _context2.next = 7;
            return _userService["default"].GetUserById(user.user_id);
          case 7:
            userData = _context2.sent;
            userData = JSON.stringify(userData);
            //if the trip is scheduled then just add to database and notify driver

            // let dat_ex = {
            //     trip_id: "123",
            //     start: {
            //         lat: 10.0,
            //         lng: 10.0,
            //         name: 'Address 1'
            //     },
            //     end: {
            //         lat: 10.0,
            //         lng: 10.0,
            //         name: 'Address 1'
            //     },
            //     price: 500.00,
            //     is_scheduled: false,
            //     schedule_time: new Date(),
            // }
            data_response = (_data_response = {
              trip_id: data.trip_id,
              start: data.start,
              end: data.end,
              user: userData
            }, _defineProperty(_data_response, "user", user.user_id), _defineProperty(_data_response, "price", data.price), _data_response);
            possibleDrivers = _locationService["default"].findPossibleDriver(drivers, place1); //broadcast for the first driver
            broadCastToDriver(possibleDrivers[0][1].socket, "user-trip", data_response);
            console.log("broadcasting to driver ".concat(possibleDrivers[0]));
            i = 1;
            new_interval = setInterval(function () {
              //
              broadCastToDriver(possibleDrivers[i][1].socket, "user-trip", data_response);
              console.log("broadcasting to driver ".concat(possibleDrivers[i]));
              i++;
              if (i >= possibleDrivers.length) {
                setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
                  var dat;
                  return _regeneratorRuntime().wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                      case 0:
                        dat = {
                          trip_id: trip_id,
                          status: "Waiting"
                        };
                        _context.next = 3;
                        return _tripService["default"].UpdateTrip(dat);
                      case 3:
                      case "end":
                        return _context.stop();
                    }
                  }, _callee);
                })), 15000);

                //notify user that no driver has been found
              }
            }, 15000);
            rdTripKey = "trip_id:".concat(trip_id);
            TripData = {
              user_id: user.user_id,
              start: data.start,
              end: data.end,
              driver_id: null,
              date_reserved: new Date(),
              cancellable: true
            };
            trips.set(trip_id, TripData);
            TripData = JSON.stringify(TripData);
            _context2.next = 21;
            return rd.set(rdTripKey, TripData);
          case 21:
            console.log(TripData);
            current_intervals.set(trip_id, new_interval);
          case 23:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    return function (_x2) {
      return _ref4.apply(this, arguments);
    };
  }());
};
var handleDriverResponseBooking = function handleDriverResponseBooking(socket) {
  socket.on('driver-response-booking', /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(data) {
      var driver, dat_ex, trip_id, driver_data, data_foundDriver, updatedTrip;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            driver = getDriverBySocket(socket);
            dat_ex = {
              trip_id: trip_id,
              agree_status: 'accept' || 'deny'
            };
            trip_id = data.trip_id;
            if (!(data.agree_status == 'deny')) {
              _context3.next = 5;
              break;
            }
            return _context3.abrupt("return");
          case 5:
            _context3.next = 7;
            return _driverServices["default"].GetDriverInfoById(driver.user_id);
          case 7:
            driver_data = _context3.sent;
            data_foundDriver = {
              trip_id: trip_id,
              driver: JSON.stringify(driver_data),
              message: "found driver"
            };
            if (data.agree_status == 'accept') {
              io.to("/trip/".concat(trip_id)).emit('found-driver', data_foundDriver);
              //notify user
              socket.join("/trip/".concat(trip_id));
              updatedTrip = trips.get(trip_id);
              updatedTrip.driver = socket.id;
              trips.set(trip_id, updatedTrip);
              clearInterval(current_intervals.get(trip_id)); //stop broadcasting
              current_intervals["delete"](trip_id);
              // let user = trips.get(data.trip_id).user // socket.id
              // broadCastToUser(user,)
            }
          case 10:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    return function (_x3) {
      return _ref6.apply(this, arguments);
    };
  }());
};
var handleLocationUpdate = function handleLocationUpdate(socket) {
  socket.on('driver-location-update', function (data) {
    var dat = {
      lat: data.lat,
      lng: data.lng
    };
    var driver = getDriverBySocket(socket);
    var driver_id = driver.user_id;
    var socket_ids = GetSocketByDriverId(driver_id);
    for (var i = 0; i < socket_ids.length; i++) {
      drivers.get(socket_ids[i]);
    }
  });
};
var getTripIfDisconnected = function getTripIfDisconnected(id) {
  var _iterator2 = _createForOfIteratorHelper(trips),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _step2$value = _slicedToArray(_step2.value, 2),
        _trip_id = _step2$value[0],
        value = _step2$value[1];
      if (value.user_id == id || value.driver_id == id) {
        return _trip_id;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return null;
};
var getUserBySocket = function getUserBySocket(socket) {
  var id = socket.id;
  var socket_value = users.get(id);
  return socket_value;
  // this will return a socket value { socket: socket for client, user_id, socket_id}
};

var getDriverBySocket = function getDriverBySocket(socket) {
  var id = socket.id;
  var socket_value = drivers.get(id);
  return socket_value;
  //similar to get user by socket
};

var broadCastToUser = function broadCastToUser(socket, event, data) {
  var socket_value = users.get(socket.id);
  console.log(socket_value.socket);
  if (socket_value === null) {
    throw new Error("user socket error");
  }
  socket_value.socket.emit(event, data);
};
var GetSocketByUserId = function GetSocketByUserId(user_id) {
  var socketArr = [];
  var _iterator3 = _createForOfIteratorHelper(users),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _step3$value = _slicedToArray(_step3.value, 2);
      socket_id = _step3$value[0];
      socket_value = _step3$value[1];
      if (socket_value.user_id == user_id) {
        socketArr.push(socket_id);
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return socketArr;
};
var GetSocketByDriverId = function GetSocketByDriverId(driver_id) {
  var socketArr = [];
  var _iterator4 = _createForOfIteratorHelper(drivers),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var _step4$value = _slicedToArray(_step4.value, 2);
      socket_id = _step4$value[0];
      socket_value = _step4$value[1];
      if (socket_value.user_id == driver_id) {
        socketArr.push(socket_id);
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return socketArr;
};
var broadCastToDriver = function broadCastToDriver(socket, event, data) {
  var socket_value = drivers.get(socket.id);
  if (socket_value === null) {
    throw new Error("driver socket error");
  }
  socket_value.socket.emit(event, data);
};
var getUsersBySocket = function getUsersBySocket(socket) {
  if (users.get(socket.id) !== null) {
    return users.get(socket.id);
  } else return drivers.get(socket.id);
};
var handleTripUpdate = function handleTripUpdate() {};
var handleDisconnect = function handleDisconnect(socket) {
  socket.on('disconnect', function () {
    if (users.get(socket.id)) {
      users["delete"](socket.id);
    } else {
      drivers["delete"](socket.id);
    }
    // users.delete(socket.id)
    console.log("client disconnected " + socket.id);
  });
};
var _default = initSocket;
exports["default"] = _default;