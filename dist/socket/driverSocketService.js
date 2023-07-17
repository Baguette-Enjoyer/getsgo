"use strict";

var drivers = new Map();
var driver1 = {
  lat: 10.1234,
  lng: 20.5678
};
var driver2 = {
  lat: 10.9823,
  lng: 20.2091
};
var driver3 = {
  lat: 9.8274,
  lng: 19.9013
};
var driver4 = {
  lat: 10.6928,
  lng: 21.3749
};
var driver5 = {
  lat: 10.3816,
  lng: 21.9684
};
var driver6 = {
  lat: 9.2576,
  lng: 21.8427
};
var driver7 = {
  lat: 10.6359,
  lng: 19.7582
};
var driver8 = {
  lat: 9.5001,
  lng: 19.3279
};
var driver9 = {
  lat: 10.8942,
  lng: 19.6785
};
var driver10 = {
  lat: 9.7635,
  lng: 20.1239
};
var user1 = {
  lat: 10.1234,
  lng: 20.5678
};
drivers.set('driver1', driver1);
drivers.set('driver2', driver2);
drivers.set('driver3', driver3);
drivers.set('driver4', driver4);
drivers.set('driver5', driver5);
drivers.set('driver6', driver6);
drivers.set('driver7', driver7);
drivers.set('driver8', driver8);
drivers.set('driver9', driver9);
drivers.set('driver10', driver10);
var getDistance = function getDistance(lat1, lng1, lat2, lng2) {
  var R = 6371; // Bán kính Trái Đất trong km
  var dLat = toRad(lat2 - lat1);
  var dLng = toRad(lng2 - lng1);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c;
  return distance;
};
function toRad(value) {
  return value * Math.PI / 180;
}
var findAndBroadcastToDriver = function findAndBroadcastToDriver(place) {
  return new Promise(function (resolve, reject) {
    var lat = place.latitude;
    var lng = place.longtitude;
    var possibleDriver = Array.from(drivers);
    setTimeout(function () {
      possibleDriver.sort(function (a, b) {
        getDistance(a.lat, a.lng, lat, lng) - getDistance(b.lat, b.lng, lat, lng);
      });
      var resultDrivers = possibleDriver.slice(0, 5);
      resolve(resultDrivers);
    }, 0);
  });
};