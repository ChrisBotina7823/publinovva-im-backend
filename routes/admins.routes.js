import express from 'express';
import { encryptPassword } from '../helpers/encryption.js';
import { deleteAdmin, insertAdmin, updateAdmin, getAdminByUsername, getAllAdmins, getAdminClients } from '../controller/admin-controller.js';
import { errorHandler, isAdminLogged, isSuperUserLogged } from '../middlewares/login-md.js';
import upload from '../helpers/multer-config.js';
import { updateFileAttribute } from '../controller/user-controller.js';
import { config } from 'dotenv';
import { getAllClients } from '../controller/client-controller.js';
config()

const router = express.Router();

router.get('/', isSuperUserLogged, async (req, res) => {
    try {
        const admins = await getAllAdmins()
        res.status(200).json(admins)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/clients', isAdminLogged, async (req, res) => {
    try {
        const clients = req.user.__t ? (await getAdminClients(req.user.username)) : (await getAllClients())
        res.status(200).json(clients)  
    } catch( err ) {
        errorHandler(res, err)
    }
})  

router.get('/:username', async (req, res, next) => {
    try {
        const { username } = req.params;
        const admin = await getAdminByUsername(username);
        res.status(200).json(admin);
    } catch (err) {
        errorHandler(res, err)
    }
});

// Crear un nuevo administrador
router.post('/', isSuperUserLogged, async (req, res, next) => {
    try {
        let newAdmin = req.body
        newAdmin.password = await encryptPassword(req.body.password)
        await insertAdmin(newAdmin);
        res.status(200).json(newAdmin);
    } catch (err) {
        errorHandler(res, err)
    }
});

router.post('/deposit-qr/:username', upload.single('deposit_qr'), async (req, res) => {
    try {
        const { username } = req.params;
        const deposit_qr = await updateFileAttribute(username, process.env.DRIVE_DEPOSIT_QR_FOLDER, req.file, 'deposit_qr');
        const updatedAdmin = await updateAdmin(username, {deposit_qr})
        res.status(200).json(updatedAdmin);
    } catch (err) {
        errorHandler(res, err);
    }    
})

router.put('/:username', isAdminLogged, async (req, res, next) => {
    try {
        const { username } = req.params
        let adminInfo = req.body
        const updatedAdmin = await updateAdmin(username, adminInfo);
        res.status(200).json(updatedAdmin);
    } catch (err) {
        errorHandler(res, err)
    }
});

router.put('/account-state/:username', async (req, res) => {
    try {
        const { account_state } = req.body
        const { username } = req.params
        updateAdmin(username, {account_state})
        res.status(200).json({message: `${username} Admin status changed to ${account_state}`})
    } catch(err) {
        errorHandler(res, err)
    }
})

// Eliminar un administrador
router.delete('/:username', isAdminLogged, async (req, res, next) => {
    try {
        const { username } = req.params;
        await deleteAdmin(username);
        res.status(200).json({ message: `Deleted user ${username}` });
    } catch (err) {
        errorHandler(res, err)
    }
});
export default router;