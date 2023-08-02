"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function getDistance(lat1, lng1, lat2, lng2) {
  var R = 6371; // Bán kính Trái Đất trong km
  var dLat = toRad(lat2 - lat1);
  var dLng = toRad(lng2 - lng1);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c;
  return distance;
}
function toRad(value) {
  return value * Math.PI / 180;
}
var findPossibleDriver = function findPossibleDriver(drivers, place) {
  var lat = place.lat;
  var lng = place.lng;
  var possibleDriver = Array.from(drivers);
  possibleDriver.sort(function (a, b) {
    if (a.status == 'idle' && b.status != 'idle') {
      return 1;
    }
    // else if (b.status == 'idle' && a.status != 'idle') {
    //     return -1
    // }
    if (getDistance(a[1].lat, a[1].lng, lat, lng) > getDistance(b[1].lat, b[1].lng, lat, lng)) {
      return 1;
    } else {
      return -1;
    }
  });
  return possibleDriver;
};
var _default = {
  getDistance: getDistance,
  toRad: toRad,
  findPossibleDriver: findPossibleDriver
};
exports["default"] = _default;