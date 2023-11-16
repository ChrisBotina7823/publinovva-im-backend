import express from 'express'
const router = express.Router()
import { isUserLogged } from '../middlewares/login-md.js'


router.get('/', isUserLogged, async (req, res) => {
    res.json(req.user)
})

export default router