import jwt from "jsonwebtoken"

require('dotenv').config()

const GenerateAccessToken = (id,phone,type) =>{
    return new Promise((resolve, reject) => {
        const data = {
        id:id,
        phone:phone,
        type:type,
        }
        jwt.sign(
            data,
            process.env.SECRET_KEY,
            {
                expiresIn:'300h',
            },function (err,token){
                if (err){
                    reject(err)
                }
                resolve(token)
            }
        )
    })
    
}

const VerifyToken = (token) =>{
    return new Promise((resolve, reject) => { 
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        if (err){
            resolve({
                result: false,
                message:err.message,
                decoded:""
            })
        }
        else {
            resolve({
            result:true,
            message:"ok",
            decoded:decoded,
        })}

    })
     })
    
}
export default {GenerateAccessToken,VerifyToken}