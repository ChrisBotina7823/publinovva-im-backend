import jwt from 'jsonwebtoken'

import { config } from 'dotenv'
config()

const isUserLogged = async (req, res, next) => {
    const { token } = req.headers
    if (!token) return res.status(401).json('Unauthorized user')
    try {
        const decoded = jwt.verify(token, process.env.USER_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        console.error(err)
        res.status(401).json('Token not valid')
    } 
}

export {
    isUserLogged
}