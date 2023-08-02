'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var process = require('process');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var db = {};
require('dotenv').config();
var sequelize;
var DB_NAME = process.env.DB_NAME;
var DB_USN = process.env.DB_USN;
var DB_PWD = process.env.DB_PWD;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // sequelize = new Sequelize(config.database, config.username, config.password, config);
  // console.log(config)
  // let config2 = {
  //   username: process.env.DB_USN,
  //   password: process.env.DB_PWD,
  //   database: process.env.DB_NAME,
  //   host: process.env.HOST,
  //   port: process.env.DB_PORT,
  //   dialectOptions: { ssl: { required: true, rejectUnauthorized: false } },
  //   dialect: 'mysql'
  // }
  // sequelize = new Sequelize(config2.database, config2.username, config2.password, config2);
  sequelize = new Sequelize(DB_NAME, DB_USN, DB_PWD, {
    host: process.env.HOST,
    dialect: "mysql",
    "port": process.env.DB_PORT,
    "dialectOptions": {
      "ssl": {
        "required": true,
        "rejectUnauthorized": false
      }
    }
  });
  // let config_dev = {
  //   username: process.env.DB_USN,
  //   password: process.env.DB_PWD,
  //   database: process.env.DB_NAME,
  //   host: process.env.HOST,
  //   dialect: 'mysql',
  //   port: process.env.PORT,
  // }
  // sequelize = new Sequelize("getgo_test", "long3112", "3112", {
  //   host: process.env.HOST,
  //   dialect: "mysql",
  // })
}

fs.readdirSync(__dirname).filter(function (file) {
  return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file.indexOf('.test.js') === -1;
}).forEach(function (file) {
  var model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});
Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// module.exports = db;
var _default = db;
exports["default"] = _default;