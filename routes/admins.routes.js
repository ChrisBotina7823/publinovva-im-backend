import express from 'express';
import { encryptPassword } from '../helpers/encryption.js';
import { deleteAdmin, insertAdmin, updateAdmin, getAdminByUsername, getAllAdmins } from '../controller/admin-controller.js';
import { errorHandler, isAdminLogged, isSuperUserLogged } from '../middlewares/login-md.js';
import upload from '../helpers/multer-config.js';
import { updateFileAttribute } from '../controller/user-controller.js';
import { config } from 'dotenv';
config()

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const admins = await getAllAdmins()
        res.status(200).json(admins)
    } catch(err) {
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

router.post('/', isSuperUserLogged, async (req, res, next) => {
    try {
        const { username, password, email, profile_picture = undefined, entity_name, deposit_address, deposit_qr } = req.body;
        let newAdmin = {
            username,
            password: await encryptPassword(password),
            email,
            profile_picture,
            entity_name,
            deposit_address,
            deposit_qr
        };
        await insertAdmin(newAdmin);
        res.status(200).json({ message: `Admin added: ${username}` });
    } catch (err) {
        errorHandler(res, err)
    }
});

router.post('/deposit-qr/:username', upload.single('deposit_qr'), async (req, res) => {
    try {
        const { username } = req.params;
        const deposit_qr = await updateFileAttribute(username, process.env.DRIVE_DEPOSIT_QR_FOLDER, req.file, 'deposit_qr');
        await updateAdmin(username, {deposit_qr})
        res.status(200).json({ message: `${username} deposit qr updated successfully` });
    } catch (err) {
        errorHandler(res, err);
    }    
})

router.put('/:prevUsername', isAdminLogged, async (req, res, next) => {
    try {
        const { prevUsername } = req.params;
        const { username, password, email, entity_name, deposit_address, deposit_qr = undefined } = req.body;
        let updatedAdmin = {
            username,
            password: await encryptPassword(password),
            email,
            profile_picture,
            entity_name,
            deposit_address,
            deposit_qr
        };
        await updateAdmin(prevUsername, updatedAdmin);
        res.status(200).json({ message: `Admin information updated: ${username}` });
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