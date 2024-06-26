import express from 'express';
import { encryptPassword } from '../helpers/encryption.js';
import { deleteAdmin, insertAdmin, updateAdmin, getAdminByUsername, getAllAdmins, getAdminClients } from '../controller/admin-controller.js';
import { errorHandler, isAdminLogged, isSuperUserLogged } from '../middlewares/login-md.js';
import upload from '../helpers/multer-config.js';
import { getUserById, updateFileAttribute } from '../controller/user-controller.js';
import { config } from 'dotenv';
import { getAllClients } from '../controller/client-controller.js';
import { Admin } from '../model/models.js';

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
        const clients = req.user.__t ? (await getAdminClients(req.user._id)) : (await getAllClients())
        res.status(200).json(clients)  
    } catch( err ) {
        errorHandler(res, err)
    }
})  

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const admin = await getUserById(id);
        res.status(200).json(admin);
    } catch (err) {
        errorHandler(res, err)
    }
});

// Crear un nuevo administrador
router.post('/', isSuperUserLogged, async (req, res) => {
    try {
        let newAdmin = req.body
        newAdmin.password = await encryptPassword(req.body.password)
        const updatedAdmin = await insertAdmin(newAdmin);
        Admin.collection.getIndexes({full: true}).then(indexes => {
            console.log("Indexes:", indexes);
        }).catch(console.error);
        req.io.emit("adminsUpdate")
        req.io.emit("usersUpdate")
        res.status(200).json(updatedAdmin);
    } catch (err) {
        errorHandler(res, err)
    }
});

router.post('/files/:filename/:id', (req, res, next) => {
    upload.single(req.params.filename)(req, res, next);
}, async (req, res) => {
    try {
        const { id, filename } = req.params;
        const updatedAdmin = await updateFileAttribute(id, process.env.DRIVE_PROFILE_PICTURE_FOLDER, req.file, filename);
        console.log(updatedAdmin)
        req.io.emit("adminsUpdate")
        req.io.emit("usersUpdate")
        res.status(200).json(updatedAdmin);
    } catch (err) {
        errorHandler(res, err);
    }    
})

router.put('/:id', isAdminLogged, async (req, res, next) => {
    try {
        const { id } = req.params
        let adminInfo = req.body
        const prevUser = await getUserById(id)
        if(adminInfo.password) {
            adminInfo.password = await encryptPassword(adminInfo.password)
            adminInfo.passwordVersion = prevUser.passwordVersion+1
        } 
        const updatedAdmin = await updateAdmin(id, adminInfo);
        req.io.emit("adminsUpdate")
        req.io.emit("usersUpdate")
        res.status(200).json(updatedAdmin);
    } catch (err) {
        errorHandler(res, err)
    }
});

router.put('/account-state/:id', async (req, res) => {
    try {
        const { account_state } = req.body
        const { id } = req.params
        updateAdmin(id, {account_state})
        req.io.emit("adminsUpdate")
        res.status(200).json({message: `${id} Admin status changed to ${account_state}`})
    } catch(err) {
        errorHandler(res, err)
    }
})

// Eliminar un administrador
router.delete('/:id', isAdminLogged, async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteAdmin(id);
        req.io.emit("adminsUpdate")
        res.status(200).json({ message: `Deleted user ${id}` });
    } catch (err) {
        errorHandler(res, err)
    }
});
export default router;