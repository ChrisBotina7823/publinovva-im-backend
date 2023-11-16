import express from 'express'
import { userSignIn } from '../auth/jwt-auth.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body
        const token = await userSignIn({username, password})
        if(token) {
            res.json(token)
        } else {
            res.status(401).json(`Access denied for ${username}`)
        }
    } catch(err) {
        console.error(err)
        res.status(400).json(`Error in logging in request: ${err.message}`)
    }
})

export default router
 