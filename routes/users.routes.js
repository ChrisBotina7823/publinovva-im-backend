import express from 'express'
import User from '../model/User.js'
import { deleteUser, registerUser, updateUser } from '../controllers/user-db.controller.js'
import { objectDepuration, encryptPassword } from '../helpers/helpers.js'

const router = express.Router()

router
.post('/', async (req, res) => {
    try {
        const {username, password, email, profile_picture = undefined} = req.body
        let newUser = new User(username, await encryptPassword(password), email, profile_picture)
        objectDepuration(newUser)
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
        let newUser = new User(username, password ? await encryptPassword(password) : password, email, profile_picture)
        objectDepuration(newUser)
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