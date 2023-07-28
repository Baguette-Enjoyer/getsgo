import db from '../models/index'
import bcrypt from "bcryptjs"
import { resolve } from "path";
import jwtService from './jwtService';
import { Op, where } from 'sequelize'
import initServer from './initServer';
import { test } from '../socket/socketServiceTS'
const salt = bcrypt.genSaltSync(10);


let RegisterUser = async (data) => {
  let phone = data.phone
  let user = await db.User.findOne({
    where: {
      phone: {
        [Op.eq]: phone,
      },
    }
  })
  if (user != null) throw new Error("Phone existed")

  let pwd = data.password
  let hash = await hashUserPassword(pwd)
  try {
    let user = await db.User.create({
      // name: data.name,
      phone: phone,
      password: hash,
      // gender: data.gender,
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
    return {
      user_id: user.id,
      message: "User created",
      phone: phone,
      accessToken: token,
    }
  } catch (error) {
    throw new Error("error registering")
  }
}

let LoginUser = async (data) => {
  let phone = data.phone
  let password = data.password
  let user = await db.User.findOne({
    where: {
      phone: {
        [Op.eq]: phone,
      },
    }
  })
  if (user == null) throw new Error("Couldnt find phone")
  if (user.password == null) throw new Error("Require password")

  let hashPassword = user.password
  let result = await comparePassword(password, hashPassword)
  if (!result) {
    throw new Error("Wrong password")
  }
  let token = user.accessToken
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
  return {
    user_id: user.id,
    phone: user.phone,
    type: user.type,
    accessToken: token,
  }
}

let GetUserByPhone = async (phone) => {
  let user = await db.User.findOne({
    where: {
      phone: {
        [Op.eq]: phone,
      },
    }
  })
  if (user != null) {
    return user
  }
  else if (user != null && user.password == null) {
    // resolve({
    //   error: "Require Register"
    // })
    throw new Error("Require Register")
  }
  else {
    // return resolve({
    //   error: "Phone Number Not Found"
    // })
    throw new Error("Phone Number Not Found")
  }
}

let CreateUserIfNotExist = async (phone) => {
  return new Promise(async (resolve, reject) => {
    // let phone = data.phone
    let existedUser = await db.User.findOne({
      where: {
        phone: phone
      }
    })
    if (existedUser != undefined) {
      return resolve(existedUser)
    }
    let user = await db.User.create({
      phone: phone,
      active: true,
      type: "User"
    })
    // console.log(first)
    return resolve(user)
  })
}

let UpdatePassword = async (data) => {
  return new Promise(async (resolve, reject) => {
    let id = data.user_id
    let phone = data.phone
    let type = data.type
    let newPassword = data.password
    // let user = await GetUserByPhone(phone)
    let token = await jwtService.GenerateAccessToken(id, phone, type)
    let hashPwd = await hashUserPassword(newPassword)

    await db.User.update(
      {
        password: hashPwd,
        accessToken: token,
      },
      {
        where: {
          id: id,
        }
      }
    ).catch(err => {
      throw err
    })
    return resolve({
      user_id: id,
      phone: phone,
      type: type,
      accessToken: token
    })

  })
}

let GetUserById = async (user_id) => {
  let user = await db.User.findOne({
    where: {
      id: user_id,
    }
  })
  if (user.id == null) {
    throw new Error('user not found')
  }
  return user
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
  GetUserById,
  CreateUserIfNotExist,
  UpdatePassword,
}
