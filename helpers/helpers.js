import { config } from "dotenv"
import bcrypt from 'bcrypt'
config()

const objectDepuration = obj => {
    Object.keys(obj).forEach( k => obj[k] === undefined && delete obj[k] )
}

const encryptPassword = async password => {
    console.log(process.env.SALT_NUMBER)
    return await bcrypt.hash(password, parseInt(process.env.SALT_NUMBER))
}

export {
    objectDepuration,
    encryptPassword
}