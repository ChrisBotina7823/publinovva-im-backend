import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { getUserByUsername } from '../controllers/user-db.controller.js'
import { config } from 'dotenv'
config()

const userSignIn = async info => {
    const user = await getUserByUsername(info.username)
    const match = await bcrypt.compareSync(info.password, user.password)
    return match ? jwt.sign(user, process.env.USER_SECRET, { expiresIn: '48h' }) : undefined
}

export {
    userSignIn
}