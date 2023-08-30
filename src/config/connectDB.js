import { Sequelize } from "sequelize";
require('dotenv').config()
const DB_NAME = process.env.DB_NAME
const DB_USN = process.env.DB_USN
const DB_PWD = process.env.DB_PWD

let sequelize = new Sequelize(DB_NAME, DB_USN, DB_PWD, {
  host: process.env.HOST,
  dialect: "mysql",
  "port": process.env.DB_PORT,
  "dialectOptions": {
    // "ssl": {
    //   "required": false,
    //   "rejectUnauthorized": false
    // }
    "ssl": false
  },

});
// let sequelize_dev = new Sequelize(DB_NAME, DB_USN, DB_PWD, {
//   host: process.env.HOST,
//   dialect: "mysql",
// });

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log("Connected to db")
  } catch (error) {
    console.log(error)
    console.log("Failed to connect")
  }

}
export default connectDB;

