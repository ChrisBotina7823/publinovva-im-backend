import express from 'express';
import { loginUser } from '../auth/jwt-auth.js';
import { getSuperUserByUsername, getUserByUsername, getUserByRecoveryToken, updateUser } from '../controller/user-controller.js';
import { getClientByUsername } from '../controller/client-controller.js';
import { getAdminByUsername } from '../controller/admin-controller.js';
import { encryptPassword, generateToken } from '../helpers/encryption.js';
import { sendEmail } from '../helpers/email-manager.js';
import { errorHandler } from '../middlewares/login-md.js';
import { userNotFound } from '../helpers/exceptions.js';

const router = express.Router();

router.post('/superuser', async (req, res) => {
    await loginUser(req, res, getSuperUserByUsername);
});

router.post('/client', async (req, res) => {
    await loginUser(req, res, getClientByUsername);
});

router.post('/admin', async (req, res) => {
    await loginUser(req, res, getAdminByUsername);
});

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
            `Para recuperar tu contraseña ingresa al siguiente enlace:\n${recovery_link}`
        )
        res.status(200).json({message:"Email sent"})    
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
        await updateUser(user.username, {password, recovery_token:""})
        res.status(200).json({message: "Password changed successfully"})
    } catch(err) {
        errorHandler(res, err)
    }
})


export default router;
