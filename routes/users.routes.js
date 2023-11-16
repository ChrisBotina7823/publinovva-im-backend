import express from 'express'
import { deleteUser, registerUser, updateUser } from '../controllers/user-db.controller.js'
import bcrypt from 'bcrypt'
import User from '../model/User.js'
import { config } from 'dotenv'
config()

const router = express.Router()

router
.post('/', async (req, res) => {
    try {
        const {username, password, email, profile_picture = undefined} = req.body
        const newUser = new User(username, await bcrypt.hash(password, parseInt(process.env.SALT_NUMBER)), email, profile_picture)
        if(!profile_picture) delete newUser.profile_picture
        await registerUser(newUser)
        res.status(200).json(`User registered: ${username}`)
    } catch(err) {
        console.error(err)
        res.status(400).json(`Error registering user: ${err.message}`)
    }
})
.put('/', async (req, res) => {
    try {
        const {username, password, email, profile_picture = undefined} = req.body
        const newUser = new User(username, password ? await bcrypt.hash(password, parseInt(process.env.SALT_NUMBER)) : password, email, profile_picture)
        Object.keys(newUser).forEach( key => newUser[key] === undefined && delete newUser[key] )
        await updateUser(newUser)
        res.status(200).json(`User updated: ${username}`)
    } catch(err) {
        console.error(err)
        res.status(400).json(`Error updating user: ${err.message}`)
    }
})
.delete('/:username', async (req, res) => {
    try {
        const {username} = req.params
        await deleteUser(username)
        res.status(200).json(`Deleted user ${username}`)
    } catch(err) {
        console.log(err)
        res.status(400).json(`Error deleting user: ${err.message}`)
    }
})

export default router