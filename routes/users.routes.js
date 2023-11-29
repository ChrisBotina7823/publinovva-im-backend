import express from 'express';
import { insertUser, deleteUser, updateUser, getUserByUsername, updateFileAttribute, getAllUsers } from '../controller/user-controller.js';
import { encryptPassword } from '../helpers/encryption.js';
import { errorHandler } from '../middlewares/login-md.js';
import { getClientByUsername } from '../controller/client-controller.js';
import { getAdminByUsername, getAdminClients } from '../controller/admin-controller.js';
import upload from '../helpers/multer-config.js';
import { deleteFile, uploadFile } from '../helpers/drive-upload.js';
const router = express.Router();
import { config } from 'dotenv';
import { getIdFromUrl, getUrlFromId } from '../helpers/object-depuration.js';
config()

// CRUD ROUTES

router.get('/', async (req, res) => {
    try {
        const users = await getAllUsers()
        res.status(200).json(users)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.get('/:username', async (req, res) => {
    try {
        const {username} = req.params
        const user = await getUserByUsername(username)
        res.status(200).json(user)
    } catch(err) {
        errorHandler(res, err)
    }
})

router.post('/', async (req, res) => {
        try {
            const { username, password, email } = req.body;
            const newUser = {
                username,
                password: await encryptPassword(password),
                email
            };
            await insertUser(newUser);
            res.status(200).json({ message: `User registered: ${username}` });
        } catch (err) {
            errorHandler(res, err)
        }
    });

router.put('/:prevUsername', async (req, res) => {
    try {
        const { prevUsername } = req.params;
        console.log(req.user)
        // A user in general can only edit his profile.
        // A superuser can edit anyone's profile

        if(req.user.__t && req.user.username != prevUsername) throw new Error(`You do not have the permissions to edit this profile`)
        
        if(req.user.__t == 'Admin' && req.user.username != prevUsername) {
            const adminUsers = ( await getAdminClients(req.user.username) )
            const prevUser = adminUsers.find( u => u.username = prevUsername )
            if(!prevUser) throw new Error(`You do not have permissions to edit this client`)
        }

        const { username, email, profile_picture = undefined } = req.body;
        const newUser = {
            username,
            email,
            profile_picture
        };
        await updateUser(prevUsername, newUser);
        res.status(200).json({ message: `User updated successfully` });
    } catch (err) {
        errorHandler(res, err)
    }
});

router.delete('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        await deleteUser(username);
        res.status(200).json({ message: `Deleted user ${username}` });
    } catch (err) {
        errorHandler(res, err)
    }
});

router.post('/profile-picture/:username', upload.single('profile_picture'), async (req, res) => {
    try {
        if(!req.file) throw new Error('You must upload a file')
        const { username } = req.params;
        const profile_picture = await updateFileAttribute(username, process.env.DRIVE_PROFILE_PICTURE_FOLDER, req.file, 'profile_picture');
        await updateUser(username, {profile_picture})
        res.status(200).json({ message: `${username} profile picture updated successfully` });
    } catch (err) {
        errorHandler(res, err);
    }
})

export default router;
