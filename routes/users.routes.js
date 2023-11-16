import express from 'express'
import { registerUser } from '../controllers/user-db.controller.js'
import bcrypt from 'bcrypt'
import User from '../model/User.js'
import { config } from 'dotenv'
config()

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const {username, password, email, profile_picture = undefined} = req.body
        const newUser = new User(username, await bcrypt.hash(password, parseInt(process.env.SALT_NUMBER)), email, profile_picture)
        if(!profile_picture) delete newUser.profile_picture
        await registerUser(newUser)
        res.json(newUser)
    } catch(err) {
        console.error(err)
        res.status(400).json(`Error registering user: ${err.message}`)
    }
})

export default router