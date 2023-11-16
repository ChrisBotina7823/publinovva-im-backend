import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { getUserByUsername, getAdminByUsername, getClientByUsername } from '../controllers/user-db.controller.js'
import { config } from 'dotenv'
config()

const userSignIn = async info => {
    const user = await getUserByUsername(info.username)
    if(!user) return undefined
    const match = await bcrypt.compareSync(info.password, user.password)
    return match ? jwt.sign(user, process.env.USER_SECRET, { expiresIn: '48h' }) : undefined
}

const adminSignIn = async info => {
    const user = await getAdminByUsername(info.username)
    if(!user) return undefined
    const match = await bcrypt.compareSync(info.password, user.password)
    return match ? jwt.sign(user, process.env.USER_SECRET, { expiresIn: '48h' }) : undefined
}

const clientSignIn = async info => {
    const user = await getClientByUsername(info.username)
    if(!user) return undefined
    const match = await bcrypt.compareSync(info.password, user.password)
    return match ? jwt.sign(user, process.env.USER_SECRET, { expiresIn: '48h' }) : undefined
}

export {
    userSignIn,
    adminSignIn,
    clientSignIn
}