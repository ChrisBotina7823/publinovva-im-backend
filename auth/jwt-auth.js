import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { config } from 'dotenv'
import { invalidPassword, userNotFound } from '../helpers/exceptions.js'
import { errorHandler } from '../middlewares/login-md.js'
config()

const loginUser = async (req, res, getUser) => {
    try {
        const { username, password } = req.body;
        const info = { username, password }
        const user = await getUser(info.username)
    
        if(!user) userNotFound(info.username)
        const match = await bcrypt.compareSync(info.password, user.password)

        if(!match) invalidPassword(info.username)
        const token = jwt.sign(user.toObject(), process.env.USER_SECRET, { expiresIn: '48h' })
        
        req.headers.token = token;
        res.json({
            message: `Welcome ${username}`,
            token: token
        });
    } catch (err) {
        errorHandler(res, err);
    }
};


export {
    loginUser
}