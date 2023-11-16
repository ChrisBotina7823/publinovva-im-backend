import express from 'express'
import { userSignIn, adminSignIn, clientSignIn } from '../auth/jwt-auth.js'

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body
        const token = await userSignIn({username, password})
        if(token) {
            req.headers.token = token
            res.json({
                "message":`Welcome ${username}`,
                "token": token
            })
        } else {
            res.status(401).json(`Superuser access denied for ${username}`)
        }
    } catch(err) {
        console.error(err)
        res.status(400).json(`Error in logging in request: ${err.message}`)
    }
})

router.post('/client', async (req, res) => {
    try {
        const { username, password } = req.body
        const token = await clientSignIn({username, password})
        if(token) {
            req.headers.token = token
            res.json({
                "message":`Welcome ${username}`,
                "token": token
            })
        } else {
            res.status(401).json(`Client access denied for ${username}`)
        }
    } catch(err) {
        console.error(err)
        res.status(400).json(`Error in logging in request: ${err.message}`)
    }
})

router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body
        const token = await adminSignIn({username, password})
        if(token) {
            req.headers.token = token
            res.json({
                "message":`Welcome ${username}`,
                "token": token
            })
        } else {
            res.status(401).json(`Admin access denied for ${username}`)
        }
    } catch(err) {
        console.error(err)
        res.status(400).json(`Error in logging in request: ${err.message}`)
    }
})

export default router
 