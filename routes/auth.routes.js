import express from 'express'
import { userSignIn } from '../auth/jwt-auth.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body
        const token = await userSignIn({username, password})
        res.json(token)
    } catch(err) {
        console.error("Invalid request")
        res.send()
    }
})

export default router
 