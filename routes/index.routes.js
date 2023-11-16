import express from 'express'
const router = express.Router()

// TODO: Remove when finish
import Client from '../model/Client.js'
import User from '../model/User.js'
import Admin from '../model/Admin.js'
import db from '../db/db-connection.js'
import { isUserLogged } from '../middlewares/login-md.js'


router.get('/', isUserLogged, async (req, res) => {
    // TODO: Remove when finishing
    const newClient = new Client("ChrisBotina23", "123", "criedboca@gmail.com", undefined, "Cristian Eduardo Botina", "Colombia", "+573128265879")
    const newUser = new User("publinovva", "publinovva123", "ventas@publinovva.com", "publinovva-logo.jpg")
    const newAdmin = new Admin("transito", "transito123", "transito@gmail.com", undefined, "transito", "1234", undefined)

    const [ rows ] = await db.promise().query("show tables")

    res.json({
        "client": newClient,
        "admin": newAdmin,
        "user": newUser,
        "response": rows
    })
})

export default router