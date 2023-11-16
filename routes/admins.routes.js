import express from "express";
import Admin from "../model/Admin.js";
import User from "../model/User.js";
import { deleteUser } from "../controllers/user-db.controller.js";
import { encryptPassword, objectDepuration } from "../helpers/helpers.js";
import { registerUser, registerAdmin } from "../controllers/user-db.controller.js";

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { username, password, email, profile_picture = undefined, entity_name, deposit_address, deposit_qr } = req.body
        let newUser = new User(username, await encryptPassword(password), email, profile_picture)
        let newAdmin = new Admin(username, entity_name, deposit_address, deposit_qr)
        objectDepuration(newUser)
        objectDepuration(newAdmin)
        await registerUser(newUser)
        await registerAdmin(newAdmin)
        res.status(200).json(`Admin registered: ${username}`)
    } catch(err) {
        console.log(err.code)
        if(err.code != 'ER_DUP_ENTRY' ) deleteUser(req.body.username)
        console.error(err)
        res.status(400).json(`Error registering admin: ${err.message}`)
    }
})


export default router