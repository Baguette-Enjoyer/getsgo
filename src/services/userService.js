import db from '../models/index'
import bcrypt from "bcryptjs"
import { resolve } from "path";
import jwtService from './jwtService';

const salt = bcrypt.genSaltSync(10);

let Checkuser = async (data) => {
  return new Promise((resolve, reject) => { first })
}

let RegisterUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    console.log(data)
    let phone = data.phone
    let checkUser = await GetUserByPhone(phone)
    if (checkUser != null) {
      return resolve({
        statusCode: 400,
        message: "Phone existed",
      })
    }

    let pwd = data.password
    let hash = await hashUserPassword(pwd)
    try {
      let user = await db.User.create({
        name: data.name,
        phone: phone,
        password: hash,
        gender: data.gender,
        birthday: new Date(),
        avatar: data.avatar,
        active: true,
        type: "User"
      })
      let token = await jwtService.GenerateAccessToken(user.id, phone, "User")
      await db.User.update({
        accessToken: token
      }, {
        where: {
          id: user.id
        }
      })
      return resolve({
        statusCode: 200,
        message: "User created",
        phone: phone,
        accessToken: token,
      })
    } catch (error) {
      reject(new Error("error registering"))
    }
    // let avatarURL = 'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'

  })
}

let LoginUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    let phone = data.phone
    let password = data.password
    let checkUser = await GetUserByPhone(phone)
    if (checkUser == null) {
      return resolve({
        statusCode: 500,
        message: "Phone not exist",
      })
    }
    let hashPassword = checkUser.password
    let result = await comparePassword(password, hashPassword)
    if (!result) {
      return resolve({
        statusCode: 500,
        message: "wrong password",
      })
    }
    let token = checkUser.accessToken
    // if (token == null){
    //   token = await jwtService.GenerateAccessToken(checkUser.id,checkUser.phone,checkUser.type)
    // await db.User.update({
    //     accessToken:token
    //   },{
    //     where: {
    //       id: checkUser.id
    //     }
    //   })
    // }
    let verifyToken = await jwtService.VerifyToken(token)
    if (verifyToken.result == false || token == null) {
      token = await jwtService.GenerateAccessToken(checkUser.id, checkUser.phone, checkUser.type)
      await db.User.update({
        accessToken: token
      },
        {
          where: {
            id: checkUser.id
          }
        })
    }

    return resolve({
      statusCode: 200,
      user_info: {
        user_id: checkUser.id,
        phone: checkUser.phone,
        type: checkUser.type,
        accessToken: token,
      }
    })
  })
}

let GetUserByPhone = async (phone) => {
  return new Promise(async (resolve, reject) => {
    let user = await db.User.findOne({
      where: {
        phone: phone,
      }
    })
    if (user) {
      resolve(user)
    }
    else {
      resolve(null)
    }
  })
}

let GetUserById = async (user_id) => {
  return new Promise(async (resolve, reject) => {
    let user = db.User.findOne({
      where: { id: user_id }
    })
    if (user) {
      resolve(user)
    }
    else {
      resolve(null)
    }
  })
}


let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassWord = await bcrypt.hashSync(password, salt);
      resolve(hashPassWord);
    } catch (e) {
      reject(e);
    }
  });
};

let comparePassword = (password, hash) => {
  return new Promise(async (resolve, reject) => {
    let result = await bcrypt.compare(password, hash)
    resolve(result)
  })
}

//forgot password

export default {
  LoginUser,
  RegisterUser,
  GetUserByPhone,
}
