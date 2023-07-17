import { Sequelize } from "sequelize";
require('dotenv').config()
const DB_NAME = process.env.DB_NAME
const DB_USN = process.env.DB_USN
const DB_PWD = process.env.DB_PWD

let sequelize = new Sequelize(DB_NAME, DB_USN, DB_PWD, {
  host: "db-mysql-sgp1-79566-do-user-14291271-0.b.db.ondigitalocean.com",
  dialect: "mysql"
});

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log("Connected to db")
  } catch (error) {
    console.log("Failed to connect")
  }

}
export default connectDB;

