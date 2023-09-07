import db from '../models/index'
import bcrypt from "bcryptjs"
import { resolve } from "path";
import jwtService from './jwtService';
import { Op, where } from 'sequelize'
import initServer from './initServer';
// import { test } from '../socket/socketServiceTS'
const salt = bcrypt.genSaltSync(10);

const getBasicUserInfo = async (user_id) => {
  const data = await db.User.findOne({
    where: { id: user_id },
    attributes: ['name', 'phone', 'avatar', 'id', 'token_fcm', 'type'],
  })
  return data
}

const RegisterUser = async (data) => {
  const phone = data.phone
  const user = await db.User.findOne({
    where: {
      phone: {
        [Op.eq]: phone,
      },
    }
  })
  if (user != null) throw new Error("Phone existed")

  const pwd = data.password
  const hash = await hashUserPassword(pwd)
  try {
    let newuser = await db.User.create({
      name: data.name,
      phone: phone,
      password: hash,
      email: data.email,
      // gender: data.gender,
      active: true,
      type: "User"
    })
    // const token = await jwtService.GenerateAccessToken(newuser.id, phone, "User")
    // await db.User.update({
    //   accessToken: token
    // }, {
    //   where: {
    //     id: newuser.id
    //   }
    // })
    console.log(newuser)
    return {
      user_id: newuser.id,
      message: "User created",
      phone: phone,
      // accessToken: token,
    }
  } catch (error) {
    throw new Error("error registering")
  }
}

const LoginUser = async (data) => {
  const phone = data.phone
  const password = data.password
  const token_fcm = data.token_fcm
  const user = await db.User.findOne({
    where: {
      phone: {
        [Op.eq]: phone,
      },
    }
  })
  if (user == null) throw new Error("Couldnt find phone")
  if (user.password == null) throw new Error("Require password")

  let result = await comparePassword(password, user.password)
  if (!result) {
    throw new Error("Wrong password")
  }
  let token = user.accessToken
  const verifyToken = await jwtService.VerifyToken(token)
  if (verifyToken.result == false || token == null) {
    token = await jwtService.GenerateAccessToken(user.id, user.phone, user.type)
    await db.User.update({
      accessToken: token,
      token_fcm: token_fcm
    },
      {
        where: {
          id: user.id
        }
      })
  }
  else {
    await db.User.update({
      token_fcm: token_fcm
    },
      {
        where: {
          id: user.id
        }
      })
  }
  console.log(user);
  return {
    user_id: user.id,
    phone: user.phone,
    name: user.name,
    avatar: user.avatar,
    type: user.type,
    accessToken: token,
  }
}

const GetUserByPhone = async (phone) => {
  const user = await db.User.findOne({
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
    throw new Error("Require Register")
  }
  else {
    throw new Error("Phone Number Not Found")
  }
}

export const CreateUserIfNotExist = async (phone) => {
  return new Promise(async (resolve, reject) => {
    // let phone = data.phone
    const existedUser = await db.User.findOne({
      where: {
        phone: {
          [Op.eq]: phone,
        },
      }
    })
    if (existedUser != undefined) {
      return resolve(existedUser)
    }
    const user = await db.User.create({
      phone: phone,
      active: true,
      type: "User"
    })
    // console.log(first)
    return resolve(user)
  })
}

const UpdatePassword = async (data) => {
  return new Promise(async (resolve, reject) => {
    const id = data.user_id
    const phone = data.phone
    const type = data.type
    const newPassword = data.password
    // let user = await GetUserByPhone(phone)
    const token = await jwtService.GenerateAccessToken(id, phone, type)
    const hashPwd = await hashUserPassword(newPassword)

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

const GetUserById = async (user_id) => {
  const user = await db.User.findOne({
    where: {
      id: user_id,
    },
    nest: true,
    raw: true
  })
  if (user.id == null) {
    throw new Error('user not found')
  }
  return user
}


const hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassWord = await bcrypt.hashSync(password, salt);
      resolve(hashPassWord);
    } catch (e) {
      reject(e);
    }
  });
};

const comparePassword = (password, hash) => {
  return new Promise(async (resolve, reject) => {
    const result = await bcrypt.compare(password, hash)
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
  getBasicUserInfo
}
