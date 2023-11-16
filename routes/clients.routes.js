import express from 'express'
import { objectDepuration, encryptPassword } from '../helpers/helpers.js'
import { deleteUser, registerClient, registerUser } from '../controllers/user-db.controller.js'
import Client from '../model/Client.js'
import User from '../model/User.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { username, password, email, profile_picture = undefined, fullname, country, phone, admin_username } = req.body
        let newUser = new User(username, await encryptPassword(password), email, profile_picture)
        let newClient = new Client(username, fullname, country, phone, admin_username)
        objectDepuration(newUser)
        objectDepuration(newClient)
        await registerUser(newUser)
        await registerClient(newClient)
        res.status(200).json(`Client registered: ${username}`)
    } catch(err) {
        if(err.code != 'ER_DUP_ENTRY' ) deleteUser(req.body.username)
        console.error(err)
        res.status(400).json(`Error registering client: ${err.message}`)
    }
})

export default router