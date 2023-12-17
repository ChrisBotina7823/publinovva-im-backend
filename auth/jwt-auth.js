import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { invalidPassword, userNotFound } from '../helpers/exceptions.js'
import { errorHandler } from '../middlewares/login-md.js'
import { checkPassword } from '../helpers/encryption.js'
config()

const loginUser = async (req, res, getUser) => {
    try {
        const { username, password } = req.body;
        const info = { username, password }
        const user = await getUser(info.username)
    
        if(!user) userNotFound(info.username)
        const match = await checkPassword(info.password, user.password)

        if(!match) invalidPassword(info.username)
        const token = jwt.sign(user.toObject(), process.env.USER_SECRET, { expiresIn: '100y' })
        
        if(user.account_state && user.account_state == "suspendido") throw new Error(`La cuenta ${username} se encuentra suspendida, contáctate con el administrador.`)

        req.headers.token = token;
        res.json({
            message: `Welcome ${username}`,
            token: token,
            user: user
        });
    } catch (err) {
        errorHandler(res, err);
    }
};


export {
    loginUser
}