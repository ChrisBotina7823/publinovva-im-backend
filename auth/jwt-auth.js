import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { invalidPassword, userNotFound, suspendedUser } from '../helpers/exceptions.js'
import { errorHandler } from '../middlewares/login-md.js'
import { checkPassword } from '../helpers/encryption.js'
config()

const loginUser = async (req, res, getUser) => {
    try {
        const { username, password } = req.body;
        const { admin_id } = req.params;
        const info = { username, password }
        const user = admin_id ? await getUser(info.username, admin_id) : await getUser(info.username)

        if (!user) userNotFound(info.username)
        const match = await checkPassword(info.password, user.password)

        if (!match) invalidPassword(info.username)
        if (user.suspended) suspendedUser(info.username)
        
        const version = user.passwordVersion || 0;
        const token = jwt.sign({ ...user.toObject(), version }, process.env.USER_SECRET, { expiresIn: '24h' })

        if (user.account_state && user.account_state == "suspendido") throw new Error(`La cuenta ${username} se encuentra suspendida, contáctate con el administrador.`)
        
        if(req.body.login_code) {
            if(req.body.login_code != user.login_code) throw new Error("Código de inicio de sesión incorrecto");
            req.headers.token = token;
            res.json({
                message: `Welcome ${username}`,
                token: token,
                user: user
            });
        } else {
            const login_code = Math.random().toString(36).substring(5).toUpperCase();
            user.login_code = login_code;
            user.save();
            res.json({"login_code": login_code});
        } 
    } catch (err) {
        errorHandler(res, err);
    }
};


export {
    loginUser
}