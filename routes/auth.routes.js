import express from 'express';
import { loginUser } from '../auth/jwt-auth.js';
import { getSuperUserByUsername, getUserByUsername, getUserByRecoveryToken, updateUser } from '../controller/user-controller.js';
import { getClientByKey, insertClient } from '../controller/client-controller.js';
import { getAdminByUsername } from '../controller/admin-controller.js';
import { encryptPassword, generateToken } from '../helpers/encryption.js';
import { sendEmail } from '../helpers/email-manager.js';
import { errorHandler } from '../middlewares/login-md.js';
import { userNotFound } from '../helpers/exceptions.js';
import { boldStyle, welcomeMessage } from '../helpers/messages.js';
import { header } from '../helpers/html_templates/welcome-header.js';

const router = express.Router();

router.post('/', async (req, res) => {
    await loginUser(req, res, getUserByUsername);
})

router.post('/superuser', async (req, res) => {
    await loginUser(req, res, getSuperUserByUsername);
});

router.post('/client/:admin_id', async (req, res) => {
    await loginUser(req, res, getClientByKey);
});

router.post('/admin', async (req, res) => {
    await loginUser(req, res, getAdminByUsername);
});

router.post('/registration', async (req, res) => {
    try {
        const client = await insertClient(req, true)
        req.io.emit("clientsUpdate")
        res.status(200).json({message:`Usuario registrado con éxito. Para activar su cuenta, ingrese al enlace enviado a su correo electrónico ${client.email}`})   
    } catch(err) {
        errorHandler(res, err)
    }
})

// PASSWORD RECOVERY

router.post('/forgot-password/', async (req, res) => {
    try {
        const { username } = req.body
        const user = await getUserByUsername(username)
        if(!user) userNotFound(username)
        const token = generateToken()
        user.recovery_token = token
        user.save()

        const recovery_link = `${req.protocol}://${req.get('host')}/auth/reset-password/${token}`

        sendEmail(
            user.email,
            "Password Recovery",
            `Para ${boldStyle("recuperar tu contraseña")} ingresa al siguiente enlace:\n${recovery_link}`
        )
        res.status(200).json({message:"Email sent"})    
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/activate-account/:token', async (req, res) => {
    try {
        const { token } = req.params
        const user = await getUserByRecoveryToken(token)
        if(!user) throw new Error("Token de activación inválido")
        await updateUser(user._id, {suspended:false, recovery_token:""})
        sendEmail(user.admin.email, "Cuenta Activada", `El cliente ${boldStyle(user.fullname)} ha activado su cuenta al verificar el correo ${boldStyle(user.email)}`)
        sendEmail(user.email, "¡Bienvenido a Capital Trade!", welcomeMessage(user), true)
        res.status(200).json({message: "Cuenta activada con éxito, puede ingresar a la plataforma", admin:user.admin})
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params
        const user = await getUserByRecoveryToken(token)
        if(!user) throw new Error("Invalid password recovery link")
        res.status(200).json({token})
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params
        let { password } = req.body
        const user = await getUserByRecoveryToken(token) 
        password = await encryptPassword(password)
        await updateUser(user._id, {password, recovery_token:""})
        res.status(200).json({message: "Password changed successfully"})
    } catch(err) {
        errorHandler(res, err)
    }
})


export default router;
