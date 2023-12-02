import { config } from "dotenv"
import bcrypt from 'bcrypt'
import crypto from 'crypto'
config()

const encryptPassword = async password => {
    return await bcrypt.hash(password, parseInt(process.env.SALT_NUMBER))
}

const generateToken = () => {
    return crypto.randomBytes(20).toString('hex')
}

const checkPassword = async (password, original) => {
    return await bcrypt.compareSync(password, original)
}

export {
    encryptPassword,
    generateToken,
    checkPassword
}