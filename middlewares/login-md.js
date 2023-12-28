import jwt from 'jsonwebtoken'

import { config, parse } from 'dotenv'
import { parseUsername } from '../helpers/object-depuration.js'
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

const isAdminLogged = async (req, res, next) => {
    if(req.user.__t && req.user.__t != "Admin") {
        res.status(401).json("You must have admin permissions to make this request")
    } else {
        next()
    }
}

const isSuperUserLogged = async (req, res, next) => {
    if(req.user.__t) {
        res.status(401).json("You must have super user permissions to make this request")
    } else {
        next()
    }
}

const errorHandler = (res, err) => {
    console.error(err);
    res.status(400).json({ error: err.message });
};

const parseUsernameMD = (req, res, next) => {
    const { username: usernameBody = undefined } = req.body
    const { username: usernameParams = undefined, prevUsername = undefined } = req.params
    if(usernameBody) req.body.username = parseUsername(usernameBody)
    if(usernameParams) req.params.username = parseUsername(usernameParams)
    if(prevUsername) req.params.prevUsername = parseUsername(prevUsername)
    next()
}

export {
    isUserLogged,
    isAdminLogged,
    isSuperUserLogged,
    errorHandler,
    parseUsernameMD
}